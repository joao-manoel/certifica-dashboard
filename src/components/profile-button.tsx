import { LogOut, Settings, User } from 'lucide-react'
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
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none mr-15">
        <User className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-6 w-[354px] bg-muted hover:bg-muted/90"
      >
        <DropdownMenuItem
          asChild
          className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-200 dark:hover:bg-black/10 focus:bg-transparent dark:focus:bg-black/10 focus:text-black"
        >
          <Link href="/account">
            <div className="flex gap-2">
              <Avatar className="size-12">
                <AvatarFallback className="bg-accent text-white font-medium">
                  {getInitials(user?.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-black dark:text-white">
                  {user?.name}
                </span>
                <span className="text-xs font-thin text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="rounded-sm p-2 hover:bg-green-900/20 hover:text-black transition-colors bg-green-950/10">
              <span>Ver Perfil</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          asChild
          className="cursor-pointer p-4 transition-colors   focus:bg-black/5 dark:focus:bg-black/10 focus:text-black "
        >
          <a href="/account" className="text-black flex gap-4">
            <Settings className="size-7 text-accent " />
            <div>
              <h1 className="font-bold">Minha conta</h1>
              <span className="text-accent/90 font-normal text-xs">
                Gerencie dados e preferências
              </span>
            </div>
          </a>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          asChild
          className="cursor-pointer p-4 transition-colors  focus:bg-black/5 dark:focus:bg-black/10 text-red-500 focus:text-red-500"
        >
          <a href="/api/auth/sign-out" className="text-black ">
            <LogOut className="size-7 text-red-500" />
            <span className="font-bold">Sair da conta</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
