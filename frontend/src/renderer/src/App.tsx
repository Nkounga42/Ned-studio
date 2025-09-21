import React, { useEffect } from "react"
import Sidebar from "./components/Base/sidebar"
import TabManager from "./components/TabManager"
import { useMenu } from "./contexts/MenuContext"
import NotificationsPage from "./pages/NotificationsPage"
import TestPage from "./pages/TestPage"
import HomePage from "./pages/HomePage"
import DocumentsPage from "./pages/DocumentsPage"

const App: React.FC = () => {
  const { setActiveItem } = useMenu()
  const { menuItems } = useMenu()
  const activeItem = menuItems.find((item) => item.isActive)

  const handlePluginClose = (pluginId: string) => {
    window.dispatchEvent(new CustomEvent("plugin-closed", { detail: pluginId }))
  }

  // Écouter l'événement plugin-opened depuis la sidebar
  useEffect(() => {
    const handlePluginOpened = (event: CustomEvent) => {
      const pluginItem = event.detail
      console.log("Plugin opened:", pluginItem)
      
      // Activer d'abord la section modules pour que TabManager soit visible
      setActiveItem("modules")
      
      // Le TabManager se chargera d'activer le bon plugin
    }

    window.addEventListener("plugin-opened", handlePluginOpened as EventListener)
    
    return () => {
      window.removeEventListener("plugin-opened", handlePluginOpened as EventListener)
    }
  }, [setActiveItem])

 

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
          {(activeItem?.id === "modules" || activeItem?.closable) && <TabManager />}


        </div>
      </main>
    </div>
  )
}

// Composants de pages exemple

// const DocumentsPage = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-4">Documents</h1>
//     <p>Gérez vos documents ici.</p>
//   </div>
// )

const ProjectsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Projets</h1>
    <p>Vos projets sont affichés ici.</p>
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
