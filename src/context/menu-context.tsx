'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore
} from 'react'

const SIDEBAR_STORAGE_KEY = 'certifica-sidebar-open'
const SIDEBAR_CHANGE_EVENT = 'certifica-sidebar-change'

function subscribeToSidebar(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback)
  }
}

function getSidebarSnapshot() {
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== 'false'
}

interface MenuContextType {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

interface MenuProviderProps {
  children: ReactNode
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const isOpen = useSyncExternalStore(
    subscribeToSidebar,
    getSidebarSnapshot,
    () => true
  )

  const setOpen = (open: boolean) => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT))
  }

  return (
    <MenuContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
