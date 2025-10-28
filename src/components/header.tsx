import Link from 'next/link'

import { isAuthenticated } from '@/auth/auth'

import CollapseMenuButton from './collapse-menu-button'
import ProfileButton from './profile-button'
import Logo from './logo'
export default async function Header() {
  const isAuth = await isAuthenticated()

  return (
    <header className="sticky z-50 flex items-center justify-between border-b p-4 dark:bg-[#171716]">
      <div className="flex items-center gap-4">
        <CollapseMenuButton />
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuth && <ProfileButton />}
      </div>
    </header>
  )
}
