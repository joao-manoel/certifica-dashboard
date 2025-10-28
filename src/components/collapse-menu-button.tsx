'use client'
import Image from 'next/image'

import { useMenu } from '@/context/menu-context'

import { Button } from './ui/button'

export default function CollapseMenuButton() {
  const { isOpen, setOpen } = useMenu()
  return (
    <Button
      size="icon"
      className={`bg-muted hover:bg-muted/60`}
      onClick={() => setOpen(!isOpen)}
    >
      {isOpen ? (
        <Image
          src="images/menu-left.svg"
          alt="Collapse menu"
          width={16}
          height={16}
        />
      ) : (
        <Image
          src="images/menu-left.svg"
          alt="Expand menu"
          width={16}
          height={16}
        />
      )}
    </Button>
  )
}
