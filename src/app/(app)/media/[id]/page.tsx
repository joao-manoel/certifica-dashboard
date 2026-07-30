import { ImageIcon } from 'lucide-react'

import { auth } from '@/auth/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { MediaDetails } from './media-details'

export default async function MediaDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [{ user }, { id }] = await Promise.all([auth(), params])

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

  return <MediaDetails id={id} />
}
