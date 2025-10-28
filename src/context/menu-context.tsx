import React, { createContext, ReactNode, useContext, useState } from 'react'

// Defina o tipo do contexto
interface MenuContextType {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

// Criação do contexto com valores iniciais
const MenuContext = createContext<MenuContextType | undefined>(undefined)

// Provedor do contexto
interface MenuProviderProps {
  children: ReactNode
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Função para alternar o estado do menu
  const setOpen = (open: boolean) => setIsOpen(open)

  return (
    <MenuContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </MenuContext.Provider>
  )
}

// Hook para acessar o contexto facilmente
export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
