import React, { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, User, X } from "lucide-react"

import { setToggleSidebarFunction } from "../../utils/sidebarUtils"
import { useAuth } from "../../contexts/AuthContext"
import logo from "../../assets/img/logo.png"
import { useMenu } from "@renderer/contexts/MenuContext"

interface SidebarProps {
  className?: string
  onPluginClose?: (pluginId: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ className = "", onPluginClose }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { menuItems, setActiveItem } = useMenu()
  const { user, logout } = useAuth()

  React.useEffect(() => {
    setToggleSidebarFunction(() => setIsExpanded((prev) => !prev))
    return () => {
      setToggleSidebarFunction(null)
    }
  }, [])

  // Fonction pour déterminer si un item peut être fermé
  const canCloseItem = (itemId: string) => {
    const staticItems = [
      "home",
      "documents",
      "projects",
      "search",
      "notifications",
      "downloads",
      "profile",
      "settings",
      "plugins-home",
      "modules",
      "test"
    ]
    return !staticItems.includes(itemId)
  }

  // Fonction pour fermer un plugin
  const handleClosePlugin = (e: React.MouseEvent, pluginId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (onPluginClose) {
      onPluginClose(pluginId)
    } else {
      // Fallback: déclencher l'événement de fermeture
      window.dispatchEvent(new CustomEvent("plugin-closed", { detail: pluginId }))
    }
  }

  const sidebarVariants = {
    expanded: {
      width: "14rem", // w-64
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    collapsed: {
      width: "50px", // w-16
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

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
  }
 

  return (
    <motion.div
      className={`bg-base-200 h-screen border-r border-base-300 relative overflow-hidden ${className}`}
      variants={sidebarVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
      initial="expanded"
    >
      {/* Header */}
      <div className="px-3.5 py-2 ">
        <div className="flex items-center space-x-3 ">
          <div className="avatar" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-all duration-75 cursor-pointer">
              <img src={logo} alt="Electron Logo" className="w-6 h-6" />
            </div>
          </div>
          <motion.div variants={contentVariants} animate={isExpanded ? "expanded" : "collapsed"}>
            <h2 className="text-lg font-semibold text-base-content whitespace-nowrap">
              NED Studio
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4" style={{ width: sidebarVariants.expanded.width }}>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div className="relative group">
                <a
                  // href={item.href}
                  onClick={() => {
                    if (item.closable && item.module) {
                      // plugin closable → ouvre l’onglet
                      window.dispatchEvent(new CustomEvent("plugin-opened", { detail: item }))
                    } else {
                      // item normal → active juste le menu
                      setActiveItem(item.id)
                    }
                  }}
                  className={`flex items-center space-x-3 mx-1 px-3 py-1.5 rounded-box transition-colors group relative cursor-pointer ${
                    item.isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      item.isActive
                        ? "text-primary-content"
                        : "text-base-content group-hover:text-primary"
                    }`}
                  />

                  <motion.span
                    className={`whitespace-nowrap flex-1 ${
                      item.isActive
                        ? "text-primary-content font-medium"
                        : "text-base-content font-light group-hover:text-primary"
                    }`}
                    variants={contentVariants}
                    animate={isExpanded ? "expanded" : "collapsed"}
                  >
                    {item.label}
                  </motion.span>

                  {item.badge && (
                    <motion.span
                      className="bg-error text-error-content text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center"
                      variants={contentVariants}
                      animate={isExpanded ? "expanded" : "collapsed"}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </a>

                {/* Bouton de fermeture pour les plugins */}
                {canCloseItem(item.id) && isExpanded && (
                  <motion.button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-base-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => handleClosePlugin(e, item.id)}
                    title={`Fermer ${item.label}`}
                    variants={contentVariants}
                    animate={isExpanded ? "expanded" : "collapsed"}
                  >
                    <X className="w-3 h-3 text-base-content/60 hover:text-error" />
                  </motion.button>
                )}
              </div>

              {/* Submenu */}
              {item.submenu && item.isActive && isExpanded && (
                <motion.ul
                  className="ml-8 mt-2 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
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
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-base-300" hidden>
        {/* User Info & Logout */}
        <div className="">
          <motion.div
            className="flex items-center space-x-3 p-2 rounded-lg bg-base-300/50"
            variants={contentVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                <User className="w-4 h-4" />
              </div>
            </div>
            <motion.div
              className="flex-1 min-w-0"
              variants={contentVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
            >
              <p className="text-sm font-medium text-base-content truncate">
                {user?.username || "Utilisateur"}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email || "user@nedstudio.com"}
              </p>
            </motion.div>
            <motion.button
              onClick={logout}
              className="btn btn-ghost btn-sm p-1 min-h-0 h-8 w-8"
              title="Se déconnecter"
              variants={contentVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   LogOut,
//   User
// } from 'lucide-react';

// import { setToggleSidebarFunction } from '../../utils/sidebarUtils';
// import { useMenuItems } from '../../hooks/useMenuItems';
// import { useAuth } from '../../contexts/AuthContext';
// import logo from '../../assets/img/logo.png';

// interface SidebarProps {
//   className?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const { menuItems, setActiveItem } = useMenuItems();
//   const { user, logout } = useAuth();

//   React.useEffect(() => {
//     setToggleSidebarFunction(() => setIsExpanded((prev) => !prev));
//     return () => {
//       setToggleSidebarFunction(null);
//     };
//   }, []);

//   const sidebarVariants = {
//     expanded: {
//       width: '14rem', // w-64
//       transition: {
//         duration: 0.3,
//         ease: 'easeInOut'
//       }
//     },
//     collapsed: {
//       width: '50px', // w-16
//       transition: {
//         duration: 0.3,
//         ease: 'easeInOut'
//       }
//     }
//   };

//   const contentVariants = {
//     expanded: {
//       opacity: 1,
//       transition: {
//         delay: 0.1,
//         duration: 0.2
//       }
//     },
//     collapsed: {
//        opacity: 0,
//       transition: {
//         duration: 0.1
//       }
//     }
//   };

//   return (
//     <motion.div
//       className={`bg-base-200 h-screen border-r border-base-300 relative overflow-hidden ${className}`}
//       variants={sidebarVariants}
//       animate={isExpanded ? 'expanded' : 'collapsed'}
//       initial="expanded"
//     >

//       {/* Header */}
//       <div className="px-3.5 py-2 ">
//         <div className="flex items-center space-x-3 ">
//           <div className="avatar" onClick={() => setIsExpanded(!isExpanded)}>
//             <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-all duration-75 cursor-pointer">
//               <img
//                 src={logo}
//                 alt="Electron Logo"
//                 className="w-6 h-6"
//               />
//             </div>
//           </div>
//           <motion.div
//             variants={contentVariants}
//             animate={isExpanded ? 'expanded' : 'collapsed'}
//           >
//             <h2 className="text-lg font-semibold text-base-content whitespace-nowrap">
//               NED Studio
//             </h2>
//           </motion.div>
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="mt-4" style={{ width: sidebarVariants.expanded.width }}>
//         <ul className="space-y-1">
//           {menuItems.map((item) => (
//             <li key={item.id}>
//               <a
//                 href={item.href}
//                 onClick={() => setActiveItem(item.id)}
//                 className={`flex items-center space-x-3 mx-1 px-3 py-1.5 rounded-box transition-colors group relative ${
//                   item.isActive
//                     ? 'bg-primary text-primary-content'
//                     : 'hover:bg-base-300'
//                 }`}
//               >

//                 <item.icon className={`w-4 h-4 ${
//                   item.isActive
//                     ? 'text-primary-content'
//                     : 'text-base-content group-hover:text-primary'
//                 }`} />

//                 <motion.span
//                   className={`whitespace-nowrap ${
//                     item.isActive
//                       ? 'text-primary-content font-medium'
//                       : 'text-base-content font-light group-hover:text-primary'
//                   }`}
//                   variants={contentVariants}
//                   animate={isExpanded ? 'expanded' : 'collapsed'}
//                 >
//                   {item.label}
//                 </motion.span>
//                 {item.badge && (
//                   <motion.span
//                     className="ml-auto bg-error text-error-content text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center"
//                     variants={contentVariants}
//                     animate={isExpanded ? 'expanded' : 'collapsed'}
//                   >
//                     {item.badge}
//                   </motion.span>
//                 )}
//               </a>
//               {/* Submenu */}
//               {item.submenu && item.isActive && isExpanded && (
//                 <motion.ul
//                   className="ml-8 mt-2 space-y-1"
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                 >
//                   {item.submenu.map((subItem) => (
//                     <li key={subItem.id}>
//                       <a
//                         href={subItem.href}
//                         className="flex items-center space-x-2 p-2 rounded-md hover:bg-base-300 transition-colors text-sm"
//                       >
//                         <subItem.icon className="w-4 h-4 text-base-content/70" />
//                         <span className="text-base-content/70">{subItem.label}</span>
//                       </a>
//                     </li>
//                   ))}
//                 </motion.ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Footer */}
//       <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-base-300" hidden>
//         {/* User Info & Logout */}
//         <div className="">
//           <motion.div
//             className="flex items-center space-x-3 p-2 rounded-lg bg-base-300/50"
//             variants={contentVariants}
//             animate={isExpanded ? 'expanded' : 'collapsed'}
//           >
//             <div className="avatar placeholder">
//               <div className="bg-primary text-primary-content rounded-full w-8">
//                 <User className="w-4 h-4" />
//               </div>
//             </div>
//             <motion.div
//               className="flex-1 min-w-0"
//               variants={contentVariants}
//               animate={isExpanded ? 'expanded' : 'collapsed'}
//             >
//               <p className="text-sm font-medium text-base-content truncate">
//                 {user?.username || 'Utilisateur'}
//               </p>
//               <p className="text-xs text-base-content/60 truncate">
//                 {user?.email || 'user@nedstudio.com'}
//               </p>
//             </motion.div>
//             <motion.button
//               onClick={logout}
//               className="btn btn-ghost btn-sm p-1 min-h-0 h-8 w-8"
//               title="Se déconnecter"
//               variants={contentVariants}
//               animate={isExpanded ? 'expanded' : 'collapsed'}
//             >
//               <LogOut className="w-4 h-4" />
//             </motion.button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;
