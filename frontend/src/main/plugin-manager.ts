import { app, ipcMain, dialog } from 'electron'
import { readdir, readFile, access } from 'fs/promises'
import { join } from 'path'
import { PluginManifest, LoadedPlugin } from '../types/plugin'
import { toast, Toaster } from 'sonner'

export class PluginManager {
  private plugins: Map<string, LoadedPlugin> = new Map()
  private pluginsPath: string

  constructor() {
    // Use the plugins directory in the project root instead of userData
    this.pluginsPath = join(__dirname, '../../plugins')
    this.initializeIPC()
  }

  private initializeIPC(): void {
    ipcMain.handle('plugin:getAll', () => {
      return Array.from(this.plugins.values())
    })

    ipcMain.handle('plugin:load', async (_, pluginId: string) => {
      return this.loadPluginComponent(pluginId)
    })

    ipcMain.handle('plugin:reload', async () => {
      return this.scanPlugins()
    })

    // Plugin API methods
    ipcMain.handle('pluginAPI:showNotification', (_, message: string, type: string = 'info') => {
      // Implementation for showing notifications
      console.log(`[${type.toUpperCase()}] ${message}`)
      toast(message)
      return true
    })

    ipcMain.handle('pluginAPI:getAppVersion', () => {
      return app.getVersion()
    })

    ipcMain.handle('pluginAPI:openDialog', async (_, options: any) => {
      const result = await dialog.showOpenDialog(options)
      return result
    })

    ipcMain.handle('pluginAPI:writeFile', async (_, path: string, content: string) => {
      const fs = await import('fs/promises')
      await fs.writeFile(path, content, 'utf8')
      return true
    })

    ipcMain.handle('pluginAPI:readFile', async (_, path: string) => {
      const fs = await import('fs/promises')
      const content = await fs.readFile(path, 'utf8')
      return content
    })
  }

  async scanPlugins(): Promise<LoadedPlugin[]> {
    try {
      console.log('Scanning plugins in:', this.pluginsPath)
      
      // Ensure plugins directory exists
      await access(this.pluginsPath).catch(async () => {
        console.log('Plugins directory does not exist, creating:', this.pluginsPath)
        const fs = await import('fs/promises')
        await fs.mkdir(this.pluginsPath, { recursive: true })
      })

      const entries = await readdir(this.pluginsPath, { withFileTypes: true })
      const pluginDirs = entries.filter(entry => entry.isDirectory())
      
      console.log('Found plugin directories:', pluginDirs.map(d => d.name))

      this.plugins.clear()

      for (const dir of pluginDirs) {
        try {
          const pluginPath = join(this.pluginsPath, dir.name)
          const manifestPath = join(pluginPath, 'plugin.json')
          
          console.log(`Loading plugin ${dir.name} from ${manifestPath}`)
          
          const manifestContent = await readFile(manifestPath, 'utf8')
          const manifest: PluginManifest = JSON.parse(manifestContent)
          
          const plugin: LoadedPlugin = {
            id: dir.name,
            manifest,
            path: pluginPath,
            isLoaded: false
          }

          // Verify entry file exists
          const entryPath = join(pluginPath, manifest.entry)
          await access(entryPath)
          
          console.log(`Successfully loaded plugin: ${manifest.name}`)
          this.plugins.set(dir.name, plugin)
        } catch (error) {
          console.error(`Failed to load plugin ${dir.name}:`, error)
          this.plugins.set(dir.name, {
            id: dir.name,
            manifest: { name: dir.name, version: '0.0.0', description: 'Failed to load', entry: '' },
            path: join(this.pluginsPath, dir.name),
            isLoaded: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      console.log(`Loaded ${this.plugins.size} plugins total`)
      return Array.from(this.plugins.values())
    } catch (error) {
      console.error('Failed to scan plugins:', error)
      return []
    }
  }

  private async loadPluginComponent(pluginId: string): Promise<string | null> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin || plugin.error) {
      return null
    }

    try {
      const entryPath = join(plugin.path, plugin.manifest.entry)
      const bundleContent = await readFile(entryPath, 'utf8')
      
      plugin.isLoaded = true
      this.plugins.set(pluginId, plugin)
      
      return bundleContent
    } catch (error) {
      console.error(`Failed to load plugin component ${pluginId}:`, error)
      plugin.error = error instanceof Error ? error.message : 'Failed to load component'
      plugin.isLoaded = false
      this.plugins.set(pluginId, plugin)
      return null
    }
  }

  getPluginsPath(): string {
    return this.pluginsPath
  }
}
