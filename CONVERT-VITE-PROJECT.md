# 🔄 Convertir un Projet Vite React en Plugin NED Studio

## Guide de Conversion

### Étape 1 : Préparer le projet

1. **Copier votre projet dans plugins/**
```bash
cp -r mon-projet-vite plugins/mon-projet-plugin/
cd plugins/mon-projet-plugin/
```

2. **Sauvegarder la config originale**
```bash
cp vite.config.ts vite.config.original.ts
```

### Étape 2 : Adapter la configuration

**Nouveau vite.config.ts :**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.tsx', // Adaptez selon votre structure
      name: 'MonProjetPlugin',
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
})
```

### Étape 3 : Modifier le point d'entrée

**Avant (src/main.tsx) :**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Après (src/main.tsx) :**
```tsx
import React from 'react'
import App from './App.tsx'
import './index.css'

// Déclaration de l'API des plugins
declare global {
  var pluginAPI: {
    showNotification: (message: string, type?: string) => Promise<boolean>
    getAppVersion: () => Promise<string>
    openDialog: (options: any) => Promise<any>
    writeFile: (path: string, content: string) => Promise<void>
    readFile: (path: string) => Promise<string>
  }
}

// Export direct du composant principal
export default App
```

### Étape 4 : Créer le manifeste

**plugin.json :**
```json
{
  "name": "Mon Projet Importé",
  "version": "1.0.0",
  "description": "Projet Vite React converti en plugin NED Studio",
  "author": "Votre Nom",
  "entry": "bundle.js",
  "permissions": ["notification", "file"],
  "dependencies": {
    "react": "^19.1.0"
  }
}
```

### Étape 5 : Adapter les fonctionnalités

**Intégration de l'API NED Studio dans vos composants :**

```tsx
// Exemple : Composant avec sauvegarde
import React, { useState } from 'react'

const MonComposant = () => {
  const [data, setData] = useState('')

  const handleSave = async () => {
    try {
      await pluginAPI.writeFile('mon-fichier.txt', data)
      await pluginAPI.showNotification('Fichier sauvegardé !', 'success')
    } catch (error) {
      await pluginAPI.showNotification('Erreur de sauvegarde', 'error')
    }
  }

  const handleLoad = async () => {
    try {
      const content = await pluginAPI.readFile('mon-fichier.txt')
      setData(content)
      await pluginAPI.showNotification('Fichier chargé !', 'info')
    } catch (error) {
      await pluginAPI.showNotification('Fichier non trouvé', 'warning')
    }
  }

  return (
    <div>
      <textarea value={data} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleSave}>Sauvegarder</button>
      <button onClick={handleLoad}>Charger</button>
    </div>
  )
}
```

### Étape 6 : Builder et tester

```bash
# Builder le plugin
npm run build

# Ou utiliser le builder NED Studio
cd ../..
npm run ned-plugin:build

# Tester dans l'application
npm run dev
```

## Adaptations Communes

### Suppression du routage
Si votre projet utilise React Router, remplacez par une navigation interne :

```tsx
// Avant
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Après
const [currentView, setCurrentView] = useState('home')

const renderView = () => {
  switch(currentView) {
    case 'home': return <HomeComponent />
    case 'settings': return <SettingsComponent />
    default: return <HomeComponent />
  }
}
```

### Gestion des assets
Les assets doivent être intégrés dans le bundle :

```tsx
// Avant
import logo from './assets/logo.png'

// Après - convertir en base64 ou utiliser des CDN
const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
```

### APIs externes
Remplacer les appels fetch par l'API NED Studio quand possible :

```tsx
// Avant
const response = await fetch('/api/data')

// Après
const data = await pluginAPI.readFile('data.json')
```

## Checklist de Conversion

- [ ] Configuration Vite adaptée
- [ ] Point d'entrée modifié
- [ ] plugin.json créé
- [ ] Routage supprimé/adapté
- [ ] Assets intégrés
- [ ] API NED Studio intégrée
- [ ] Build réussi
- [ ] Test dans l'application

## Dépannage

**Erreur de build :**
- Vérifiez que toutes les dépendances sont installées
- Assurez-vous que le point d'entrée existe

**Plugin ne se charge pas :**
- Vérifiez plugin.json
- Consultez la console pour les erreurs

**Fonctionnalités manquantes :**
- Adaptez le code pour utiliser l'API NED Studio
- Supprimez les dépendances incompatibles
