import React, { useEffect, useMemo, useState } from 'react'
import PluginManager from './PluginManager'
import PluginRenderer from './PluginRenderer' 
import { LoadedPlugin } from '@/types/plugin'

const PluginWorkspace: React.FC = () => {
  const [openPlugins, setOpenPlugins] = useState<Record<string, LoadedPlugin>>({})
  const [activeTab, setActiveTab] = useState<string>('plugins')

  useEffect(() => {
    const onOpened = (e: any) => {
      const plugin: LoadedPlugin = e.detail
      if (plugin && plugin.id) {
        setOpenPlugins((prev) => ({ ...prev, [plugin.id]: plugin }))
      }
    }
    const onClosed = (e: any) => {
      const pluginId: string = e.detail
      if (!pluginId) return
      setOpenPlugins((prev) => {
        const next = { ...prev }
        delete next[pluginId]
        return next
      })
      if (activeTab === pluginId) setActiveTab('plugins')
    }
    const onTabChanged = (e: any) => {
      const tabId: string = e.detail
      if (typeof tabId === 'string') setActiveTab(tabId)
    }

    window.addEventListener('plugin-opened', onOpened)
    window.addEventListener('plugin-closed', onClosed)
    window.addEventListener('tab-changed', onTabChanged)
    return () => {
      window.removeEventListener('plugin-opened', onOpened)
      window.removeEventListener('plugin-closed', onClosed)
      window.removeEventListener('tab-changed', onTabChanged)
    }
  }, [activeTab])

  const openPluginList = useMemo(() => Object.values(openPlugins), [openPlugins])

  return (
    <div className="w-full h-full relative">
      <div style={{ display: activeTab === 'plugins' ? 'block' : 'none' }}>
        <PluginManager />
      </div>
      {openPluginList.map((p) => (
        <div key={p.id} style={{ display: activeTab === p.id ? 'block' : 'none' }}>
          <PluginRenderer plugin={p} />
        </div>
      ))}
    </div>
  )
}

export default PluginWorkspace


