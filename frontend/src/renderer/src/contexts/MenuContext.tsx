import React, { createContext, useContext } from "react"
import useMenuItems, { MenuItem } from "../hooks/useMenuItems"

interface MenuContextType {
  menuItems: MenuItem[]
  addMenuItem: (item: MenuItem) => void
  removeMenuItem: (id: string) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  setActiveItem: (id: string) => void
  updateBadge: (id: string, count: number) => void
  reorderItems: (startIndex: number, endIndex: number) => void
  filterItems: (searchTerm: string) => MenuItem[]
}

const MenuContext = createContext<MenuContextType | null>(null)

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const menu = useMenuItems()
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
}

export const useMenu = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider")
  return ctx
}
