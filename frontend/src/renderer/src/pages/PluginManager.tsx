import React, { useState, useEffect } from 'react'
import { LoadedPlugin } from '../../../types/plugin'
import PluginCard from '../components/PluginCard'
import PluginRenderer from './PluginRenderer'

const PluginManager: React.FC<{handlePluginSelect: (plugin: LoadedPlugin) => void}> = ({handlePluginSelect}) => {
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<LoadedPlugin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = async () => {
    try {
      setLoading(true)
      setError(null)
      const pluginList = await window.api.plugins.getAll()
      setPlugins(pluginList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plugins')
    } finally {
      setLoading(false)
    }
  }

  

   

  const handleReloadPlugins = async () => {
    await loadPlugins()
  }

  // Plugins filtrés selon la recherche
  const filteredPlugins = plugins.filter((plugin) =>
    plugin.manifest.name.toLowerCase().includes(search.toLowerCase())
  )

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium">Chargement des plugins...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="alert alert-error shadow-lg max-w-md">
          <span>⚠️ Erreur : {error}</span>
        </div>
        <button onClick={loadPlugins} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    )
  }


  // Plugin list
  return (
    <div className="px-4 py-2 space-y-6"> 

      {filteredPlugins.length === 0 ? (
        <div className="text-error text-sm">
          <span>🚫 Aucun plugin trouvé pour "{search}".</span>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-4 grid-rows-4 m-auto">
          {filteredPlugins.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onSelect={handlePluginSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PluginManager










// import React, { useState, useEffect } from 'react'

// import { LoadedPlugin } from '../../../types/plugin'
// import PluginCard from '../components/PluginCard'
// import PluginRenderer from './PluginRenderer'

// const PluginManager: React.FC = () => {
//   const [plugins, setPlugins] = useState<LoadedPlugin[]>([])
//   const [selectedPlugin, setSelectedPlugin] = useState<LoadedPlugin | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [search, setSearch] = useState("")

//   useEffect(() => {
//     loadPlugins()
//   }, [])

//   const loadPlugins = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const pluginList = await window.api.plugins.getAll()
//       setPlugins(pluginList)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load plugins')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePluginSelect = (plugin: LoadedPlugin) => {
//     setSelectedPlugin(plugin)
//     window.dispatchEvent(new CustomEvent('plugin-opened', { detail: plugin }))
//     window.dispatchEvent(new CustomEvent('tab-changed', { detail: plugin.id }))
//   }

//   const handleBackToList = () => {
//     const closedId = selectedPlugin?.id
//     setSelectedPlugin(null)
//     if (closedId) {
//       window.dispatchEvent(new CustomEvent('plugin-closed', { detail: closedId }))
//     }
//     window.dispatchEvent(new CustomEvent('tab-changed', { detail: 'plugins' }))
//   }

//   const handleReloadPlugins = async () => {
//     await loadPlugins()
//   }

//   // Plugins filtrés selon la recherche
//   const filteredPlugins = plugins.filter((plugin) =>
//     plugin.manifest.name.toLowerCase().includes(search.toLowerCase())
//   )

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//         <p className="mt-4 text-lg font-medium">Chargement des plugins...</p>
//       </div>
//     )
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//         <div className="alert alert-error shadow-lg max-w-md">
//           <span>⚠️ Erreur : {error}</span>
//         </div>
//         <button onClick={loadPlugins} className="btn btn-primary">
//           Réessayer
//         </button>
//       </div>
//     )
//   }


//   // Plugin list
//   return (
//     <div className="px-4 py-2 space-y-6"> 

//       {filteredPlugins.length === 0 ? (
//         <div className="text-error text-sm">
//           <span>🚫 Aucun plugin trouvé pour "{search}".</span>
//         </div>
//       ) : (
//         <div className="grid gap-6 grid-cols-4 m-auto">
//           {filteredPlugins.map((plugin) => (
//             <PluginCard
//               key={plugin.id}
//               plugin={plugin}
//               onSelect={handlePluginSelect}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default PluginManager
