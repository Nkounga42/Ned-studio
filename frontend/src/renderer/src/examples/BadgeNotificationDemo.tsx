import React from "react"
import { Bell, Plus, Minus, Trash2 } from "lucide-react"
import { useNotify } from "../hooks/useNotify"

/**
 * Composant de démonstration pour tester le badge de notifications
 * Ce composant peut être utilisé dans n'importe quelle page pour tester
 * la synchronisation automatique du badge avec le nombre de notifications non lues
 */
const BadgeNotificationDemo: React.FC = () => {
  const { unreadCount, clearAll } = useNotify()
  const notify = useNotify()

  const addTestNotification = () => {
    const types = ['success', 'error', 'warning', 'info'] as const
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    notify[randomType]({
      title: `Test notification ${randomType}`,
      message: `Ceci est une notification de test de type ${randomType}. Le badge devrait se mettre à jour automatiquement.`
    })
  }

  const addMultipleNotifications = () => {
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        notify.info({
          title: `Notification ${i}/3`,
          message: `Notification de test numéro ${i} sur 3`
        })
      }, i * 500)
    }
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 max-w-md">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Test Badge Notifications
        </h2>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">Notifications non lues:</span>
          <div className="badge badge-primary">
            {unreadCount}
          </div>
        </div>

        <p className="text-sm text-base-content/70 mb-4">
          Utilisez les boutons ci-dessous pour tester la synchronisation automatique 
          du badge dans la sidebar avec le nombre de notifications non lues.
        </p>
        
        <div className="space-y-2">
          <button
            onClick={addTestNotification}
            className="btn btn-primary btn-sm w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une notification
          </button>
          
          <button
            onClick={addMultipleNotifications}
            className="btn btn-secondary btn-sm w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter 3 notifications
          </button>
          
          <button
            onClick={clearAll}
            className="btn btn-error btn-sm w-full gap-2"
            disabled={unreadCount === 0}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer toutes ({unreadCount})
          </button>
        </div>

        <div className="alert alert-info mt-4">
          <div className="text-xs">
            💡 <strong>Astuce:</strong> Regardez le badge à côté de "Notifications" 
            dans la sidebar. Il devrait se mettre à jour automatiquement quand vous 
            ajoutez ou supprimez des notifications.
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeNotificationDemo
