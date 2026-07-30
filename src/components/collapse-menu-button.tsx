'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { useMenu } from '@/context/menu-context'

import { Button } from './ui/button'

export default function CollapseMenuButton() {
  const { isOpen, setOpen } = useMenu()
  return (
    <Button
      size="icon"
      variant="ghost"
      className="hidden lg:inline-flex"
      onClick={() => setOpen(!isOpen)}
      aria-label={isOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
      title={isOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
    >
      {isOpen ? (
        <PanelLeftClose className="size-5" />
      ) : (
        <PanelLeftOpen className="size-5" />
      )}
    </Button>
  )
}
