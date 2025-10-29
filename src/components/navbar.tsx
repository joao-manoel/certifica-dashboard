'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useMemo, type JSX } from 'react'
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  Users,
  PlusCircle,
  List,
  Globe,
  ArrowUpRight
} from 'lucide-react'
import { useMenu } from '@/context/menu-context'

type SubItem = {
  label: string
  href: string
  icon: JSX.Element // ícone opcional para subitem
}

type MenuItem = {
  label: string
  href?: string // opcional quando tiver children
  icon: JSX.Element
  children?: SubItem[] // define submenu
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="size-5 text-gray-400" />
  },
  {
    label: 'Blog',
    icon: <FileText className="size-5 text-gray-400" />,
    href: '/blog'
  },
  {
    label: 'Usuários',
    icon: <Users className="size-5 text-gray-400" />,
    href: '/users'
  }
]

const footerItems = [
  {
    label: 'Certifica Site',
    href: 'https://certifica.eng.br',
    leftIcon: <Globe className="size-5 text-gray-400" />,
    rightIcon: <ArrowUpRight className="size-4 text-gray-400" />
  }
] as const

export default function NavBar() {
  const { isOpen } = useMenu()
  const pathname = usePathname()

  // controla quais grupos estão abertos
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  // abre automaticamente o grupo se a rota atual está dentro dele
  useMemo(() => {
    const initial: Record<string, boolean> = {}
    for (const item of menuItems) {
      if (!item.children) continue
      initial[item.label] = item.children.some((c) =>
        pathname.startsWith(c.href)
      )
    }
    setOpenMap((prev) => ({ ...initial, ...prev }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // roda uma vez

  function toggle(label: string) {
    setOpenMap((m) => ({ ...m, [label]: !m[label] }))
  }

  return (
    <aside
      className={`${isOpen ? 'w-80' : 'w-20'} transition-all duration-200`}
    >
      <nav className="flex h-[calc(100vh-81px)] w-full flex-col border-r justify-between ">
        <div className="flex flex-col p-3">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.label} className="mb-1">
                {/* Cabeçalho do grupo com arrow */}
                <button
                  type="button"
                  onClick={() => (isOpen ? toggle(item.label) : undefined)}
                  className={`flex w-full items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-black/20
                  ${isOpen ? 'justify-between' : 'justify-center'}`}
                  aria-expanded={!!openMap[item.label]}
                  aria-controls={`submenu-${item.label}`}
                >
                  <div
                    className={`flex items-center ${
                      isOpen ? '' : 'justify-center'
                    }`}
                  >
                    {item.icon}
                    <span
                      className={`ml-2 text-sm font-medium text-gray-800
                    ${isOpen ? 'inline' : 'hidden'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {/* seta só quando aberto */}
                  <ChevronDown
                    className={`size-4 text-gray-400 transition-transform
                  ${
                    isOpen
                      ? openMap[item.label]
                        ? 'rotate-180'
                        : 'rotate-0'
                      : 'hidden'
                  }`}
                  />
                </button>

                {/* Submenu (expande só se sidebar aberta) */}
                <div
                  id={`submenu-${item.label}`}
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200
                ${
                  isOpen
                    ? openMap[item.label]
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                    : 'hidden'
                }`}
                >
                  <div className="min-h-0">
                    {item.children.map((sub) => {
                      const isActive =
                        pathname === sub.href ||
                        pathname.startsWith(sub.href + '/')
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`mt-1 ml-9 flex items-center gap-2 rounded-md p-2 text-sm transition-colors
                          hover:bg-gray-100 dark:hover:bg-black/20
                          ${
                            isActive
                              ? 'bg-gray-100 dark:bg-black/20 font-medium'
                              : ''
                          }`}
                        >
                          {/* bullets/mini ícones opcionais */}
                          {item.icon}
                          <span>{sub.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className={`mb-1 flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-black/20
                ${isOpen ? 'justify-start' : 'justify-center'}`}
              >
                {item.icon}
                <span
                  className={`ml-2 text-sm font-medium text-gray-800
                ${isOpen ? 'inline' : 'hidden'}`}
                >
                  {item.label}
                </span>
              </Link>
            )
          )}
        </div>

        <div className="flex flex-col p-3">
          {footerItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} (abre em nova aba)`}
              title={`${item.label} (abre em nova aba)`}
              className={`flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-black/20
                ${isOpen ? 'justify-between' : 'justify-center'}`}
            >
              <div className="flex items-center">
                {item.leftIcon}
                <span
                  className={`ml-2 text-sm font-medium text-gray-800 ${
                    isOpen ? 'inline' : 'hidden'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <span className={`${isOpen ? 'inline-flex' : 'hidden'}`}>
                {item.rightIcon}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  )
}
