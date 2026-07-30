import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import Logo from '@/components/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await isAuthenticated()) {
    redirect('/')
  }
  return (
    <div className="relative min-h-dvh bg-muted/30">
      <header className="absolute inset-x-0 top-0 flex h-16 items-center justify-between px-4 sm:px-8">
        <Logo size="sm" />
        <ThemeSwitcher />
      </header>
      {children}
    </div>
  )
}
