import { useState, useEffect } from "react";
import { Home, FileText, Box, Folder, Search, Bell, User, Settings, Download } from "lucide-react";

export interface MenuItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  href?: string;
  badge?: number;
  isActive?: boolean;
  submenu?: MenuItem[];
  closable?: boolean;
  pluginComponent?: React.ComponentType<any>;
}

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "home", icon: Home, label: "Accueil" },
    { id: "documents", icon: FileText, label: "Documents" },
    { id: "modules", icon: Box, label: "Modules" },
    { id: "projects", icon: Folder, label: "Projets" },
    { id: "search", icon: Search, label: "Recherche" },
    { id: "notifications", icon: Bell, label: "Notifications", badge: 3 },
    { id: "downloads", icon: Download, label: "Téléchargements" },
    { id: "profile", icon: User, label: "Profil" },
    { id: "settings", icon: Settings, label: "Paramètres" }
  ]);

  const [activeItemId, setActiveItemId] = useState("home");

  // Mettre à jour l’item actif
  const setActiveItem = (id: string) => {
    setActiveItemId(id);
    setMenuItems(prev =>
      prev.map(item => ({ ...item, isActive: item.id === id }))
    );
  };

  // Ajouter un menu item et l’activer automatiquement
  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => {
      // Si l’item existe déjà, ne pas le dupliquer
      if (prev.find(i => i.id === item.id)) return prev;

      // Désactiver tous les autres items et ajouter le nouveau actif
      return [
        ...prev.map(i => ({ ...i, isActive: false })),
        { ...item, isActive: true }
      ];
    });

    setActiveItemId(item.id);
  };

  // Supprimer un menu item
  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));

    // Si l’item actif a été supprimé, revenir à home
    if (activeItemId === id) setActiveItem("home");
  };

  // Mettre à jour un item
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Mettre à jour le badge
  const updateBadge = (id: string, count: number) => {
    updateMenuItem(id, { badge: count > 0 ? count : undefined });
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeItem = menuItems.find(item => item.href === currentPath);
    if (activeItem) setActiveItem(activeItem.id);
  }, []);

  return {
    menuItems,
    activeItemId,
    setActiveItem,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
    updateBadge
  };
};

export default useMenuItems;
 