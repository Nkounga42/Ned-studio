# Guide de Développement de Plugins

## Vue d’ensemble

Ce guide explique comment créer des plugins pour l’application **NED Studio** sous Electron. Les plugins sont des composants React pouvant être chargés dynamiquement et affichés dans l’application principale.

## Structure d’un Plugin

Chaque plugin doit être contenu dans son propre répertoire dans le dossier `plugins/` avec la structure suivante :

```
plugins/
└── nom-de-votre-plugin/
    ├── plugin.json          # Manifest du plugin
    ├── bundle.js            # Composant React compilé
    ├── src/                 # Fichiers source (optionnel)
    │   └── index.tsx        # Composant principal
    ├── package.json         # Dépendances et scripts de build
    ├── vite.config.ts       # Configuration du build
    └── tsconfig.json        # Configuration TypeScript
```

## Manifest du Plugin (plugin.json)

Le fichier `plugin.json` décrit votre plugin :

```json
{
  "name": "Nom de votre plugin",
  "version": "1.0.0",
  "description": "Description de ce que fait le plugin",
  "author": "Votre nom",
  "entry": "bundle.js",
  "icon": "icon.png",
  "permissions": ["notification"],
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

### Champs :

* **name** : Nom affiché du plugin
* **version** : Version sémantique du plugin
* **description** : Brève description de la fonctionnalité
* **author** : Auteur du plugin
* **entry** : Chemin vers le fichier bundle compilé
* **icon** : Chemin optionnel vers l’icône
* **permissions** : Tableau des permissions requises
* **dependencies** : Dépendances nécessaires

## API du Plugin

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

## Création d’un Plugin

### 1. Créer le répertoire du plugin

```bash
mkdir plugins/mon-plugin
cd plugins/mon-plugin
```

### 2. Initialiser le package

```bash
npm init -y
```

### 3. Installer les dépendances

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react typescript vite
```

### 4. Créer les fichiers source

**src/index.tsx :**

```tsx
import React, { useState } from 'react'

declare global {
  var pluginAPI: {
    showNotification: (message: string, type?: string) => Promise<boolean>
    getAppVersion: () => Promise<string>
    // ... autres méthodes de l’API
  }
}

const MonPlugin: React.FC = () => {
  const [message, setMessage] = useState('Bonjour depuis mon plugin !')

  const handleClick = async () => {
    await pluginAPI.showNotification(message, 'info')
  }

  return (
    <div>
      <h1>Mon Plugin</h1>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={handleClick}>
        Afficher la notification
      </button>
    </div>
  )
}

export default MonPlugin
```

### 5. Configurer le build (vite.config.ts)

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

### 6. Compiler le plugin

```bash
npm run build
```

### 7. Créer le manifest

Créez `plugin.json` avec les informations de votre plugin.

## Exemple de Plugin

Le plugin `hello-world` dans ce répertoire montre un exemple complet avec :

* Structure de composant React de base
* Utilisation de l’API du plugin
* Gestion d’état
* Intégration du dialogue de fichiers
* Notifications

## Scripts de Build

Ajoutez ces scripts dans votre `package.json` :

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  }
}
```

## Tester votre Plugin

1. Compiler le plugin : `npm run build`
2. Redémarrer l’application principale
3. Aller dans l’onglet Plugins
4. Votre plugin doit apparaître dans la liste
5. Cliquer dessus pour charger et tester

## Bonnes pratiques

1. **Gestion des erreurs** : Encapsuler les appels API dans des `try-catch`
2. **Performance** : Garder les composants légers et éviter les calculs lourds
3. **Sécurité** : Ne demander que les permissions nécessaires
4. **UI/UX** : Respecter le style de l’application principale
5. **Dépendances** : Minimiser les dépendances externes pour réduire la taille du bundle

## Résolution de problèmes

* **Plugin n’apparaît pas** : Vérifiez que `plugin.json` est un JSON valide
* **Erreurs de chargement** : Vérifiez que `bundle.js` existe et est correctement compilé
* **Erreurs API** : Vérifiez que vous utilisez les signatures correctes des méthodes
* **Problèmes de build** : Vérifiez que toutes les dépendances sont bien installées
