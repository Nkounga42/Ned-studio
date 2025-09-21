import { useNotifications } from "../contexts/NotificationContext"
import { createNotificationHelpers, notificationTemplates } from "../utils/notifications"

/**
 * Hook personnalisé pour faciliter l'utilisation des notifications
 * Fournit des méthodes simples pour créer différents types de notifications
 */
export const useNotify = () => {
  const { addNotification, ...rest } = useNotifications()
  
  // Créer les helpers de notification
  const helpers = createNotificationHelpers(addNotification)
  
  return {
    // Méthodes rapides pour créer des notifications
    ...helpers,
    
    // Templates prédéfinis
    templates: notificationTemplates,
    
    // Méthode pour utiliser un template
    useTemplate: (templateFn: () => Parameters<typeof addNotification>[0]) => {
      addNotification(templateFn())
    },
    
    // Accès direct aux méthodes du contexte
    ...rest
  }
}

// Export des types pour faciliter l'utilisation
export type { NotificationHelpers } from "../utils/notifications"
