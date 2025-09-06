# Custom Hooks Documentation

## useMenuItems Hook

Un hook personnalisé pour gérer les éléments de menu de la sidebar avec des fonctionnalités avancées.

### 📋 Table des matières

- [Installation](#installation)
- [Interface MenuItem](#interface-menuitem)
- [Utilisation de base](#utilisation-de-base)
- [Fonctionnalités](#fonctionnalités)
- [Exemples d'utilisation](#exemples-dutilisation)
- [API Reference](#api-reference)

### 🚀 Installation

```tsx
import { useMenuItems } from '../hooks/useMenuItems';
```

### 📝 Interface MenuItem

```typescript
interface MenuItem {
  id: string                              // Identifiant unique
  icon: React.ComponentType<any>          // Composant d'icône (Lucide React)
  label: string                           // Texte affiché
  href: string                            // URL de navigation
  badge?: number                          // Badge de notification (optionnel)
  isActive?: boolean                      // État actif/inactif
  submenu?: MenuItem[]                    // Sous-menus (optionnel)
}
```

### 🎯 Utilisation de base

```tsx
import React from 'react';
import { useMenuItems } from '../hooks/useMenuItems';

const Sidebar = () => {
  const { 
    menuItems, 
    setActiveItem, 
    updateBadge,
    addMenuItem 
  } = useMenuItems();

  return (
    <nav>
      {menuItems.map((item) => (
        <div key={item.id} onClick={() => setActiveItem(item.id)}>
          <item.icon />
          <span>{item.label}</span>
          {item.badge && <span className="badge">{item.badge}</span>}
        </div>
      ))}
    </nav>
  );
};
```

### ✨ Fonctionnalités

#### 🎨 **Menu Items par défaut**
- **Accueil** - Page d'accueil principale
- **Documents** - Gestion des documents
- **Projets** - Gestion des projets avec sous-menu
  - Nouveau projet
  - Templates
- **Recherche** - Fonction de recherche
- **Notifications** - Avec badge de compteur
- **Téléchargements** - Gestion des téléchargements
- **Profil** - Profil utilisateur
- **Paramètres** - Configuration

#### 🔧 **Gestion dynamique**
- ✅ Ajout/suppression d'items
- ✅ Mise à jour en temps réel
- ✅ Gestion des états actifs
- ✅ Badges de notification
- ✅ Sous-menus déroulants
- ✅ Réorganisation par drag & drop
- ✅ Filtrage par recherche

#### 🎭 **Navigation intelligente**
- ✅ Détection automatique de l'URL active
- ✅ Synchronisation avec le routeur
- ✅ Gestion des sous-menus

### 📚 Exemples d'utilisation

#### Ajouter un nouvel item

```tsx
const { addMenuItem } = useMenuItems();

// Ajouter un item simple
addMenuItem({
  id: 'analytics',
  icon: BarChart,
  label: 'Analytics',
  href: '/analytics'
});

// Ajouter un item avec badge
addMenuItem({
  id: 'messages',
  icon: MessageCircle,
  label: 'Messages',
  href: '/messages',
  badge: 5
});
```

#### Gérer les badges de notification

```tsx
const { updateBadge } = useMenuItems();

// Mettre à jour le badge des notifications
updateBadge('notifications', 12);

// Supprimer un badge (passer 0)
updateBadge('notifications', 0);
```

#### Créer des sous-menus

```tsx
const { addMenuItem } = useMenuItems();

addMenuItem({
  id: 'admin',
  icon: Shield,
  label: 'Administration',
  href: '/admin',
  submenu: [
    {
      id: 'users',
      icon: Users,
      label: 'Utilisateurs',
      href: '/admin/users'
    },
    {
      id: 'roles',
      icon: Key,
      label: 'Rôles',
      href: '/admin/roles'
    }
  ]
});
```

#### Filtrer les items

```tsx
const { filterItems } = useMenuItems();

// Rechercher dans les menus
const searchResults = filterItems('projet');
// Retourne tous les items contenant "projet"
```

#### Réorganiser les items

```tsx
const { reorderItems } = useMenuItems();

// Déplacer l'item de l'index 0 vers l'index 2
reorderItems(0, 2);
```

### 📖 API Reference

#### Valeurs retournées

| Propriété | Type | Description |
|-----------|------|-------------|
| `menuItems` | `MenuItem[]` | Liste des items de menu |
| `addMenuItem` | `(item: MenuItem) => void` | Ajouter un item |
| `removeMenuItem` | `(id: string) => void` | Supprimer un item |
| `updateMenuItem` | `(id: string, updates: Partial<MenuItem>) => void` | Mettre à jour un item |
| `setActiveItem` | `(id: string) => void` | Définir l'item actif |
| `updateBadge` | `(id: string, count: number) => void` | Mettre à jour un badge |
| `reorderItems` | `(startIndex: number, endIndex: number) => void` | Réorganiser les items |
| `filterItems` | `(searchTerm: string) => MenuItem[]` | Filtrer les items |

#### Méthodes détaillées

##### `addMenuItem(item: MenuItem)`
Ajoute un nouvel item à la fin de la liste.

```tsx
addMenuItem({
  id: 'unique-id',
  icon: IconComponent,
  label: 'Mon Item',
  href: '/my-route'
});
```

##### `updateMenuItem(id: string, updates: Partial<MenuItem>)`
Met à jour partiellement un item existant.

```tsx
updateMenuItem('notifications', {
  badge: 8,
  label: 'Notifications (8)'
});
```

##### `setActiveItem(id: string)`
Définit un item comme actif et désactive tous les autres.

```tsx
setActiveItem('home'); // Active l'item 'home'
```

### 🎨 Intégration avec les styles

Le hook fonctionne parfaitement avec DaisyUI et Tailwind CSS :

```tsx
<a
  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
    item.isActive 
      ? 'bg-primary text-primary-content' 
      : 'hover:bg-base-300'
  }`}
>
  <item.icon className="w-5 h-5" />
  <span>{item.label}</span>
  {item.badge && (
    <span className="ml-auto bg-error text-error-content text-xs rounded-full px-2 py-1">
      {item.badge}
    </span>
  )}
</a>
```

### 🔄 Gestion des effets de bord

Le hook gère automatiquement :
- La synchronisation avec l'URL courante
- La mise à jour des états actifs
- La persistance des modifications
- Les animations de transition

### 🚨 Bonnes pratiques

1. **IDs uniques** : Toujours utiliser des IDs uniques pour chaque item
2. **Icônes cohérentes** : Utiliser la même bibliothèque d'icônes (Lucide React)
3. **Badges modérés** : Ne pas abuser des badges de notification
4. **Sous-menus limités** : Éviter plus de 2 niveaux de profondeur
5. **Performance** : Utiliser `React.memo` pour les composants d'items si nécessaire

### 🐛 Dépannage

#### L'item ne s'active pas automatiquement
Vérifiez que l'URL dans `href` correspond exactement à l'URL courante.

#### Les badges ne s'affichent pas
Assurez-vous que la valeur du badge est supérieure à 0.

#### Les sous-menus ne s'ouvrent pas
Vérifiez que l'item parent est actif et que `isExpanded` est `true`.

---

**Créé pour NED Studio** - Hook personnalisé pour une navigation fluide et moderne.
