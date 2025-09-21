import React, { useEffect, useMemo, useState } from 'react'
import PluginManager from './PluginManager' 
import { LoadedPlugin } from '@/types/plugin'
import { LoadedPlugin } from 'src/types/plugin'

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

 
  return (
    <div className="w-full h-full relative">
      <div style={{ display: activeTab === 'plugins' ? 'block' : 'none' }}>
        <PluginManager handlePluginSelect={function (plugin: LoadedPlugin): void {
          throw new Error('Function not implemented.')
        } } />
      </div> 
    </div>
  )
}

export default PluginWorkspace


