'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/react-query'
import { MenuProvider } from '@/context/menu-context'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>{children}</MenuProvider>
      <Toaster richColors />
    </QueryClientProvider>
  )
}
