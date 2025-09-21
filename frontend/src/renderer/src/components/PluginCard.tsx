import React, { useState, useEffect } from "react"
import { PluginCardProps } from "../../../types/plugin"
import { CheckCircle2, AlertTriangle, Zap, User } from "lucide-react"
import packageImg from "../assets/img/package.png"

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onSelect }) => {
  const [iconSrc, setIconSrc] = useState<string>(packageImg)

  const handleClick = (): void => {
    if (!plugin.error) {
      onSelect(plugin)
    }
  }

  // Charger l'icône du plugin via l'API IPC
  useEffect(() => {
    const loadPluginIcon = async () => {
      if (!plugin.manifest.icon) {
        setIconSrc(packageImg)
        return
      }

      try {
        const iconData = await window.api.plugins.getIcon(plugin.id, plugin.manifest.icon)
        if (iconData) {
          setIconSrc(iconData)
          console.log(`Plugin ${plugin.manifest.name} icon loaded successfully`)
        } else {
          console.log(`Plugin ${plugin.manifest.name} icon not found, using default`)
          setIconSrc(packageImg)
        }
      } catch (error) {
        console.error(`Error loading plugin ${plugin.manifest.name} icon:`, error)
        setIconSrc(packageImg)
      }
    }

    loadPluginIcon()
  }, [plugin.id, plugin.manifest.icon, plugin.manifest.name])

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-box border transition cursor-pointer flex flex-col gap-3 
        ${plugin.error ? "border-error " : "border-base-300 hover:shadow-md hover:bg-primary/10 hover:border-primary"}`}
    >
      {/* Header : icône + nom */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-base-300">
          <img
            src={iconSrc}
            alt={plugin.manifest.name}
            className="w-12 h-12 rounded-md object-contain"
            onError={(e) => { 
              (e.currentTarget as HTMLImageElement).src = packageImg
            }}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">{plugin.manifest.name}</h3>
          <p className="text-xs opacity-70">v{plugin.manifest.version}</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1">
        <p className="text-sm truncate">{plugin.manifest.description}</p>
        {plugin.manifest.author && (
          <p className="text-xs mt-1 flex items-center gap-1 opacity-70 truncate">
            <User className="w-4 h-4" /> {plugin.manifest.author}
          </p>
        )}
      </div>

      {/* Footer : statut */}
      <div className="flex justify-between items-center">
        {plugin.error ? (
          <span className="flex items-center gap-1 text-red-500 text-sm">
            <AlertTriangle className="w-4 h-4" /> Erreur
          </span>
        ) : plugin.isLoaded ? (
          <span className="flex items-center gap-1 text-green-500 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Chargé
          </span>
        ) : (
          <span className="flex items-center gap-1 text-yellow-500 text-sm">
            <Zap className="w-4 h-4" /> Prêt
          </span>
        )}

        {!plugin.error && <button className="btn btn-soft  btn-xs">Ouvrir</button>}
      </div>

      {/* Message d'erreur */}
      {plugin.error && (
        <div className="p-2 text-xs text-red-600 bg-red-100 rounded-md">{plugin.error}</div>
      )}
    </div>
  )
}

export default PluginCard
