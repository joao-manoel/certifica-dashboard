'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useMenu } from '@/context/menu-context'
import { cn } from '@/lib/utils'

import { externalNavigation, primaryNavigation } from './navigation-items'

function isCurrent(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export default function NavBar({ isAdmin }: { isAdmin: boolean }) {
  const { isOpen } = useMenu()
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:block',
        isOpen ? 'w-64' : 'w-18'
      )}
      aria-label="Navegação principal"
    >
      <nav className="flex h-full flex-col justify-between p-3">
        <div className="space-y-1">
          {primaryNavigation.filter((item) => !('adminOnly' in item) || !item.adminOnly || isAdmin).map((item) => {
            const active = isCurrent(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                title={!isOpen ? item.label : undefined}
                className={cn(
                  'flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors',
                  isOpen ? 'gap-3' : 'justify-center',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="size-5 shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1 border-t border-sidebar-border pt-3">
          {externalNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={!isOpen ? item.label : undefined}
                className={cn(
                  'flex min-h-10 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-foreground',
                  isOpen ? 'gap-3' : 'justify-center'
                )}
              >
                <Icon className="size-5 shrink-0" />
                {isOpen && (
                  <>
                    <span>{item.label}</span>
                    <ArrowUpRight className="ms-auto size-4" />
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
