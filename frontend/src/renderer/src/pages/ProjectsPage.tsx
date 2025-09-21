import React, { useState, useEffect } from "react"
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Calendar,
  Users,
  GitBranch,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share,
  Archive,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useNotify } from "../hooks/useNotify"

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  progress: number
  team: string[]
  lastModified: Date
  created: Date
  starred: boolean
  repository?: string
  tags: string[]
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const notify = useNotify()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "NED Studio",
          description: "Plateforme de développement moderne avec Electron et React",
          status: "active",
          progress: 75,
          team: ["Alice", "Bob", "Charlie"],
          lastModified: new Date(2024, 0, 22),
          created: new Date(2023, 11, 1),
          starred: true,
          repository: "https://github.com/ned/studio",
          tags: ["electron", "react", "typescript"]
        },
        {
          id: "2",
          name: "Plugin Manager",
          description: "Système de gestion de plugins extensible",
          status: "active",
          progress: 60,
          team: ["Alice", "David"],
          lastModified: new Date(2024, 0, 20),
          created: new Date(2024, 0, 5),
          starred: false,
          repository: "https://github.com/ned/plugins",
          tags: ["plugins", "javascript"]
        },
        {
          id: "3",
          name: "Documentation Site",
          description: "Site de documentation utilisateur et développeur",
          status: "completed",
          progress: 100,
          team: ["Eve", "Frank"],
          lastModified: new Date(2024, 0, 15),
          created: new Date(2023, 10, 15),
          starred: true,
          tags: ["documentation", "gatsby"]
        },
        {
          id: "4",
          name: "Mobile App",
          description: "Application mobile compagnon",
          status: "paused",
          progress: 30,
          team: ["Grace"],
          lastModified: new Date(2024, 0, 10),
          created: new Date(2023, 9, 1),
          starred: false,
          tags: ["mobile", "react-native"]
        },
        {
          id: "5",
          name: "Legacy Migration",
          description: "Migration des anciens systèmes",
          status: "archived",
          progress: 100,
          team: ["Henry", "Iris"],
          lastModified: new Date(2023, 11, 30),
          created: new Date(2023, 8, 1),
          starred: false,
          tags: ["migration", "legacy"]
        }
      ]
      
      setProjects(mockProjects)
    } catch (error) {
      notify.error({
        title: "Erreur de chargement",
        message: "Impossible de charger les projets"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-500" />
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'archived': return <Archive className="h-4 w-4 text-gray-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'badge-success'
      case 'paused': return 'badge-warning'
      case 'completed': return 'badge-info'
      case 'archived': return 'badge-neutral'
      default: return 'badge-ghost'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStarToggle = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, starred: !project.starred } : project
    ))
  }

  const handleCreateProject = () => {
    setShowCreateModal(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium">Chargement des projets...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-base-content/70 mt-1">
            Gérez vos projets de développement
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          className="btn btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-200 p-4 rounded-lg">
        <div className="flex gap-4 items-center flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Rechercher des projets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="paused">En pause</option>
            <option value="completed">Terminés</option>
            <option value="archived">Archivés</option>
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
            <FolderOpen className="h-8 w-8" />
          </div>
          <div className="stat-title">Total projets</div>
          <div className="stat-value">{projects.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-success">
            <Play className="h-8 w-8" />
          </div>
          <div className="stat-title">Actifs</div>
          <div className="stat-value">{projects.filter(p => p.status === 'active').length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-info">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="stat-title">Terminés</div>
          <div className="stat-value">{projects.filter(p => p.status === 'completed').length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <Star className="h-8 w-8" />
          </div>
          <div className="stat-title">Favoris</div>
          <div className="stat-value">{projects.filter(p => p.starred).length}</div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
          <p className="text-base-content/70">
            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : "Commencez par créer votre premier projet"}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={viewMode === 'grid'
                ? "card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border border-base-300"
                : "card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer border border-base-300"
              }
            >
              <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(project.status)}
                    <h3 className="card-title text-lg">{project.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStarToggle(project.id)}
                      className={`btn btn-ghost btn-sm ${project.starred ? 'text-yellow-500' : ''}`}
                    >
                      <Star className={`h-4 w-4 ${project.starred ? 'fill-current' : ''}`} />
                    </button>
                    
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <MoreVertical className="h-4 w-4" />
                      </label>
                      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a><Eye className="h-4 w-4" />Ouvrir</a></li>
                        <li><a><Edit className="h-4 w-4" />Modifier</a></li>
                        <li><a><Share className="h-4 w-4" />Partager</a></li>
                        <li><a><GitBranch className="h-4 w-4" />Repository</a></li>
                        <li><a><Archive className="h-4 w-4" />Archiver</a></li>
                        <li><a className="text-error"><Trash2 className="h-4 w-4" />Supprimer</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base-content/70 text-sm mb-4">
                  {project.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{project.progress}%</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={project.progress} 
                    max="100"
                  ></progress>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className={`badge ${getStatusColor(project.status)} badge-sm`}>
                      {project.status}
                    </span>
                    
                    <div className="flex items-center gap-1 text-base-content/60">
                      <Users className="h-3 w-3" />
                      <span>{project.team.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-base-content/50">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(project.lastModified)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Créer un nouveau projet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Nom du projet</span>
                </label>
                <input
                  type="text"
                  placeholder="Mon super projet"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Description du projet..."
                  className="textarea textarea-bordered w-full"
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Repository (optionnel)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-ghost"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  notify.success({
                    title: "Projet créé",
                    message: "Le nouveau projet a été créé avec succès"
                  })
                  setShowCreateModal(false)
                }}
                className="btn btn-primary"
              >
                Créer
              </button>
            </div>
          </div>
          <div 
            className="modal-backdrop" 
            onClick={() => setShowCreateModal(false)}
          ></div>
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
