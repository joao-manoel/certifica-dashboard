'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const labels: Record<string, string> = {
  posts: 'Publicações',
  create: 'Nova publicação',
  edit: 'Editar',
  media: 'Mídia',
  users: 'Usuários',
  integrations: 'Integrações',
  settings: 'Configurações'
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return <span className="text-sm">Dashboard</span>

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-1 text-sm text-muted-foreground md:flex"
    >
      <Link href="/" className="hover:text-foreground">
        Dashboard
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const current = index === segments.length - 1
        const label =
          labels[segment] ?? (segment.length > 12 ? 'Detalhe' : segment)
        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" aria-hidden />
            {current ? (
              <span className="font-medium text-foreground" aria-current="page">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
