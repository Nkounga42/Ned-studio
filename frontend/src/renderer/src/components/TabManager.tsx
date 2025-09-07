import React, { useState, useEffect } from "react"
import { LoadedPlugin } from "../../../types/plugin"
import PluginManager from "@renderer/pages/PluginManager"
import PluginRenderer from "@renderer/pages/PluginRenderer"

interface Tab {
  id: string
  type: "plugin" | "plugins-home"
  plugin?: LoadedPlugin
}

const TabManager: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "plugins", type: "plugins-home" }])
  const [activeId, setActiveId] = useState("plugins")

  // Gestion ouverture / fermeture de plugins
  useEffect(() => {
    const handlePluginOpen = (e: Event) => {
      const plugin = (e as CustomEvent<LoadedPlugin>).detail
      const exists = tabs.find((t) => t.id === plugin.id)
      if (!exists) {
        setTabs((prev) => [...prev, { id: plugin.id, type: "plugin", plugin }])
      }
      setActiveId(plugin.id)
    }

    const handlePluginClose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      setTabs((prev) => prev.filter((t) => t.id !== id))
      if (activeId === id) setActiveId("plugins")
    }

    window.addEventListener("plugin-opened", handlePluginOpen)
    window.addEventListener("plugin-closed", handlePluginClose)

    return () => {
      window.removeEventListener("plugin-opened", handlePluginOpen)
      window.removeEventListener("plugin-closed", handlePluginClose)
    }
  }, [tabs, activeId])

  return (
    <div className="flex flex-col h-screen">
      {/* Barre d’onglets */}
      <div className="flex bg-gray-900 text-white p-2 gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`px-3 py-1 rounded cursor-pointer ${
              tab.id === activeId ? "bg-gray-700" : "bg-gray-800"
            }`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.type === "plugins-home" ? "Plugins" : tab.plugin?.manifest.name}
            {tab.type === "plugin" && (
              <button
                className="ml-2 text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  window.dispatchEvent(new CustomEvent("plugin-closed", { detail: tab.id }))
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Contenu des onglets (tous montés, seul l’actif visible) */}
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) =>
          tab.type === "plugins-home" ? (
            <div
              key={tab.id}
              style={{ display: tab.id === activeId ? "block" : "none" }}
              className="h-full"
            >
               <PluginManager /> 
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
