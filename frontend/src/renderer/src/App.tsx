import React, { useEffect, useState } from "react"
import Sidebar from "./components/Base/sidebar"
import PluginManager from "./pages/PluginManager"
import PluginRenderer from "./pages/PluginRenderer"
import { useMenu } from "./contexts/MenuContext"
import NotificationsPage from "./pages/NotificationsPage"
import TestPage from "./pages/TestPage"
import HomePage from "./pages/HomePage"
import DocumentsPage from "./pages/DocumentsPage"
import { LoadedPlugin } from "../../types/plugin"
import {  User } from "lucide-react"
import { Link } from "react-router-dom"

// Composant pour l'icône du plugin dans la sidebar
const PluginIconComponent: React.FC<{ plugin: LoadedPlugin }> = ({ plugin }) => {
  const [iconSrc, setIconSrc] = useState<string>('')
  
  useEffect(() => {
    const loadIcon = async () => {
      if (!plugin.manifest.icon) return
      
      try {
        const iconData = await window.api.plugins.getIcon(plugin.id, plugin.manifest.icon)
        if (iconData) {
          setIconSrc(iconData)
        }
      } catch (error) {
        console.error(`Failed to load plugin icon for ${plugin.manifest.name}:`, error)
      }
    }
    loadIcon()
  }, [plugin.id, plugin.manifest.icon, plugin.manifest.name])
  
  return iconSrc ? (
    <img src={iconSrc} alt={plugin.manifest.name} className="w-4 h-4" />
  ) : (
    <User className="w-4 h-4" />
  )
}

const App: React.FC = () => {
  const { setActiveItem, addMenuItem, removeMenuItem } = useMenu()
  const { menuItems } = useMenu()
  const activeItem = menuItems.find((item) => item.isActive)
  
  // État pour gérer les plugins ouverts
  const [openPlugins, setOpenPlugins] = useState<LoadedPlugin[]>([])

  const handlePluginClose = (pluginId: string) => {
    window.dispatchEvent(new CustomEvent("plugin-closed", { detail: pluginId }))
  }

  // Fonction pour ouvrir un plugin depuis PluginManager
  const handlePluginSelect = (plugin: LoadedPlugin) => {
    // Vérifier si le plugin est déjà ouvert
    const isAlreadyOpen = openPlugins.find(p => p.id === plugin.id)
    
    if (!isAlreadyOpen) {
      // Ajouter le plugin à la liste des plugins ouverts
      setOpenPlugins(prev => [...prev, plugin])
      
      // Ajouter l'item au menu avec l'icône du plugin
      const PluginIcon = plugin.manifest.icon
        ? () => <PluginIconComponent plugin={plugin} />
        : User
      addMenuItem({
        id: plugin.id,
        label: plugin.manifest.name,
        icon: PluginIcon,
        closable: true,
        href: undefined
      })
    }
    
    // Activer le plugin
    setActiveItem(plugin.id)
  }

  // Écouter l'événement plugin-closed pour supprimer les plugins
  useEffect(() => {
    const handlePluginClosed = (event: CustomEvent) => {
      const pluginId = event.detail
      
      // Supprimer le plugin de la liste
      setOpenPlugins(prev => prev.filter(p => p.id !== pluginId))
      
      // Supprimer l'item du menu
      removeMenuItem(pluginId)
      
      // Rediriger vers modules si c'était le plugin actif
      if (activeItem?.id === pluginId) {
        setActiveItem("modules")
      }
    }

    window.addEventListener("plugin-closed", handlePluginClosed as EventListener)
    
    return () => {
      window.removeEventListener("plugin-closed", handlePluginClosed as EventListener)
    }
  }, [removeMenuItem, setActiveItem, activeItem])

 

  return (
    <div className="app-layout flex h-screen">
      <Sidebar onPluginClose={handlePluginClose} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeItem?.id === "home" && <HomePage />}
          {activeItem?.id === "documents" && <DocumentsPage />}
          {activeItem?.id === "projects" && <ProjectsPage />}
          {activeItem?.id === "search" && <SearchPage />}
          {activeItem?.id === "notifications" && <NotificationsPage />}
          {activeItem?.id === "downloads" && <DownloadsPage />}
          {activeItem?.id === "profile" && <ProfilePage />}
          {activeItem?.id === "settings" && <SettingsPage />}
          {activeItem?.id === "test" && <TestPage />}
          {activeItem?.id === "modules" && <PluginManager handlePluginSelect={handlePluginSelect} />}
          {/* Rendu des plugins ouverts */}
          {openPlugins.map(plugin => 
            activeItem?.id === plugin.id && (
              <PluginRenderer key={plugin.id} plugin={plugin} />
            )
          )}
        </div>
      </main>
    </div>
  )
}
 

const ProjectsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Projets</h1>
    <p>Vos projets sont affichés ici.</p>
    <Link to="/BuildRenderer">
            <button className="px-3 py-1 bg-gray-200 rounded">Build Renderer</button>
    </Link>
  </div>
)

const SearchPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Recherche</h1>
    <p>Utilisez cette page pour rechercher dans l'application.</p>
  </div>
)


const DownloadsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Téléchargements</h1>
    <p>Gérez vos téléchargements ici.</p>
  </div>
)

const ProfilePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Profil</h1>
    <p>Configurez votre profil utilisateur.</p>
  </div>
)

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
    <p>Ajustez les paramètres de l'application.</p>
  </div>
)

export default App
