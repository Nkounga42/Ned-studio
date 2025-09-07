# 🔌 Guide de Développement de Plugins NED Studio

## Vue d'Ensemble

Ce guide explique comment créer des plugins pour l'application NED Studio. Les plugins sont des composants React qui peuvent être chargés dynamiquement et rendus dans l'application principale.

## 📁 Structure d'un Plugin

Chaque plugin doit être contenu dans son propre répertoire dans le dossier `plugins/` avec la structure suivante :

```
plugins/
└── mon-plugin/
    ├── plugin.json          # Manifeste du plugin (obligatoire)
    ├── bundle.js           # Composant React compilé (obligatoire)
    ├── src/                # Fichiers source (optionnel)
    │   └── index.tsx       # Composant principal
    ├── package.json        # Dépendances et scripts de build
    ├── vite.config.ts      # Configuration de build
    └── tsconfig.json       # Configuration TypeScript
```

## 📋 Manifeste du Plugin (plugin.json)

Le fichier `plugin.json` décrit votre plugin :

```json
{
  "name": "Mon Super Plugin",
  "version": "1.0.0",
  "description": "Description de ce que fait votre plugin",
  "author": "Votre Nom",
  "entry": "bundle.js",
  "icon": "icon.png",
  "permissions": ["notification"],
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

### Champs du Manifeste :
- **name** : Nom d'affichage de votre plugin
- **version** : Version sémantique du plugin
- **description** : Brève description des fonctionnalités
- **author** : Nom de l'auteur du plugin
- **entry** : Chemin vers le fichier bundle compilé
- **icon** : Fichier d'icône optionnel
- **permissions** : Tableau des permissions requises
- **dependencies** : Dépendances requises

## 🛠️ API des Plugins

Les plugins ont accès à un objet global `pluginAPI` avec les méthodes suivantes :

```typescript
interface PluginAPI {
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => Promise<boolean>
  getAppVersion: () => Promise<string>
  openDialog: (options: any) => Promise<any>
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
}
```

### Exemples d'utilisation :

```javascript
// Afficher une notification
await pluginAPI.showNotification('Hello World!', 'info')

// Obtenir la version de l'application
const version = await pluginAPI.getAppVersion()

// Ouvrir un dialogue de fichier
const result = await pluginAPI.openDialog({
  title: 'Sélectionner un fichier',
  properties: ['openFile'],
  filters: [
    { name: 'Fichiers texte', extensions: ['txt'] },
    { name: 'Tous les fichiers', extensions: ['*'] }
  ]
})
```

## 🚀 Créer un Plugin Étape par Étape

### Méthode 1 : Création Automatique (Recommandée)

**Créer un nouveau plugin avec l'assistant :**
```bash
npm run ned-plugin:create
```

Cette commande interactive va :
- Demander les informations du plugin (nom, description, auteur)
- Créer automatiquement la structure complète
- Générer tous les fichiers de configuration
- Créer un composant React de base

**Puis builder le plugin :**
```bash
npm run ned-plugin:build
```

### Méthode 2 : Création Manuelle

### 1. Créer le Répertoire du Plugin
```bash
mkdir plugins/mon-plugin
cd plugins/mon-plugin
```

### 2. Créer le Manifeste
Créez `plugin.json` avec les informations de votre plugin.

### 3. Créer le Composant Source

**src/index.tsx :**
```tsx
import React, { useState } from 'react'

declare global {
  var pluginAPI: {
    showNotification: (message: string, type?: string) => Promise<boolean>
    getAppVersion: () => Promise<string>
    openDialog: (options: any) => Promise<any>
    writeFile: (path: string, content: string) => Promise<void>
    readFile: (path: string) => Promise<string>
  }
}

const MonPlugin: React.FC = () => {
  const [message, setMessage] = useState('Hello from my plugin!')

  const handleClick = async () => {
    await pluginAPI.showNotification(message, 'info')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Mon Plugin</h1>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={handleClick} style={{ padding: '5px 10px' }}>
        Afficher Notification
      </button>
    </div>
  )
}

