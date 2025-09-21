import { app, ipcMain, dialog } from 'electron'
import { readdir, readFile, access, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { PluginManifest, LoadedPlugin } from '../types/plugin'
import { toast } from 'sonner'

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

    ipcMain.handle('plugin:import', async (_, fileBuffer: ArrayBuffer, fileName: string) => {
      return this.importPlugin(fileBuffer, fileName)
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
      // console.log('Scanning plugins in:', this.pluginsPath)
      
      // Ensure plugins directory exists
      await access(this.pluginsPath).catch(async () => {
        // console.log('Plugins directory does not exist, creating:', this.pluginsPath)
        const fs = await import('fs/promises')
        await fs.mkdir(this.pluginsPath, { recursive: true })
      })

      const entries = await readdir(this.pluginsPath, { withFileTypes: true })
      const pluginDirs = entries.filter(entry => entry.isDirectory())
      
      // console.log('Found plugin directories:', pluginDirs.map(d => d.name))

      this.plugins.clear()

      for (const dir of pluginDirs) {
        try {
          const pluginPath = join(this.pluginsPath, dir.name)
          const manifestPath = join(pluginPath, 'plugin.json')
          
          // console.log(`Loading plugin ${dir.name} from ${manifestPath}`)
          
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
          
          // console.log(`Successfully loaded plugin: ${manifest.name}`)
          this.plugins.set(dir.name, plugin)
        } catch (error) {
          // console.error(`Failed to load plugin ${dir.name}:`, error)
          this.plugins.set(dir.name, {
            id: dir.name,
            manifest: { name: dir.name, version: '0.0.0', description: 'Failed to load', entry: '' },
            path: join(this.pluginsPath, dir.name),
            isLoaded: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      // console.log(`Loaded ${this.plugins.size} plugins total`)
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
      // console.error(`Failed to load plugin component ${pluginId}:`, error)
      plugin.error = error instanceof Error ? error.message : 'Failed to load component'
      plugin.isLoaded = false
      this.plugins.set(pluginId, plugin)
      return null
    }
  }

  async importPlugin(fileBuffer: ArrayBuffer, fileName: string): Promise<{ success: boolean; message: string; pluginId?: string }> {
    try {
      // Ensure plugins directory exists
      await access(this.pluginsPath).catch(async () => {
        await mkdir(this.pluginsPath, { recursive: true })
      })

      // For now, we'll handle simple plugin files (JS/TS)
      // In a real implementation, you'd want to handle ZIP files with extraction
      if (fileName.endsWith('.zip')) {
        return {
          success: false,
          message: 'ZIP file extraction not yet implemented. Please extract manually to plugins folder.'
        }
      }

      // Handle single JS/TS files
      if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
        const pluginName = fileName.replace(/\.(js|ts)$/, '')
        const pluginDir = join(this.pluginsPath, pluginName)
        
        // Create plugin directory
        await mkdir(pluginDir, { recursive: true })
        
        // Save the file
        const buffer = Buffer.from(fileBuffer)
        const filePath = join(pluginDir, fileName)
        await writeFile(filePath, buffer)
        
        // Create a basic plugin.json manifest
        const manifest: PluginManifest = {
          name: pluginName,
          version: '1.0.0',
          description: `Imported plugin: ${pluginName}`,
          entry: fileName,
          author: 'Unknown'
        }
        
        const manifestPath = join(pluginDir, 'plugin.json')
        await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
        
        // Rescan plugins to include the new one
        await this.scanPlugins()
        
        return {
          success: true,
          message: `Plugin "${pluginName}" imported successfully`,
          pluginId: pluginName
        }
      }

      return {
        success: false,
        message: 'Unsupported file format. Please use .js, .ts, or .zip files.'
      }
    } catch (error) {
      // console.error('Failed to import plugin:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  getPluginsPath(): string {
    return this.pluginsPath
  }
}
