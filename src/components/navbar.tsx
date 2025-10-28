'use client'
import { CreditCard, HomeIcon } from 'lucide-react'
import Link from 'next/link'

import { useMenu } from '@/context/menu-context'

const menuItems = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className="size-5 text-gray-400" />
  },
  {
    label: 'Blog',
    href: '/cards',
    icon: <CreditCard className="size-5 text-gray-400" />
  }
]

export default function NavBar() {
  const { isOpen } = useMenu()
  return (
    <div className={` ${isOpen ? 'w-80 md:w-80 lg:w-80 xl:w-80' : 'w-30'}`}>
      <nav className="flex h-full w-full flex-col border-r p-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2 rounded-md p-2 pb-4 pt-4 transition-colors hover:bg-gray-100 dark:hover:bg-black/20 ${
              isOpen ? 'justify-center lg:justify-start' : 'justify-center'
            }`}
          >
            {item.icon}
            <span
              className={`text-bold ml-2 font-normal text-gray-400 ${
                isOpen ? 'hidden lg:block' : 'hidden'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
