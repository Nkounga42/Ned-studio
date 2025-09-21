# Système de Notifications - Guide d'utilisation

## Vue d'ensemble

Le système de notifications de NED Studio permet de créer facilement des notifications qui s'affichent à la fois via des toasts (Sonner) et dans l'onglet notifications.

## Installation et Configuration

Le système est déjà configuré dans l'application. Le `NotificationProvider` est intégré dans `main.tsx` et Sonner est configuré.

## Utilisation de base

### 1. Import du hook

```typescript
import { useNotify } from '../hooks/useNotify'

function MyComponent() {
  const notify = useNotify()
  
  // Votre composant...
}
```

### 2. Notifications simples

```typescript
// Notification de succès
notify.success('Opération réussie !')

// Notification d'erreur
notify.error('Une erreur est survenue')

// Notification d'avertissement
notify.warning('Attention requise')

// Notification d'information
notify.info('Information importante')
```

### 3. Notifications avec détails

```typescript
notify.success({
  title: 'Fichier sauvegardé',
  message: 'Le document "projet.txt" a été sauvegardé avec succès.'
})

notify.error({
  title: 'Erreur de connexion',
  message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
})
```

### 4. Notifications avec actions

```typescript
notify.custom({
  type: 'info',
  title: 'Mise à jour disponible',
  message: 'Une nouvelle version de l\'application est disponible.',
  action: {
    label: 'Télécharger',
    onClick: () => {
      // Logique de téléchargement
      window.open('https://releases.example.com', '_blank')
    }
  }
})
```

### 5. Utilisation des templates prédéfinis

```typescript
// Template de connexion réussie
notify.useTemplate(() => notify.templates.loginSuccess('John Doe'))

// Template de plugin chargé
notify.useTemplate(() => notify.templates.pluginLoaded('MonPlugin'))

// Template de sauvegarde
notify.useTemplate(() => notify.templates.saveSuccess('document.txt'))

// Template d'erreur de plugin
notify.useTemplate(() => notify.templates.pluginError('MonPlugin', 'Erreur de chargement'))
```

## Templates disponibles

Le système inclut plusieurs templates prêts à utiliser :

- `loginSuccess(username)` - Connexion réussie
- `loginError(error)` - Erreur de connexion
- `pluginLoaded(pluginName)` - Plugin chargé
- `pluginError(pluginName, error)` - Erreur de plugin
- `saveSuccess(fileName?)` - Sauvegarde réussie
- `saveError(error)` - Erreur de sauvegarde
- `projectCreated(projectName)` - Projet créé
- `projectDeleted(projectName)` - Projet supprimé
- `updateAvailable(version)` - Mise à jour disponible
- `syncSuccess()` - Synchronisation réussie
- `syncError(error)` - Erreur de synchronisation

## Gestion des notifications

### Accès aux notifications stockées

```typescript
const { notifications, unreadCount } = useNotify()

// Toutes les notifications
console.log(notifications)

// Nombre de notifications non lues
console.log(unreadCount)
```

### Actions sur les notifications

```typescript
const { markAsRead, markAllAsRead, removeNotification, clearAll } = useNotify()

// Marquer une notification comme lue
markAsRead('notification-id')

// Marquer toutes comme lues
markAllAsRead()

// Supprimer une notification
removeNotification('notification-id')

// Supprimer toutes les notifications
clearAll()
```

## Exemples d'intégration

### Dans un formulaire de connexion

```typescript
const handleLogin = async (credentials) => {
  try {
    const user = await loginUser(credentials)
    notify.useTemplate(() => notify.templates.loginSuccess(user.name))
    // Redirection...
  } catch (error) {
    notify.useTemplate(() => notify.templates.loginError(error.message))
  }
}
```

### Dans un gestionnaire de plugins

```typescript
const loadPlugin = async (pluginPath) => {
  try {
    const plugin = await window.api.plugins.load(pluginPath)
    notify.useTemplate(() => notify.templates.pluginLoaded(plugin.name))
  } catch (error) {
    notify.useTemplate(() => notify.templates.pluginError(pluginPath, error.message))
  }
}
```

### Dans un éditeur de fichiers

```typescript
const saveFile = async (fileName, content) => {
  try {
    await window.api.files.save(fileName, content)
    notify.useTemplate(() => notify.templates.saveSuccess(fileName))
  } catch (error) {
    notify.useTemplate(() => notify.templates.saveError(error.message))
  }
}
```

## Personnalisation

### Créer ses propres templates

```typescript
const myCustomTemplates = {
  deploymentSuccess: (projectName) => ({
    title: 'Déploiement réussi',
    message: `Le projet "${projectName}" a été déployé avec succès.`,
    type: 'success' as const,
    action: {
      label: 'Voir le site',
      onClick: () => window.open('https://mysite.com', '_blank')
    }
  })
}

// Utilisation
notify.custom(myCustomTemplates.deploymentSuccess('MonProjet'))
```

### Configuration avancée

```typescript
// Notification avec durée personnalisée (via Sonner)
import { toast } from 'sonner'

const customNotification = () => {
  const id = notify.success('Message rapide')
  
  // Le toast disparaîtra automatiquement
  // mais la notification restera dans l'onglet
}
```

## Bonnes pratiques

1. **Utilisez les templates** pour les cas d'usage courants
2. **Soyez descriptif** dans les messages d'erreur
3. **Ajoutez des actions** quand c'est pertinent
4. **Groupez les notifications similaires** pour éviter le spam
5. **Testez différents types** pour trouver le bon niveau d'urgence

## Test et débogage

Utilisez la section "Test des Notifications" dans les Paramètres pour tester tous les types de notifications et s'assurer que le système fonctionne correctement.
