import { ImageIcon } from 'lucide-react'
import { Suspense } from 'react'

import { auth } from '@/auth/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { listMedia } from '@/http/list-media'

import { MediaLibrary } from './media-library'

export default async function MediaPage() {
  const { user } = await auth()
  if (!user || user.role === 'USER') {
    return (
      <Alert variant="destructive">
        <ImageIcon />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Apenas administradores e editores podem gerenciar mídia.
        </AlertDescription>
      </Alert>
    )
  }

  const initialData = await listMedia({ page: 1, perPage: 20 })
  return (
    <Suspense
      fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}
    >
      <MediaLibrary initialData={initialData} />
    </Suspense>
  )
}
