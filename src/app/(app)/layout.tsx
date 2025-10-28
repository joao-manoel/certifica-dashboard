import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import NavBar from '@/components/navbar'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }
  return (
    <div className="h-screen">
      <div className="flex h-full">
        <NavBar />
        <div className="w-full overflow-scroll">
          <div className="container-wrapper">
            <div className="container p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
