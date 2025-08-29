export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
  entry: string;
}

export interface LoadedPlugin {
  id: string;
  manifest: PluginManifest;
  path: string;
  isLoaded: boolean;
  error?: string;
}


