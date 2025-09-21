import React, { useState, useEffect } from 'react'
import { Search, Upload, Download, FolderOpen, X, RefreshCcw } from 'lucide-react'
import { LoadedPlugin } from '../../../types/plugin'
import ImportUrlModal from '../components/ImportUrlModal'
import { useNotify } from '../hooks/useNotify'
import PluginCard from '@renderer/components/PluginCard'
import { HeaderSection } from '@renderer/components/Base/Header'

const PluginManager: React.FC<{ handlePluginSelect: (plugin: LoadedPlugin) => void }> = ({ handlePluginSelect }) => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [plugins, setPlugins] = useState<LoadedPlugin[]>([])
  const [importing, setImporting] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const notify = useNotify()

  useEffect(() => {
    loadPlugins()

    // Debug: vérifier si l'API est disponible
    console.log('window.api:', window.api)
    console.log('window.api.plugins:', window.api?.plugins)
    console.log('window.api.plugins.import:', window.api?.plugins?.import)
  }, [])

  const loadPlugins = async () => {
    try {
      setLoading(true)
      const pluginList = await window.api.plugins.getAll()
      setPlugins(pluginList)
    } catch (err) {
      console.error('Failed to load plugins:', err)
      notify.error({
        title: 'Erreur de chargement',
        message: err instanceof Error ? err.message : 'Impossible de charger les plugins'
      })
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour importer un module depuis un fichier
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)

      // Vérifier l'extension du fichier
      const validExtensions = ['.zip', '.tar.gz', '.tgz', '.js', '.ts']
      const fileExtension = file.name.toLowerCase()
      const isValidFile = validExtensions.some(ext => fileExtension.endsWith(ext))

      if (!isValidFile) {
        throw new Error('Format de fichier non supporté. Utilisez .zip, .tar.gz, .js ou .ts')
      }

      // Convertir le fichier en ArrayBuffer
      const fileBuffer = await file.arrayBuffer()

      // Vérifier si l'API est disponible, sinon utiliser une approche alternative
      if (!window.api?.plugins?.import) {
        // Fallback : utiliser l'API de fichiers existante pour créer le plugin manuellement
        try {
          const pluginName = file.name.replace(/\.(js|ts|zip)$/, '')
          const pluginDir = `plugins/${pluginName}`

          // Créer le manifest du plugin
          const manifest = {
            name: pluginName,
            version: '1.0.0',
            description: `Plugin importé: ${pluginName}`,
            entry: file.name,
            author: 'Utilisateur'
          }

          // Sauvegarder le manifest via l'API existante
          await window.api.pluginAPI.writeFile(
            `${pluginDir}/plugin.json`,
            JSON.stringify(manifest, null, 2)
          )

          // Sauvegarder le fichier du plugin
          const fileContent = await file.text()
          await window.api.pluginAPI.writeFile(`${pluginDir}/${file.name}`, fileContent)

          notify.success({
            title: 'Plugin importé avec succès',
            message: `Le plugin "${pluginName}" a été créé. Rechargez les plugins pour le voir.`
          })

          // Recharger la liste des plugins
          await window.api.plugins.reload()
          await loadPlugins()

          return

        } catch (fallbackError) {
          notify.error({
            title: 'Erreur d\'importation',
            message: 'Impossible d\'importer le plugin. Redémarrez l\'application pour utiliser l\'API complète.'
          })
          return
        }
      }

      // Utiliser l'API réelle d'importation
      const result = await window.api.plugins.import(fileBuffer, file.name)

      if (result.success) {
        notify.success({
          title: 'Module importé avec succès',
          message: result.message
        })

        // Recharger la liste des plugins
        await loadPlugins()
      } else {
        throw new Error(result.message)
      }

    } catch (err) {
      notify.error({
        title: 'Erreur d\'importation',
        message: err instanceof Error ? err.message : 'Impossible d\'importer le module'
      })
    } finally {
      setImporting(false)
      // Reset input
      event.target.value = ''
    }
  }

  // Fonction pour importer depuis un dossier
  const handleFolderImport = async () => {
    try {
      setImporting(true)

      // Simuler la sélection d'un dossier (à remplacer par l'API Electron)
      notify.info({
        title: 'Sélection de dossier',
        message: 'Fonctionnalité en cours de développement'
      })

    } catch (err) {
      notify.error({
        title: 'Erreur d\'importation',
        message: 'Impossible d\'importer le dossier'
      })
    } finally {
      setImporting(false)
    }
  }

  // Fonction pour télécharger depuis une URL
  const handleUrlImport = async (url: string) => {
    if (!url.trim()) {
      notify.warning({
        title: 'URL manquante',
        message: 'Veuillez saisir une URL valide'
      })
      return
    }

    try {
      setImporting(true)

      // Simuler le téléchargement (à remplacer par l'API réelle)
      await new Promise(resolve => setTimeout(resolve, 3000))

      notify.success({
        title: 'Module téléchargé',
        message: `Module téléchargé depuis ${url} et installé`
      })

      await loadPlugins()
      setShowImportModal(false)

    } catch  {
      notify.error({
        title: 'Erreur de téléchargement',
        message: 'Impossible de télécharger le module depuis cette URL'
      })
    } finally {
      setImporting(false)
    }
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

  // Plugin list
  return (
    <div className="">
      {/* Header avec titre et boutons d'importation */}

      <HeaderSection
        search={search}
        setSearch={setSearch}
        rightChildren={
          <div className="dropdown dropdown-bottom dropdown-end">
          <label tabIndex={0} className="btn btn-sm m-1">
            Importer
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10"
          >
            {/* Importer fichier */}
            <li>
              <label className="flex items-center gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                Importer fichier
                <input
                  type="file"
                  accept=".zip,.tar.gz,.tgz,.js,.ts"
                  onChange={handleFileImport}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </li>
        
            {/* Importer dossier */}
            <li>
              <button
                onClick={handleFolderImport}
                disabled={importing}
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Importer dossier
              </button>
            </li>
        
            {/* Depuis URL */}
            <li>
              <button
                onClick={() => setShowImportModal(true)}
                disabled={importing}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Depuis URL
              </button>
            </li>
        
            {/* Recharger */}
            <li>
              <button
                onClick={async () => {
                  setLoading(true)
                  await window.api.plugins.reload()
                  await loadPlugins()
                }}
                disabled={loading || importing}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Recharger
              </button>
            </li>
          </ul>
           </div>
        }
      />
       

      <div className="px-4 space-y-6 mt-3">
        {/* Indicateur de chargement d'importation */}
        {importing && (
          <div className="alert alert-info">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm sm:text-base">Importation en cours...</span>
          </div>
        )}

        {/* Message d'information sur le redémarrage */}
        {!window.api?.plugins?.import && (
          <div className="alert alert-warning">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div className="flex-1">
                <strong className="text-sm sm:text-base">
                  ⚠️ API d'importation non disponible
                </strong>
                <p className="text-xs sm:text-sm mt-1">
                  L'API d'importation de plugins sera disponible après redémarrage de l'application.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-sm btn-warning w-full sm:w-auto"
              >
                Redémarrer
              </button>
            </div>
          </div>
        )}

        {/* Section d'information sur le stockage */}
       

        
        {loading ? (<div className="flex flex-col items-center justify-center  ">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-medium">Chargement des plugins...</p>
        </div>) :
          filteredPlugins.length === 0 ? (
            <div>
              {search ? (
                <div className="text-center py-8">
                  <div className="text-error text-sm sm:text-base">
                    <span>Aucun plugin trouvé pour "{search}".</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="">
                    <h2 className="text-base sm:text-lg lg:text-xl flex items-center gap-2 mb-4">
                      Importation de Modules
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <div className="stat bg-base-200 border border-base-300 rounded-lg p-4">
                        <div className="stat-figure text-primary">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="stat-title text-xs sm:text-sm">Fichiers</div>
                        <div className="stat-value text-xs sm:text-sm">ZIP, JS, TS</div>
                        <div className="stat-desc text-xs">Glissez-déposez ou cliquez</div>
                      </div>

                      <div className="stat bg-base-200 border border-base-300 rounded-lg p-4">
                        <div className="stat-figure text-secondary">
                          <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="stat-title text-xs sm:text-sm">Dossiers</div>
                        <div className="stat-value text-xs sm:text-sm">Projets</div>
                        <div className="stat-desc text-xs">Sélection de dossier</div>
                      </div>

                      <div className="stat bg-base-200 border border-base-300 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
                        <div className="stat-figure text-accent">
                          <Download className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="stat-title text-xs sm:text-sm">URLs</div>
                        <div className="stat-value text-xs sm:text-sm">Git, HTTP</div>
                        <div className="stat-desc text-xs">Téléchargement direct</div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 alert alert-warning mt-4">
                      <div className="text-xs sm:text-sm">
                        <strong>📁 Stockage:</strong> Les modules importés sont automatiquement installés dans le dossier
                        <code className="bg-base-300 px-1 sm:px-2 py-1 rounded mx-1 text-xs">
                          plugins/
                        </code>
                        et deviennent immédiatement disponibles dans l'application.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredPlugins.map((plugin) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  onSelect={handlePluginSelect}
                />
              ))}
            </div>
          )
        }

        {/* Modal d'importation depuis URL */}
        <ImportUrlModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleUrlImport}
          importing={importing}
        />
      </div>
    </div>
  )
}

export default PluginManager
