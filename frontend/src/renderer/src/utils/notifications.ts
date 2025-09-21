import { Notification } from "../types/notification"

// Types pour les fonctions utilitaires
type NotificationInput = Omit<Notification, 'id' | 'timestamp' | 'read' | 'type'>
type QuickNotificationInput = Omit<NotificationInput, 'type'> | string

// Interface pour les fonctions de notification
export interface NotificationHelpers {
  success: (input: QuickNotificationInput) => void
  error: (input: QuickNotificationInput) => void
  warning: (input: QuickNotificationInput) => void
  info: (input: QuickNotificationInput) => void
  custom: (input: NotificationInput & { type: Notification['type'] }) => void
}

// Fonction pour normaliser l'input
const normalizeInput = (input: QuickNotificationInput): NotificationInput => {
  if (typeof input === 'string') {
    return {
      title: input,
      message: ''
    }
  }
  return input
}

// Factory pour créer les helpers de notification
export const createNotificationHelpers = (
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
): NotificationHelpers => {
  return {
    success: (input: QuickNotificationInput) => {
      const normalized = normalizeInput(input)
      addNotification({
        ...normalized,
        type: 'success'
      })
    },

    error: (input: QuickNotificationInput) => {
      const normalized = normalizeInput(input)
      addNotification({
        ...normalized,
        type: 'error'
      })
    },

    warning: (input: QuickNotificationInput) => {
      const normalized = normalizeInput(input)
      addNotification({
        ...normalized,
        type: 'warning'
      })
    },

    info: (input: QuickNotificationInput) => {
      const normalized = normalizeInput(input)
      addNotification({
        ...normalized,
        type: 'info'
      })
    },

    custom: (input: NotificationInput & { type: Notification['type'] }) => {
      addNotification(input)
    }
  }
}

// Exemples d'utilisation prédéfinis
export const notificationTemplates = {
  // Notifications système
  pluginLoaded: (pluginName: string) => ({
    title: 'Plugin chargé',
    message: `Le plugin "${pluginName}" a été chargé avec succès.`,
    type: 'success' as const
  }),

  pluginError: (pluginName: string, error: string) => ({
    title: 'Erreur de plugin',
    message: `Le plugin "${pluginName}" a rencontré une erreur: ${error}`,
    type: 'error' as const
  }),

  saveSuccess: (fileName?: string) => ({
    title: 'Sauvegarde réussie',
    message: fileName ? `Le fichier "${fileName}" a été sauvegardé.` : 'Les modifications ont été sauvegardées.',
    type: 'success' as const
  }),

  saveError: (error: string) => ({
    title: 'Erreur de sauvegarde',
    message: `Impossible de sauvegarder: ${error}`,
    type: 'error' as const
  }),

  // Notifications de projet
  projectCreated: (projectName: string) => ({
    title: 'Projet créé',
    message: `Le projet "${projectName}" a été créé avec succès.`,
    type: 'success' as const
  }),

  projectDeleted: (projectName: string) => ({
    title: 'Projet supprimé',
    message: `Le projet "${projectName}" a été supprimé.`,
    type: 'info' as const
  }),

  // Notifications de mise à jour
  updateAvailable: (version: string) => ({
    title: 'Mise à jour disponible',
    message: `Une nouvelle version (${version}) est disponible.`,
    type: 'info' as const,
    action: {
      label: 'Télécharger',
      onClick: () => {
        // Logique de téléchargement
        window.open('https://github.com/your-repo/releases', '_blank')
      }
    }
  }),

  // Notifications de connexion
  loginSuccess: (username: string) => ({
    title: 'Connexion réussie',
    message: `Bienvenue, ${username}!`,
    type: 'success' as const
  }),

  loginError: (error: string) => ({
    title: 'Erreur de connexion',
    message: error,
    type: 'error' as const
  }),

  // Notifications de synchronisation
  syncSuccess: () => ({
    title: 'Synchronisation terminée',
    message: 'Vos données ont été synchronisées avec succès.',
    type: 'success' as const
  }),

  syncError: (error: string) => ({
    title: 'Erreur de synchronisation',
    message: `Échec de la synchronisation: ${error}`,
    type: 'error' as const
  })
}
