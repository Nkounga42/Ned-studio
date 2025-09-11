#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const PLUGINS_DIR = path.join(__dirname, '../plugins');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createPlugin() {
  console.log('🔌 NED Studio Plugin Creator');
  console.log('============================\n');

  const pluginName = await question('Plugin name: ');
  const pluginId = pluginName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const description = await question('Description: ');
  const author = await question('Author: ');
  const version = (await question('Version (1.0.0): ')) || '1.0.0';

  rl.close();

  const pluginDir = path.join(PLUGINS_DIR, pluginId);

  try {
    // Créer le dossier du plugin
    await fs.mkdir(pluginDir, { recursive: true });
    await fs.mkdir(path.join(pluginDir, 'src'), { recursive: true });

    // Créer plugin.json
    const pluginManifest = {
      name: pluginName,
      version: version,
      description: description,
      author: author,
      entry: "bundle.js",
      permissions: ["notification"],
      dependencies: {
        react: "^19.1.0"
      }
    };

    await fs.writeFile(
      path.join(pluginDir, 'plugin.json'),
      JSON.stringify(pluginManifest, null, 2)
    );

    // Créer package.json
    const packageJson = {
      name: `${pluginId}-plugin`,
      version: version,
      description: `${pluginName} Plugin for NED Studio`,
      main: "bundle.js",
      scripts: {
        build: "vite build",
        dev: "vite build --watch"
      },
      dependencies: {
        react: "^19.1.0",
        "react-dom": "^19.1.0"
      },
      devDependencies: {
        "@types/react": "^19.1.8",
        "@types/react-dom": "^19.1.6",
        "@vitejs/plugin-react": "^4.7.0",
        typescript: "^5.8.3",
        vite: "^7.0.5"
      }
    };

    await fs.writeFile(
      path.join(pluginDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Créer vite.config.ts
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: '${pluginName.replace(/\s+/g, '')}Plugin',
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
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})`;

    await fs.writeFile(path.join(pluginDir, 'vite.config.ts'), viteConfig);

    // Créer tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"]
    };

    await fs.writeFile(
      path.join(pluginDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    // Créer le composant source
    const componentName = pluginName.replace(/\s+/g, '');
    const sourceCode = `import React, { useState } from 'react'

declare global {
  var pluginAPI: {
    showNotification: (message: string, type?: string) => Promise<boolean>
    getAppVersion: () => Promise<string>
    openDialog: (options: any) => Promise<any>
    writeFile: (path: string, content: string) => Promise<void>
    readFile: (path: string) => Promise<string>
  }
}

const ${componentName}Plugin: React.FC = () => {
  const [message, setMessage] = useState('Hello from ${pluginName}!')

  const handleNotification = async () => {
    await pluginAPI.showNotification(message, 'info')
  }

  const handleGetVersion = async () => {
    const version = await pluginAPI.getAppVersion()
    await pluginAPI.showNotification(\`App version: \${version}\`, 'success')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🔌 ${pluginName} 
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Welcome to your new NED Studio plugin!</p>
        <p>Edit this component in <code>src/index.tsx</code></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
            fontSize: '14px'
          }}
          placeholder="Enter a message"
        />
        
        <button 
          onClick={handleNotification}
          style={{
            background: '#007acc',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Show Notification
        </button>

        <button 
          onClick={handleGetVersion}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Get App Version
        </button>
      </div>

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p>Plugin ID: ${pluginId}</p>
        <p>Version: ${version}</p>
      </div>
    </div>
  )
}

export default ${componentName}Plugin`;

    await fs.writeFile(path.join(pluginDir, 'src', 'index.tsx'), sourceCode);

    console.log(`\n✅ Plugin "${pluginName}" created successfully!`);
    console.log(`📁 Location: plugins/${pluginId}/`);
    console.log(`\n🚀 Next steps:`);
    console.log(`1. cd plugins/${pluginId}`);
    console.log(`2. npm install`);
    console.log(`3. npm run build`);
    console.log(`\nOr use: npm run ned-plugin:build`);

  } catch (error) {
    console.error('❌ Failed to create plugin:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  createPlugin().catch(error => {
    console.error('💥 Plugin creation failed:', error);
    process.exit(1);
  });
}
