import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import NavBar from '@/components/navbar'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }
  return (
    <div className="h-[calc(100vh-81px)] ">
      <div className="flex ">
        <NavBar />
        <ScrollArea className="w-full">
          <div className="container-wrapper ">
            <div className="container p-4  m-auto mt-2">{children}</div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
