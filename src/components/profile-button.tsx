import { LogOut } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/format'

import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default async function ProfileButton() {
  // const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <Avatar>
          <AvatarFallback>{getInitials('Administrador')}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-6 w-[354px] bg-muted">
        <DropdownMenuItem
          asChild
          className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-200 dark:hover:bg-black/10"
        >
          <Link href="/account">
            <div className="flex gap-2">
              <Avatar>
                <AvatarFallback>{getInitials('Administrador')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-black dark:text-white">
                  Administrador
                </span>
                <span className="text-xs font-thin text-muted-foreground">
                  admin@certifica.eng.br
                </span>
              </div>
            </div>
            <div className="rounded-sm p-2 hover:bg-muted">
              <span>Ver Perfil</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          asChild
          className="cursor-pointer p-4 transition-colors hover:bg-zinc-200 hover:text-red-400 dark:hover:bg-black/10"
        >
          <a
            href="/api/auth/sign-out"
            className="text-red-400 dark:hover:text-red-400"
          >
            <LogOut />
            <span className="font-bold">Sair da conta</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
