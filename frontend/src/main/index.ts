import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils' 
import logoIcon from '../../src/renderer/src/assets/img/logo.png?asset'
import { PluginManager } from './plugin-manager'
// import { title } from 'process'

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

   
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

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

