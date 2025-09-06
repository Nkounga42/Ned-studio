// global.d.ts
export {};

import type { LoadedPlugin } from '../../types/plugin'

declare global {
  interface Window {
    api: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void;
      plugins: {
        getAll: () => Promise<LoadedPlugin[]>;
        load: (pluginId: string) => Promise<string | null>;
        reload: () => Promise<LoadedPlugin[]>;
      };
      pluginAPI: {
        showNotification: (message: string, type?: string) => Promise<boolean>;
        getAppVersion: () => Promise<string>;
        openDialog: (options: any) => Promise<any>;
        writeFile: (path: string, content: string) => Promise<boolean>;
        readFile: (path: string) => Promise<string>;
      };
    };
  }
}

