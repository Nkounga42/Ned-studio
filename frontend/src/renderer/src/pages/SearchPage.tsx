import React, { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  FolderOpen, 
  Users, 
  Code, 
  Image, 
  Video,
  Music,
  Archive,
  X,
  Calendar,
  Tag,
  MapPin,
  Zap,
  TrendingUp,
  History
} from "lucide-react"
import { useNotify } from "../hooks/useNotify"

interface SearchResult {
  id: string
  title: string
  type: 'file' | 'project' | 'user' | 'code' | 'image' | 'video' | 'audio' | 'archive'
  content: string
  path: string
  lastModified: Date
  size?: number
  author?: string
  tags: string[]
  relevance: number
}

interface SearchFilter {
  type: string[]
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  author: string
  tags: string[]
  minSize?: number
  maxSize?: number
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    dateRange: 'all',
    author: '',
    tags: []
  })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const notify = useNotify()

  useEffect(() => {
    // Charger l'historique de recherche
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 2) {
      generateSuggestions()
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  const generateSuggestions = () => {
    const mockSuggestions = [
      "react components",
      "typescript interfaces",
      "electron main process",
      "plugin architecture",
      "authentication system",
      "database models",
      "api endpoints",
      "user interface"
    ].filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    setSuggestions(mockSuggestions.slice(0, 5))
  }

  const performSearch = async (query: string = searchTerm) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      
      // Ajouter à l'historique
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))

      // Simuler la recherche
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Authentication Context",
          type: "code",
          content: "React Context pour la gestion de l'authentification utilisateur avec localStorage",
          path: "/src/contexts/AuthContext.tsx",
          lastModified: new Date(2024, 0, 22),
          author: "Alice",
          tags: ["react", "authentication", "context"],
          relevance: 95
        },
        {
          id: "2",
          title: "User Profile Component",
          type: "file",
          content: "Composant React pour l'affichage et la modification du profil utilisateur",
          path: "/src/components/UserProfile.tsx",
          lastModified: new Date(2024, 0, 20),
          size: 8192,
          author: "Bob",
          tags: ["react", "component", "profile"],
          relevance: 88
        },
        {
          id: "3",
          title: "NED Studio Project",
          type: "project",
          content: "Plateforme de développement moderne avec Electron et React",
          path: "/projects/ned-studio",
          lastModified: new Date(2024, 0, 18),
          author: "Team",
          tags: ["electron", "react", "typescript"],
          relevance: 82
        },
        {
          id: "4",
          title: "Login Page Screenshot",
          type: "image",
          content: "Capture d'écran de la page de connexion avec le nouveau design",
          path: "/assets/screenshots/login.png",
          lastModified: new Date(2024, 0, 15),
          size: 245760,
          author: "Charlie",
          tags: ["ui", "design", "login"],
          relevance: 75
        },
        {
          id: "5",
          title: "API Documentation",
          type: "file",
          content: "Documentation complète de l'API REST avec exemples d'utilisation",
          path: "/docs/api.md",
          lastModified: new Date(2024, 0, 12),
          size: 16384,
          author: "David",
          tags: ["documentation", "api", "rest"],
          relevance: 70
        }
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      
      setResults(mockResults)
      setSuggestions([])
      
    } catch (error) {
      notify.error({
        title: "Erreur de recherche",
        message: "Impossible d'effectuer la recherche"
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'file': return <FileText className="h-5 w-5 text-blue-500" />
      case 'project': return <FolderOpen className="h-5 w-5 text-green-500" />
      case 'user': return <Users className="h-5 w-5 text-purple-500" />
      case 'code': return <Code className="h-5 w-5 text-orange-500" />
      case 'image': return <Image className="h-5 w-5 text-pink-500" />
      case 'video': return <Video className="h-5 w-5 text-red-500" />
      case 'audio': return <Music className="h-5 w-5 text-indigo-500" />
      case 'archive': return <Archive className="h-5 w-5 text-gray-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
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
      year: 'numeric'
    })
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      dateRange: 'all',
      author: '',
      tags: []
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Recherche</h1>
        <p className="text-base-content/70">
          Trouvez rapidement vos fichiers, projets et contenus
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Rechercher des fichiers, projets, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                className="input input-bordered input-lg w-full pl-12 pr-4"
              />
              
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg mt-1 shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion)
                        performSearch(suggestion)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-base-200 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-base-content/50" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => performSearch()}
              disabled={loading}
              className="btn btn-primary btn-lg ml-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-outline btn-lg ml-2 ${showFilters ? 'btn-active' : ''}`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['Fichiers', 'Projets', 'Code', 'Images'].map((filter) => (
            <button
              key={filter}
              className="btn btn-sm btn-outline"
              onClick={() => performSearch(filter.toLowerCase())}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="max-w-4xl mx-auto card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Filtres avancés</h3>
              <button
                onClick={clearFilters}
                className="btn btn-ghost btn-sm"
              >
                <X className="h-4 w-4" />
                Effacer
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Type de fichier</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>Tous les types</option>
                  <option>Documents</option>
                  <option>Images</option>
                  <option>Code</option>
                  <option>Archives</option>
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Période</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                >
                  <option value="all">Toute période</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Auteur</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom de l'auteur"
                  value={filters.author}
                  onChange={(e) => setFilters({...filters, author: e.target.value})}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Taille</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>Toutes tailles</option>
                  <option>Petits (&lt; 1MB)</option>
                  <option>Moyens (1-10MB)</option>
                  <option>Grands (&gt; 10MB)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchTerm && results.length === 0 && (
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Recherches récentes
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchTerm(term)
                  performSearch(term)
                }}
                className="btn btn-sm btn-outline gap-2"
              >
                <Clock className="h-3 w-3" />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
              </h3>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <TrendingUp className="h-4 w-4" />
                <span>Triés par pertinence</span>
              </div>
            </div>
            
            <select className="select select-bordered select-sm">
              <option>Pertinence</option>
              <option>Date (récent)</option>
              <option>Date (ancien)</option>
              <option>Nom (A-Z)</option>
              <option>Taille</option>
            </select>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border border-base-300"
              >
                <div className="card-body p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-lg text-primary hover:underline">
                          {result.title}
                        </h4>
                        <div className="text-sm text-base-content/60">
                          {result.relevance}% pertinence
                        </div>
                      </div>
                      
                      <p className="text-base-content/70 mb-3 line-clamp-2">
                        {result.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-base-content/60 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="font-mono text-xs">{result.path}</span>
                        </div>
                        
                        {result.size && (
                          <div className="flex items-center gap-1">
                            <Archive className="h-3 w-3" />
                            <span>{formatFileSize(result.size)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(result.lastModified)}</span>
                        </div>
                        
                        {result.author && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{result.author}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge badge-outline badge-sm"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && searchTerm && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
          <p className="text-base-content/70 mb-4">
            Essayez avec d'autres mots-clés ou ajustez vos filtres
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="btn btn-outline gap-2"
          >
            <Filter className="h-4 w-4" />
            Modifier les filtres
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchPage
