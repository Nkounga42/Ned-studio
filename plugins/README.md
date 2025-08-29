# Plugin Development Guide

## Overview

This guide explains how to create plugins for the NED Studio Electron application. Plugins are React components that can be dynamically loaded and rendered within the main application.

## Plugin Structure

Each plugin must be contained in its own directory within the `plugins/` folder with the following structure:

```
plugins/
└── your-plugin-name/
    ├── plugin.json          # Plugin manifest
    ├── bundle.js           # Compiled React component
    ├── src/                # Source files (optional)
    │   └── index.tsx       # Main component source
    ├── package.json        # Dependencies and build scripts
    ├── vite.config.ts      # Build configuration
    └── tsconfig.json       # TypeScript configuration
```

## Plugin Manifest (plugin.json)

The `plugin.json` file describes your plugin:

```json
{
  "name": "Your Plugin Name",
  "version": "1.0.0",
  "description": "Description of what your plugin does",
  "author": "Your Name",
  "entry": "bundle.js",
  "icon": "icon.png",
  "permissions": ["notification"],
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

### Fields:
- **name**: Display name of your plugin
- **version**: Semantic version of your plugin
- **description**: Brief description of functionality
- **author**: Plugin author name
- **entry**: Path to the compiled bundle file
- **icon**: Optional icon file path
- **permissions**: Array of required permissions
- **dependencies**: Required dependencies

## Plugin API

Plugins have access to a global `pluginAPI` object with the following methods:

```typescript
interface PluginAPI {
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => Promise<boolean>
  getAppVersion: () => Promise<string>
  openDialog: (options: any) => Promise<any>
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
}
```

## Creating a Plugin

### 1. Create Plugin Directory
```bash
mkdir plugins/my-plugin
cd plugins/my-plugin
```

### 2. Initialize Package
```bash
npm init -y
```

### 3. Install Dependencies
```bash
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react typescript vite
```

### 4. Create Source Files

**src/index.tsx:**
```tsx
import React, { useState } from 'react'

declare global {
  var pluginAPI: {
    showNotification: (message: string, type?: string) => Promise<boolean>
    getAppVersion: () => Promise<string>
    // ... other API methods
  }
}

const MyPlugin: React.FC = () => {
  const [message, setMessage] = useState('Hello from my plugin!')

  const handleClick = async () => {
    await pluginAPI.showNotification(message, 'info')
  }

  return (
    <div>
      <h1>My Plugin</h1>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={handleClick}>
        Show Notification
      </button>
    </div>
  )
}

export default MyPlugin
```

### 5. Configure Build (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'MyPlugin',
      fileName: 'bundle',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: '.',
    emptyOutDir: false
  }
})
```

### 6. Build Plugin
```bash
npm run build
```

### 7. Create Manifest
Create `plugin.json` with your plugin details.

## Example Plugin

See the `hello-world` plugin in this directory for a complete example that demonstrates:
- Basic React component structure
- Plugin API usage
- State management
- File dialog integration
- Notifications

## Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  }
}
```

## Testing Your Plugin

1. Build your plugin: `npm run build`
2. Restart the main application
3. Navigate to the Plugins tab
4. Your plugin should appear in the list
5. Click on it to load and test

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Performance**: Keep components lightweight and avoid heavy computations
3. **Security**: Only request necessary permissions
4. **UI/UX**: Follow consistent styling with the main application
5. **Dependencies**: Minimize external dependencies to reduce bundle size

## Troubleshooting

- **Plugin not appearing**: Check that `plugin.json` is valid JSON
- **Loading errors**: Verify that `bundle.js` exists and is properly built
- **API errors**: Ensure you're using the correct API method signatures
- **Build issues**: Check that all dependencies are installed correctly
