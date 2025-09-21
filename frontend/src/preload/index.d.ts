import { ElectronAPI } from '@electron-toolkit/preload'
import { LoadedPlugin } from '../types/plugin'

 
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      plugins: {
        getAll: () => Promise<LoadedPlugin[]>;
        load: (pluginId: string) => Promise<string | null>;
        reload: () => Promise<LoadedPlugin[]>;
        import: (fileBuffer: ArrayBuffer, fileName: string) => Promise<{ success: boolean; message: string; pluginId?: string }>;
        getIcon: (pluginId: string, iconPath: string) => Promise<string | null>;
      };
      pluginAPI: {
        showNotification: (message: string, type?: string) => Promise<boolean>;
        getAppVersion: () => Promise<string>;
        openDialog: (options: any) => Promise<any>;
        writeFile: (path: string, content: string) => Promise<void>;
        readFile: (path: string) => Promise<string>;
      };
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void;
    };
  }
}
