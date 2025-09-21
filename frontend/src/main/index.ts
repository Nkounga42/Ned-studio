import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils' 
import logoIcon from '../../src/renderer/src/assets/img/logo.png?asset'
import { PluginManager } from './plugin-manager'
import { existsSync, readFileSync } from 'fs'
// import { title } from 'process'

// Fonction pour enregistrer le protocole personnalisé pour les plugins
function registerPluginProtocol(): void {
  protocol.registerFileProtocol('plugin', (request, callback) => {
    try {
      // Extraire le chemin du plugin depuis l'URL
      // Format: plugin://plugin-path/file-path
      const url = request.url.substring('plugin://'.length)
      // Le dossier plugins est à la racine du frontend
      const pluginsDir = join(__dirname, '../../../plugins')
      const fullPath = join(pluginsDir, url)
      
      console.log(`Plugin protocol request: ${request.url} -> ${fullPath}`)
      
      // Vérifier que le fichier existe et est dans le dossier plugins
      if (existsSync(fullPath) && fullPath.startsWith(pluginsDir)) {
        callback({ path: fullPath })
      } else {
        console.error(`Plugin file not found or outside plugins directory: ${fullPath}`)
        callback({ error: -6 }) // FILE_NOT_FOUND
      }
    } catch (error) {
      console.error('Plugin protocol error:', error)
      callback({ error: -2 }) // GENERIC_FAILURE
    }
  })
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 500,
    minHeight: 500,
    // show: false,
    autoHideMenuBar: true,
    // vibrancy: 'under-window',
    // visualEffectState: 'active',
    // titleBarStyle: 'hidden',
    center: true,
    title: 'NED Studio',
    trafficLightPosition: { x: 10, y: 10 },
    frame: true,
    icon: logoIcon, // Utiliser logo.png comme icône de la taskbar
    ...(process.platform === 'linux' ? { icon: logoIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('maximize', () => mainWindow.webContents.send('window:isMaximized', true));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window:isMaximized', false));

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  /* IPC : contrôles fenêtre */
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:toggleMaximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized());

  /* IPC : icônes des plugins */
  ipcMain.handle('plugin:getIcon', async (_, pluginId: string, iconPath: string) => {
    try {
      const pluginsDir = join(__dirname, '../../../plugins');
      const fullIconPath = join(pluginsDir, pluginId, iconPath);
      
      console.log(`Reading plugin icon: ${fullIconPath}`);
      
      if (existsSync(fullIconPath) && fullIconPath.startsWith(pluginsDir)) {
        const iconData = readFileSync(fullIconPath);
        const base64Data = iconData.toString('base64');
        const mimeType = iconPath.endsWith('.png') ? 'image/png' : 
                        iconPath.endsWith('.jpg') || iconPath.endsWith('.jpeg') ? 'image/jpeg' :
                        iconPath.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
        
        return `data:${mimeType};base64,${base64Data}`;
      } else {
        console.error(`Plugin icon not found: ${fullIconPath}`);
        return null;
      }
    } catch (error) {
      console.error('Error reading plugin icon:', error);
      return null;
    }
  });

   
}

// Register protocol before app is ready
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register custom protocol for plugins
  registerPluginProtocol()

  // Initialize plugin manager
  const pluginManager = new PluginManager()
  await pluginManager.scanPlugins()
 
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () { 
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}) 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

