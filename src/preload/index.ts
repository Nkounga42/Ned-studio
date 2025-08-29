import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Fusion de toutes les APIs
const api = {
  // Plugin management
  plugins: {
    getAll: () => ipcRenderer.invoke('plugin:getAll'),
    load: (pluginId: string) => ipcRenderer.invoke('plugin:load', pluginId),
    reload: () => ipcRenderer.invoke('plugin:reload'),
  },

  // Plugin API
  pluginAPI: {
    showNotification: (message: string, type?: string) =>
      ipcRenderer.invoke('pluginAPI:showNotification', message, type),
    getAppVersion: () =>
      ipcRenderer.invoke('pluginAPI:getAppVersion'),
    openDialog: (options: any) =>
      ipcRenderer.invoke('pluginAPI:openDialog', options),
    writeFile: (path: string, content: string) =>
      ipcRenderer.invoke('pluginAPI:writeFile', path, content),
    readFile: (path: string) =>
      ipcRenderer.invoke('pluginAPI:readFile', path),
  },

  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizedChange: (cb: (isMaximized: boolean) => void) => {
    const handler = (_: any, value: boolean) => cb(value);
    ipcRenderer.on('window:isMaximized', handler);
    return () => ipcRenderer.removeListener('window:isMaximized', handler);
  },
};

// Exposer tout via contextBridge une seule fois
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // fallback pour dev
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.api = api;
}
