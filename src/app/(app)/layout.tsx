import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import Header from '@/components/header'
import NavBar from '@/components/navbar'

export default async function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-dvh bg-muted/20">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ir para o conteúdo principal
      </a>
      <Header />
      <div className="flex min-h-[calc(100dvh-4rem)]">
        <NavBar />
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