export default MonPlugin
```

### 4. Build Automatique avec NED Studio

**Commande simple pour builder tous les plugins :**
```bash
npm run ned-plugin:build
```

Cette commande va automatiquement :
- Détecter tous les plugins dans le dossier `plugins/`
- Installer les dépendances si nécessaire
- Builder chaque plugin avec Vite
- Générer les bundles `bundle.js`

### 5. Créer le Bundle Manuellement (Alternative)

Pour un développement rapide, vous pouvez aussi créer directement le `bundle.js` :

```javascript
// bundle.js
(function() {
  const MonPlugin = () => {
    const [message, setMessage] = React.useState('Hello from my plugin!');
    
    const handleClick = async () => {
      await pluginAPI.showNotification(message, 'info');
    };

    return React.createElement("div", { 
      style: { padding: "20px", fontFamily: "Arial, sans-serif" } 
    }, 
      React.createElement("h1", null, "Mon Plugin"),
      React.createElement("input", {
        value: message,
        onChange: (e) => setMessage(e.target.value),
        style: { marginRight: "10px", padding: "5px" }
      }),
      React.createElement("button", {
        onClick: handleClick,
        style: { padding: "5px 10px" }
      }, "Afficher Notification")
    );
  };

  // Export du composant
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonPlugin;
  } else {
    window.MonPlugin = MonPlugin;
  }
})();
```

### 5. Configuration de Build Automatique (Optionnel)

**package.json :**
```json
{
  "name": "mon-plugin",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.8.3",
    "vite": "^7.0.5"
  }
}
```

**vite.config.ts :**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'MonPlugin',
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

**tsconfig.json :**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## 🧪 Tester Votre Plugin

1. **Redémarrez l'application** : `npm run dev`
2. **Naviguez vers l'onglet Plugins**
3. **Votre plugin devrait apparaître** dans la liste
4. **Cliquez dessus** pour le charger et le tester

## 📝 Bonnes Pratiques

### Sécurité
- Toujours encapsuler les appels API dans des blocs try-catch
- Ne demander que les permissions nécessaires
- Valider les entrées utilisateur

### Performance
- Garder les composants légers
- Éviter les calculs lourds dans le rendu
- Utiliser React.memo() pour les composants complexes

### Interface Utilisateur
- Suivre un style cohérent avec l'application principale
- Utiliser des couleurs et polices appropriées
- Assurer la responsivité

### Exemple de Style Cohérent :
```javascript
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Inter, -apple-system, sans-serif',
    maxWidth: '800px'
  },
  button: {
    background: '#007acc',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  input: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '14px'
  }
}
```

## 🔧 Dépannage

### Plugin non détecté
- Vérifiez que `plugin.json` est un JSON valide
- Assurez-vous que le répertoire est dans `plugins/`
- Redémarrez l'application

### Erreurs de chargement
- Vérifiez que `bundle.js` existe et est correctement généré
- Consultez la console de développement (F12) pour les erreurs
- Vérifiez la syntaxe JavaScript du bundle

### Erreurs API
- Assurez-vous d'utiliser les bonnes signatures de méthodes
- Vérifiez que `pluginAPI` est disponible globalement
- Utilisez async/await pour les appels API

## 📚 Ressources

- **Exemple complet** : Consultez le plugin `hello-world` dans le répertoire `plugins/`
- **Documentation React** : https://react.dev/
- **API Electron** : https://electronjs.org/docs
- **TypeScript** : https://www.typescriptlang.org/

## 🆘 Support

Pour obtenir de l'aide :
1. Consultez les logs de l'application
2. Vérifiez la console de développement
3. Examinez le plugin d'exemple `hello-world`
4. Testez avec un plugin minimal d'abord

---

**Bonne création de plugins ! 🚀**
