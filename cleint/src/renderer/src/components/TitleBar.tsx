import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"
import { Maximize, X, Expand, Minus } from 'lucide-react';
import Logo from '../assets/img/logo.png';
import { useNavigate } from 'react-router-dom';

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('home') // maintenant string dynamique
  const [openPlugins, setOpenPlugins] = useState<{ id: string; name: string }[]>([])
  const navigate = useNavigate();

  // refs dynamiques pour chaque onglet
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const handleNavigation = (tabId: string, route?: string) => {
    if (route) navigate(route)
    setCurrentTab(tabId)
    window.dispatchEvent(new CustomEvent('tab-changed', { detail: tabId }))
  }

  useEffect(() => {
    const unsub = window.api.onMaximizedChange((max) => setIsMaximized(max));
    window.api.isMaximized().then(setIsMaximized);

    // gestion des plugins ouverts
    const onOpened = (e: any) => {
      const plugin = e.detail as { id: string; name: string }
      setOpenPlugins((prev) =>
        prev.find((p) => p.id === plugin.id) ? prev : [...prev, plugin]
      )
    }
    const onClosed = (e: any) => {
      const pluginId = e.detail as string
      setOpenPlugins((prev) => prev.filter((p) => p.id !== pluginId))
      if (currentTab === pluginId) setCurrentTab('plugins') // retour à "plugins" si celui affiché est fermé
    }

    window.addEventListener('plugin-opened', onOpened)
    window.addEventListener('plugin-closed', onClosed)

    return () => {
      unsub?.()
      window.removeEventListener('plugin-opened', onOpened)
      window.removeEventListener('plugin-closed', onClosed)
    }
  }, [currentTab])

  // mettre à jour la position de l’indicateur
  useEffect(() => {
    const ref = tabRefs.current[currentTab]
    if (ref) {
      setIndicatorStyle({
        left: ref.offsetLeft,
        width: ref.offsetWidth,
      })
    }
  }, [currentTab, openPlugins])

  return (
    <header className="fixed top-0 left-0 right-0 z-999 backdrop-blur-sm flex items-center justify-between border-b border-base-300 text-base-content h-9 pl-2 select-none -webkit-app-region-drag">
      <div className="flex items-center gap-4">
        <img src={Logo} alt="Logo" className="w-6 h-6 mask mask-squircle" />
        <nav className="app-nav relative mr-5 flex gap-3 text-sm border-b border-base-300 -webkit-app-region-no-drag">
          {/* Tabs fixes */}
          <button
            ref={(el) => { tabRefs.current['home'] = el }}
            onClick={() => handleNavigation("home", "/")}
            className={`h-9 px-2 text-sm  ${currentTab === "home" ? "text-primary" : ""}`}
          >
            Home
          </button>
          <button
            ref={(el) => { tabRefs.current['plugins'] = el }}
            onClick={() => handleNavigation("plugins", "/plugins")}
            className={`h-9 px-2 text-sm  ${currentTab === "plugins" ? "text-primary" : ""}`}
          >
            Plugins
          </button>
          <button
            ref={(el) => { tabRefs.current['settings'] = el }}
            onClick={() => handleNavigation("settings", "/settings")}
            className={`h-9 px-2text-sm   ${currentTab === "settings" ? "text-primary" : ""}`}
          >
            Settings
          </button>

          {/* Plugins dynamiques */}
          {openPlugins.map((plugin) => (
            <button
              key={plugin.id}
              ref={(el) => { tabRefs.current[plugin.id] = el }}
              onClick={() => handleNavigation(plugin.id, "/plugins")}
              className={`h-9 px-2 text-sm ${currentTab === plugin.id ? "text-primary" : ""}`}
            >
              {plugin.name}
            </button>
          ))}

          {/* Barre animée */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-primary rounded-full shadow-primary shadow-xl"
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </nav>
      </div>
      <div className="titlebar w-[80%] h-9"></div>
      <div className="flex gap-1 -webkit-app-region-no-drag">
        <button
          className="w-9 h-7 hover:bg-base-200 rounded flex items-center justify-center"
          onClick={() => window.api.minimize()}
        >
          <Minus size={16} />
        </button>
        <button
          className="w-9 h-7 hover:bg-base-200 rounded flex items-center justify-center"
          onClick={() => window.api.toggleMaximize()}
        >
          {isMaximized ? <Expand size={16} /> : <Maximize size={16} />}
        </button>
        <button
          className="w-9 h-7 hover:bg-error rounded flex items-center justify-center"
          onClick={() => window.api.close()}
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
};

export default TitleBar;
