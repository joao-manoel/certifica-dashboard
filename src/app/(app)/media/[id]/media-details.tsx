'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { DeleteDialog } from '@/components/delete-dialog'
import { PageHeader } from '@/components/page-header'
import { ErrorState, PageLoading } from '@/components/page-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { deleteMedia, getMediaDetails } from '@/http/manage-media'

import { MediaEditor } from '../media-library'

export function MediaDetails({ id }: { id: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const details = useQuery({
    queryKey: ['media', id],
    queryFn: () => getMediaDetails(id)
  })

  async function remove() {
    if (!details.data?.canDelete) return
    setDeleting(true)
    try {
      await deleteMedia(id)
      await queryClient.invalidateQueries({ queryKey: ['media'] })
      toast.success('Mídia excluída.')
      router.push('/media')
    } catch {
      toast.error('Não foi possível excluir a mídia.')
      setDeleting(false)
    }
  }

  if (details.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Carregando mídia…"
          description="Buscando arquivo, informações e histórico."
        />
        <PageLoading cards={3} />
      </div>
    )
  }

  if (details.isError || !details.data) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" className="-ml-3">
          <Link href="/media">
            <ArrowLeft className="size-4" />
            Voltar para a biblioteca
          </Link>
        </Button>
        <ErrorState
          title="Não foi possível carregar esta mídia"
          description="O arquivo pode não existir mais ou a conexão com a API falhou."
          onRetry={() => void details.refetch()}
        />
      </div>
    )
  }

  const media = details.data

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/media">
          <ArrowLeft className="size-4" />
          Voltar para a biblioteca
        </Link>
      </Button>

      <PageHeader
        title={media.title || media.alt || media.originalFilename || 'Mídia'}
        description="Gerencie o arquivo, os dados de acessibilidade e os locais onde a imagem é utilizada."
        action={
          <>
            <Badge variant="secondary" className="h-9 px-3">
              {media.source === 'S3' ? 'Hospedada' : 'Link externo'}
            </Badge>
            <Button
              variant="outline"
              onClick={() => void details.refetch()}
              disabled={details.isFetching}
            >
              {details.isFetching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Atualizar
            </Button>
            {media.canDelete && (
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" />
                Excluir
              </Button>
            )}
          </>
        }
      />

      <MediaEditor
        key={media.updatedAt}
        media={media}
        onSaved={async () => {
          await Promise.all([
            details.refetch(),
            queryClient.invalidateQueries({ queryKey: ['media'] })
          ])
        }}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void remove()}
        isPending={deleting}
        title="Excluir mídia?"
        description="A mídia e todas as versões serão excluídas. Esta ação pode quebrar links externos que apontam diretamente para o arquivo."
      />
    </div>
  )
}
