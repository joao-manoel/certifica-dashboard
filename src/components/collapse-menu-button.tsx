'use client'
import Image from 'next/image'

import { useMenu } from '@/context/menu-context'
import MenuLeftIcon from '@/assets/images/menu-left.svg'
import MenuRightIcon from '@/assets/images/menu-right.svg'

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
        <Image src={MenuLeftIcon} alt="Collapse menu" width={16} height={16} />
      ) : (
        <Image src={MenuRightIcon} alt="Expand menu" width={16} height={16} />
      )}
    </Button>
  )
}
