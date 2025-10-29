import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import NavBar from '@/components/navbar'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }

  return (
    // 1) trava scroll da página e define a altura útil (descontando o header de 81px)
    <div className="h-[calc(100vh-81px)] overflow-hidden">
      {/* 2) propaga altura e permite encolher (min-h-0) */}
      <div className="flex h-full min-h-0">
        <NavBar />

        {/* 3) área de conteúdo que pode encolher e rolar */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="container-wrapper">
              <div className="container p-4 m-auto mt-2">{children}</div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
