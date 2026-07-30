import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/format'
import { getUserAvatarURL } from '@/utils/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
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
      <DropdownMenuTrigger className="flex min-h-10 items-center gap-2 rounded-lg px-2 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={user?.username ? getUserAvatarURL(user?.username) : ''}
              alt={`@${user?.username}`}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitials(user?.name || '')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col text-start sm:flex">
            <span className="max-w-36 truncate text-sm font-medium text-foreground">
              {user?.name}
            </span>
            <span className="max-w-36 truncate text-xs text-muted-foreground">
              @{user?.username}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuItem
          asChild
          className="cursor-default p-3 focus:bg-transparent"
        >
          <div className="flex w-full items-center gap-3">
            <div className="flex gap-2">
              <Avatar className="size-10">
                <AvatarImage
                  src={user?.username ? getUserAvatarURL(user?.username) : ''}
                  alt={`@${user?.username}`}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {getInitials(user?.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{user?.username}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem asChild className="cursor-pointer p-3">
          <Link href="/settings" className="flex gap-3 text-foreground">
            <Settings className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Minha conta</p>
              <span className="text-xs text-muted-foreground">
                Gerencie dados e preferências
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          asChild
          variant="destructive"
          className="cursor-pointer p-3"
        >
          <a href="/api/auth/sign-out" className="flex gap-3">
            <LogOut className="size-5" />
            <span className="text-sm font-medium">Sair da conta</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
