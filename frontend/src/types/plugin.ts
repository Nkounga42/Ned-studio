export interface PluginCardProps {
  plugin: LoadedPlugin
  onSelect: (plugin: LoadedPlugin) => void
}
export interface LoadedPlugin {
  id: string;
  manifest: PluginManifest;
  path: string;
  isLoaded: boolean;
  error?: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
  entry: string;
}

