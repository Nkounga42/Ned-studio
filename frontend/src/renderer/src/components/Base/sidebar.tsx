import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { setToggleSidebarFunction } from '../../utils/sidebarUtils';
import { useMenuItems } from '../../hooks/useMenuItems';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { menuItems, setActiveItem } = useMenuItems();
  const { user, logout } = useAuth();

  // Set the toggle function reference
  React.useEffect(() => {
    setToggleSidebarFunction(() => setIsExpanded((prev) => !prev));
    
    // Cleanup on unmount
    return () => {
      setToggleSidebarFunction(null);
    };
  }, []);

  const sidebarVariants = {
    expanded: {
      width: '16rem', // w-64
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    collapsed: {
      width: '4rem', // w-16
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    collapsed: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      className={`bg-base-200 h-screen shadow-lg relative ${className}`}
      variants={sidebarVariants}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      initial="expanded"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-primary text-primary-content rounded-full p-1 shadow-md hover:bg-primary-focus transition-colors z-10"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Menu className="w-4 h-4 text-primary-content" />
            </div>
          </div>
          <motion.div
            variants={contentVariants}
            animate={isExpanded ? 'expanded' : 'collapsed'}
          >
            <h2 className="text-lg font-semibold text-base-content whitespace-nowrap">
              NED Studio
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group relative ${
                  item.isActive 
                    ? 'bg-primary text-primary-content' 
                    : 'hover:bg-base-300'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  item.isActive 
                    ? 'text-primary-content' 
                    : 'text-base-content group-hover:text-primary'
                }`} />
                <motion.span
                  className={`whitespace-nowrap ${
                    item.isActive 
                      ? 'text-primary-content font-medium' 
                      : 'text-base-content group-hover:text-primary'
                  }`}
                  variants={contentVariants}
                  animate={isExpanded ? 'expanded' : 'collapsed'}
                >
                  {item.label}
                </motion.span>
                {item.badge && (
                  <motion.span
                    className="ml-auto bg-error text-error-content text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center"
                    variants={contentVariants}
                    animate={isExpanded ? 'expanded' : 'collapsed'}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </a>
              {/* Submenu */}
              {item.submenu && item.isActive && isExpanded && (
                <motion.ul
                  className="ml-8 mt-2 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      <a
                        href={subItem.href}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-base-300 transition-colors text-sm"
                      >
                        <subItem.icon className="w-4 h-4 text-base-content/70" />
                        <span className="text-base-content/70">{subItem.label}</span>
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
        {/* User Info & Logout */}
        <div className="mb-3">
          <motion.div
            className="flex items-center space-x-3 p-2 rounded-lg bg-base-300/50"
            variants={contentVariants}
            animate={isExpanded ? 'expanded' : 'collapsed'}
          >
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                <User className="w-4 h-4" />
              </div>
            </div>
            <motion.div
              className="flex-1 min-w-0"
              variants={contentVariants}
              animate={isExpanded ? 'expanded' : 'collapsed'}
            >
              <p className="text-sm font-medium text-base-content truncate">
                {user?.username || 'Utilisateur'}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email || 'user@nedstudio.com'}
              </p>
            </motion.div>
            <motion.button
              onClick={logout}
              className="btn btn-ghost btn-sm p-1 min-h-0 h-8 w-8"
              title="Se déconnecter"
              variants={contentVariants}
              animate={isExpanded ? 'expanded' : 'collapsed'}
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div
          className="text-xs text-base-content/60 text-center"
          variants={contentVariants}
          animate={isExpanded ? 'expanded' : 'collapsed'}
        >
          2024 NED Studio
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
