import React from "react"
import Sidebar from "./components/Base/sidebar"
import TabManager from "./components/TabManager"
import { useMenu } from "./contexts/MenuContext"
import PluginRenderer from "./pages/PluginRenderer"

const App: React.FC = () => {
  const { menuItems, addMenuItem, removeMenuItem, updateMenuItem, setActiveItem } = useMenu()
  const activeItem = menuItems.find((item) => item.isActive)

  const handlePluginClose = (pluginId: string) => {
    window.dispatchEvent(new CustomEvent("plugin-closed", { detail: pluginId }))
  }

  const shouldShowTabManager = () => {
    return activeItem?.closable || activeItem?.id === "plugins-home"
  }

  return (
    <div className="app-layout flex h-screen">
      <Sidebar onPluginClose={handlePluginClose} />
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-4">
          {activeItem?.id === "home" && <HomePage />}
          {activeItem?.id === "documents" && <DocumentsPage />}
          {activeItem?.id === "projects" && <ProjectsPage />}
          {activeItem?.id === "search" && <SearchPage />}
          {activeItem?.id === "notifications" && <NotificationsPage />}
          {activeItem?.id === "downloads" && <DownloadsPage />}
          {activeItem?.id === "profile" && <ProfilePage />}
          {activeItem?.id === "settings" && <SettingsPage />}
          {activeItem?.id === "modules" && (
            <TabManager
              addMenuItem={addMenuItem}
              removeMenuItem={removeMenuItem}
              updateMenuItem={updateMenuItem}
              setActiveItem={setActiveItem}
              activeItemId={activeItem?.id}
            />
          )}
           {menuItems.map((item) => (
  <div
    key={item.id}
    style={{ display: item.closable && activeItem?.id === item.id ? "block" : "none" }}
  >
    <PluginRenderer plugin={item} />
  </div>
))}


        </div>
      </main>
    </div>
  )
}

// Composants de pages exemple
const HomePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Bienvenue dans NED Studio</h1>
    <p>Ceci est la page d'accueil de votre application.</p>
  </div>
)

const DocumentsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Documents</h1>
    <p>Gérez vos documents ici.</p>
  </div>
)

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

const NotificationsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
    <p>Vos notifications apparaissent ici.</p>
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
