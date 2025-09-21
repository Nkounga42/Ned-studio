import React, { useState, useEffect } from "react"
import { 
  FileText, 
  Folder, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share,
  Star,
  Clock
} from "lucide-react"
import { useNotify } from "../hooks/useNotify"

interface Document {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  starred: boolean
  extension?: string
  path: string
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const notify = useNotify()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      // Simuler le chargement des documents
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockDocuments: Document[] = [
        {
          id: "1",
          name: "Projet NED Studio",
          type: "folder",
          modified: new Date(2024, 0, 15),
          starred: true,
          path: "/projects/ned-studio"
        },
        {
          id: "2",
          name: "Documentation.pdf",
          type: "file",
          size: 2048576,
          extension: "pdf",
          modified: new Date(2024, 0, 20),
          starred: false,
          path: "/documents/documentation.pdf"
        },
        {
          id: "3",
          name: "Specifications.docx",
          type: "file",
          size: 1024000,
          extension: "docx",
          modified: new Date(2024, 0, 18),
          starred: true,
          path: "/documents/specifications.docx"
        },
        {
          id: "4",
          name: "Images",
          type: "folder",
          modified: new Date(2024, 0, 10),
          starred: false,
          path: "/assets/images"
        },
        {
          id: "5",
          name: "config.json",
          type: "file",
          size: 4096,
          extension: "json",
          modified: new Date(2024, 0, 22),
          starred: false,
          path: "/config/config.json"
        }
      ]
      
      setDocuments(mockDocuments)
    } catch (error) {
      notify.error({
        title: "Erreur de chargement",
        message: "Impossible de charger les documents"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (doc: Document) => {
    if (doc.type === 'folder') return <Folder className="h-5 w-5 text-blue-500" />
    
    switch (doc.extension) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />
      case 'docx': case 'doc': return <FileText className="h-5 w-5 text-blue-600" />
      case 'json': return <FileText className="h-5 w-5 text-yellow-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "files" && doc.type === "file") ||
                         (selectedFilter === "folders" && doc.type === "folder") ||
                         (selectedFilter === "starred" && doc.starred)
    return matchesSearch && matchesFilter
  })

  const handleStarToggle = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, starred: !doc.starred } : doc
    ))
  }

  const handleUpload = () => {
    notify.info({
      title: "Upload de fichier",
      message: "Fonctionnalité d'upload en cours de développement"
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium">Chargement des documents...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-base-content/70 mt-1">
            Gérez vos fichiers et dossiers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            className="btn btn-primary gap-2"
          >
            <Upload className="h-4 w-4" />
            Uploader
          </button>
          <button className="btn btn-outline gap-2">
            <Plus className="h-4 w-4" />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-200 p-4 rounded-lg">
        <div className="flex gap-4 items-center flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Rechercher des documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">Tous</option>
            <option value="files">Fichiers</option>
            <option value="folders">Dossiers</option>
            <option value="starred">Favoris</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex gap-1 bg-base-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <div className="stat-title">Total documents</div>
          <div className="stat-value">{documents.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Folder className="h-8 w-8" />
          </div>
          <div className="stat-title">Dossiers</div>
          <div className="stat-value">{documents.filter(d => d.type === 'folder').length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <Star className="h-8 w-8" />
          </div>
          <div className="stat-title">Favoris</div>
          <div className="stat-value">{documents.filter(d => d.starred).length}</div>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
          <p className="text-base-content/70">
            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Commencez par uploader des fichiers"}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-2"
        }>
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={viewMode === 'grid'
                ? "card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border border-base-300"
                : "flex items-center justify-between p-3 bg-base-100 rounded-lg hover:bg-base-200 transition-all cursor-pointer"
              }
            >
              {viewMode === 'grid' ? (
                <div className="card-body p-4">
                  <div className="flex items-start justify-between mb-3">
                    {getFileIcon(doc)}
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                        <MoreVertical className="h-4 w-4" />
                      </label>
                      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a><Eye className="h-4 w-4" />Ouvrir</a></li>
                        <li><a><Edit className="h-4 w-4" />Renommer</a></li>
                        <li><a><Share className="h-4 w-4" />Partager</a></li>
                        <li><a><Download className="h-4 w-4" />Télécharger</a></li>
                        <li><a className="text-error"><Trash2 className="h-4 w-4" />Supprimer</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-sm mb-2 truncate" title={doc.name}>
                    {doc.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-base-content/60">
                    <span>{doc.size ? formatFileSize(doc.size) : ""}</span>
                    <button
                      onClick={() => handleStarToggle(doc.id)}
                      className={`btn btn-ghost btn-xs ${doc.starred ? 'text-yellow-500' : ''}`}
                    >
                      <Star className={`h-3 w-3 ${doc.starred ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-xs text-base-content/50 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(doc.modified)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(doc)}
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-base-content/60">
                        <span>{formatDate(doc.modified)}</span>
                        {doc.size && <span>{formatFileSize(doc.size)}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStarToggle(doc.id)}
                      className={`btn btn-ghost btn-sm ${doc.starred ? 'text-yellow-500' : ''}`}
                    >
                      <Star className={`h-4 w-4 ${doc.starred ? 'fill-current' : ''}`} />
                    </button>
                    
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <MoreVertical className="h-4 w-4" />
                      </label>
                      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a><Eye className="h-4 w-4" />Ouvrir</a></li>
                        <li><a><Edit className="h-4 w-4" />Renommer</a></li>
                        <li><a><Share className="h-4 w-4" />Partager</a></li>
                        <li><a><Download className="h-4 w-4" />Télécharger</a></li>
                        <li><a className="text-error"><Trash2 className="h-4 w-4" />Supprimer</a></li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
