import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import Header from '@/components/header'
import NavBar from '@/components/navbar'

export default async function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await auth()
  if (!user) {
    redirect('/sign-in')
  }
  if (user.mustChangePassword) {
    redirect('/change-password')
  }

  return (
    <div className="min-h-dvh bg-muted/20">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo principal
      </a>
      <Header isAdmin={user.role === 'ADMIN'} />
      <div className="flex min-h-[calc(100dvh-4rem)]">
        <NavBar isAdmin={user.role === 'ADMIN'} />
        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7"
        >
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
