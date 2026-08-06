import Link from 'next/link'

import { Breadcrumbs } from './breadcrumbs'
import CollapseMenuButton from './collapse-menu-button'
import Logo from './logo'
import { MobileNavigation } from './mobile-navigation'
import ProfileButton from './profile-button'
import { ThemeSwitcher } from './theme-switcher'

export default async function Header({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-5">
      <div className="flex items-center gap-4">
        <MobileNavigation isAdmin={isAdmin} />
        <CollapseMenuButton />
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="hidden h-6 border-s md:block" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <ProfileButton />
      </div>
    </header>
  )
}
