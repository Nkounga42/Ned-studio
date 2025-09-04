import { useState, useEffect } from 'react'
import { Home, FileText, Search, Bell, User, Settings, Folder, Code, Palette, Download } from 'lucide-react'

export interface MenuItem {
  id: string
  icon: React.ComponentType<any>
  label: string
  href: string
  badge?: number
  isActive?: boolean
  submenu?: MenuItem[]
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { 
      id: 'home',
      icon: Home, 
      label: 'Accueil', 
      href: '/',
      isActive: true
    },
    { 
      id: 'documents',
      icon: FileText, 
      label: 'Documents', 
      href: '/documents' 
    },
    { 
      id: 'projects',
      icon: Folder, 
      label: 'Projets', 
      href: '/projects',
      submenu: [
        { id: 'new-project', icon: Code, label: 'Nouveau projet', href: '/projects/new' },
        { id: 'templates', icon: Palette, label: 'Templates', href: '/projects/templates' }
      ]
    },
    { 
      id: 'search',
      icon: Search, 
      label: 'Recherche', 
      href: '/search' 
    },
    { 
      id: 'notifications',
      icon: Bell, 
      label: 'Notifications', 
      href: '/notifications',
      badge: 3
    },
    { 
      id: 'downloads',
      icon: Download, 
      label: 'Téléchargements', 
      href: '/downloads' 
    },
    { 
      id: 'profile',
      icon: User, 
      label: 'Profil', 
      href: '/profile' 
    },
    { 
      id: 'settings',
      icon: Settings, 
      label: 'Paramètres', 
      href: '/settings' 
    }
  ])

  // Fonction pour ajouter un menu item
  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item])
  }

  // Fonction pour supprimer un menu item
  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }

  // Fonction pour mettre à jour un menu item
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  // Fonction pour définir l'item actif
  const setActiveItem = (id: string) => {
    setMenuItems(prev => 
      prev.map(item => ({
        ...item,
        isActive: item.id === id
      }))
    )
  }

  // Fonction pour mettre à jour le badge d'un item
  const updateBadge = (id: string, count: number) => {
    updateMenuItem(id, { badge: count > 0 ? count : undefined })
  }

  // Fonction pour réorganiser les items
  const reorderItems = (startIndex: number, endIndex: number) => {
    setMenuItems(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  // Fonction pour filtrer les items par recherche
  const filterItems = (searchTerm: string) => {
    if (!searchTerm) return menuItems
    
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submenu?.some(subItem => 
        subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }

  // Effet pour gérer la navigation et définir l'item actif basé sur l'URL
  useEffect(() => {
    const currentPath = window.location.pathname
    const activeItem = menuItems.find(item => 
      item.href === currentPath || 
      item.submenu?.some(subItem => subItem.href === currentPath)
    )
    
    if (activeItem && !activeItem.isActive) {
      setActiveItem(activeItem.id)
    }
  }, [menuItems])

  return {
    menuItems,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
    setActiveItem,
    updateBadge,
    reorderItems,
    filterItems
  }
}

export default useMenuItems
