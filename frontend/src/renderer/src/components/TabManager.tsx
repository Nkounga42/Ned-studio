import React, { useState, useEffect } from "react"
import { LoadedPlugin } from "../../../types/plugin"
import PluginManager from "@renderer/pages/PluginManager"
import PluginRenderer from "@renderer/pages/PluginRenderer"
import { useMenu } from "@renderer/contexts/MenuContext" // Hook menu
import { User } from "lucide-react"

interface Tab {
  id: string
  type: "plugin" | "plugins-home"
  plugin?: LoadedPlugin
}

const TabManager: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "plugins", type: "plugins-home" }])
  const [activeId, setActiveId] = useState("plugins")
  const { addMenuItem, removeMenuItem, setActiveItem, menuItems } = useMenu()

  useEffect(() => {
    const handlePluginOpen = (e: Event) => {
      const plugin = (e as CustomEvent<LoadedPlugin>).detail

      // Ajouter l’onglet si inexistant
      setTabs((prev) => {
        const exists = prev.find((t) => t.id === plugin.id)
        if (!exists) return [...prev, { id: plugin.id, type: "plugin", plugin }]
        return prev
      })

      // Ajouter au menu
      const PluginIcon = plugin.manifest.icon
        ? () => <img src={plugin.manifest.icon} alt={plugin.manifest.name} className="w-4 h-4" />
        : User
      addMenuItem({
        id: plugin.id,
        label: plugin.manifest.name,
        icon: PluginIcon,
        closable: true,
        href: undefined
      })

      // Activer l’onglet dans TabManager
      setActiveId(plugin.id)
      // Ne pas activer dans le menu principal - c'est géré par App.tsx
    }


    const handlePluginClose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail

      // Supprimer l’onglet et le menu
      setTabs((prev) => prev.filter((t) => t.id !== id))
      removeMenuItem(id)

      // Réactiver l'onglet par défaut si nécessaire
      setActiveId((prev) => (prev === id ? "plugins" : prev))
      if (id === "plugins") {
        setActiveItem("modules")
      }
    }

    window.addEventListener("plugin-opened", handlePluginOpen)
    window.addEventListener("plugin-closed", handlePluginClose)

    return () => {
      window.removeEventListener("plugin-opened", handlePluginOpen)
      window.removeEventListener("plugin-closed", handlePluginClose)
    }
  }, [addMenuItem, removeMenuItem, setActiveItem])

  // Écouter les changements d'items actifs pour activer les plugins depuis la sidebar
  useEffect(() => {
    const activeItem = menuItems.find(item => item.isActive)
    if (activeItem) {
      if (activeItem.closable) {
        // Si l'item actif est un plugin, vérifier qu'il existe dans les tabs
        const existingTab = tabs.find(tab => tab.id === activeItem.id)
        if (existingTab) {
          // L'onglet existe, l'activer simplement
          setActiveId(activeItem.id)
        } else {
          // L'onglet n'existe pas, rediriger vers la page d'accueil des plugins
          // L'utilisateur devra ouvrir le plugin depuis PluginManager
          console.log(`Plugin tab ${activeItem.id} not found, redirecting to plugins home`)
          setActiveItem("modules")
          setActiveId("plugins")
        }
      } else if (activeItem.id === "modules") {
        // Si on revient sur "modules", afficher la page d'accueil des plugins
        setActiveId("plugins")
      }
    }
  }, [menuItems, tabs, setActiveItem])

  useEffect(() => {
    const handlePluginClose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail

      // Supprime l’onglet
      setTabs((prev) => prev.filter((t) => t.id !== id))

      // Supprime le menu
      removeMenuItem(id)

      // Réactive un onglet par défaut
      setActiveId((prev) => (prev === id ? "plugins" : prev))
      setActiveItem((prev) => (prev === id ? "plugins" : prev))
    }

    window.addEventListener("plugin-closed", handlePluginClose)
    return () => window.removeEventListener("plugin-closed", handlePluginClose)
  }, [removeMenuItem, setActiveItem])

  const handlePluginSelect = (plugin: LoadedPlugin) => {
    window.dispatchEvent(new CustomEvent("plugin-opened", { detail: plugin }))
  }

  return (
    <div className="flex flex-col h-screen"> 
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) =>
          tab.type === "plugins-home" ? (
            <div
              key={tab.id}
              style={{ display: tab.id === activeId ? "block" : "none" }}
              className="h-full"
            >
              <PluginManager handlePluginSelect={handlePluginSelect} />
            </div>
          ) : (
            <div
              key={tab.id}
              style={{ display: tab.id === activeId ? "block" : "none" }}
              className="h-full"
            >
              <PluginRenderer plugin={tab.plugin!} />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default TabManager
