'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Copy,
  ExternalLink,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Trash2,
  Upload
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { MediaDetails, MediaItem } from '@/@types/types-media'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { listMedia, type ListMediaResponse } from '@/http/list-media'
import {
  createExternalMedia,
  deleteMedia,
  getMediaDetails,
  transformMedia,
  updateMedia
} from '@/http/manage-media'
import {
  ALLOWED_MEDIA_TYPES,
  getUploadMediaError,
  MAX_MEDIA_FILE_SIZE,
  uploadMedia
} from '@/http/upload-media'

function formatBytes(value: number | null) {
  if (value === null) return '—'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

export function MediaLibrary({
  initialData
}: {
  initialData: ListMediaResponse
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const q = searchParams.get('q') ?? ''
  const source = (searchParams.get('source') ?? 'all') as
    'all' | 'EXTERNAL' | 'S3'
  const [search, setSearch] = useState(q)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['media', { page, q, source }],
    queryFn: () =>
      listMedia({
        page,
        perPage: 20,
        q: q || undefined,
        source: source === 'all' ? undefined : source
      }),
    initialData: page === 1 && !q && source === 'all' ? initialData : undefined
  })

  useEffect(() => {
    if (search.trim() === q) return
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search.trim()) params.set('q', search.trim())
      else params.delete('q')
      params.set('page', '1')
      router.replace(`/media?${params.toString()}`)
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [q, router, search, searchParams])

  function setParam(name: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(name, value)
    else params.delete(name)
    if (name !== 'page') params.set('page', '1')
    router.replace(`/media?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biblioteca de mídia"
        description="Hospede, edite e acompanhe as imagens usadas no blog."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Adicionar mídia
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por título, alt, crédito ou arquivo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={source}
          onValueChange={(value) => setParam('source', value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as origens</SelectItem>
            <SelectItem value="S3">Hospedadas</SelectItem>
            <SelectItem value="EXTERNAL">Links externos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <p>Não foi possível carregar a biblioteca.</p>
            <Button variant="outline" onClick={() => query.refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : query.data.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <ImageIcon className="size-10 text-muted-foreground" />
            <p className="font-medium">Nenhuma imagem encontrada</p>
            <p className="text-sm text-muted-foreground">
              Altere os filtros ou adicione uma nova mídia.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {query.data.items.map((item) => (
              <MediaCard key={item.id} item={item} onEdit={setSelectedId} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {query.data.meta.total} mídia(s)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setParam('page', String(page - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={page >= query.data.meta.totalPages}
                onClick={() => setParam('page', String(page + 1))}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      <CreateMediaDialog open={createOpen} onOpenChange={setCreateOpen} />
      <MediaEditorDialog
        id={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onChanged={() => queryClient.invalidateQueries({ queryKey: ['media'] })}
      />
    </div>
  )
}

function MediaCard({
  item,
  onEdit
}: {
  item: MediaItem
  onEdit: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden pt-0">
      <button
        type="button"
        className="relative aspect-[4/3] w-full bg-muted"
        onClick={() => onEdit(item.id)}
        aria-label={`Editar ${item.title || item.alt || 'imagem'}`}
      >
        <Image
          src={item.url}
          alt={item.alt || item.title || 'Imagem da biblioteca'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover"
        />
      </button>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base">
            {item.title || item.alt || item.originalFilename || 'Sem título'}
          </CardTitle>
          <Badge variant="secondary">
            {item.source === 'S3' ? 'Hospedada' : 'Externa'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-xs text-muted-foreground">
        <p>
          {item.width && item.height
            ? `${item.width} × ${item.height}`
            : 'Dimensões desconhecidas'}
        </p>
        <p>
          {formatBytes(item.fileSizeBytes)} · {item.usageCount ?? 0} uso(s)
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onEdit(item.id)}
        >
          <Pencil className="size-4" />
          Gerenciar
        </Button>
      </CardFooter>
    </Card>
  )
}

function CreateMediaDialog({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(type: 'upload' | 'url') {
    setPending(true)
    try {
      if (type === 'upload') {
        if (!file) return
        if (
          !ALLOWED_MEDIA_TYPES.includes(
            file.type as (typeof ALLOWED_MEDIA_TYPES)[number]
          )
        ) {
          throw new Error('Use uma imagem JPEG, PNG ou WebP.')
        }
        if (file.size > MAX_MEDIA_FILE_SIZE)
          throw new Error('A imagem deve ter no máximo 25 MB.')
        await uploadMedia(file, alt)
      } else {
        await createExternalMedia({ url, alt: alt || null })
      }
      await queryClient.invalidateQueries({ queryKey: ['media'] })
      toast.success('Mídia adicionada.')
      setFile(null)
      setUrl('')
      setAlt('')
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : await getUploadMediaError(error)
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar mídia</DialogTitle>
          <DialogDescription>
            Faça upload pela API ou cadastre um link externo.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL externa</TabsTrigger>
          </TabsList>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-media-alt">Texto alternativo</Label>
              <Input
                id="new-media-alt"
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
              />
            </div>
            <TabsContent value="upload" className="space-y-4">
              <Input
                type="file"
                accept={ALLOWED_MEDIA_TYPES.join(',')}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              <Button
                className="w-full"
                disabled={!file || pending}
                onClick={() => submit('upload')}
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Hospedar imagem
              </Button>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
              <Button
                className="w-full"
                disabled={!url || pending}
                onClick={() => submit('url')}
              >
                Adicionar link
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function MediaEditorDialog({
  id,
  onOpenChange,
  onChanged
}: {
  id: string | null
  onOpenChange: (open: boolean) => void
  onChanged: () => void
}) {
  const queryClient = useQueryClient()
  const details = useQuery({
    queryKey: ['media', id],
    queryFn: () => getMediaDetails(id!),
    enabled: Boolean(id)
  })

  async function remove() {
    if (!id || !details.data?.canDelete) return
    if (
      !window.confirm(
        'Excluir esta mídia e todas as versões? Links externos deixarão de funcionar.'
      )
    )
      return
    try {
      await deleteMedia(id)
      toast.success('Mídia excluída.')
      onChanged()
      onOpenChange(false)
    } catch {
      toast.error('Não foi possível excluir a mídia.')
    }
  }

  return (
    <Dialog open={Boolean(id)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar mídia</DialogTitle>
          <DialogDescription>
            Edite dados, arquivo e consulte onde a imagem é utilizada.
          </DialogDescription>
        </DialogHeader>
        {details.isPending ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : details.data ? (
          <MediaEditor
            key={details.data.updatedAt}
            media={details.data}
            onSaved={async () => {
              await queryClient.invalidateQueries({ queryKey: ['media'] })
              onChanged()
            }}
          />
        ) : (
          <p>Não foi possível carregar a mídia.</p>
        )}
        <DialogFooter className="justify-between sm:justify-between">
          <Button
            variant="destructive"
            disabled={!details.data?.canDelete}
            onClick={remove}
          >
            <Trash2 className="size-4" />
            Excluir
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MediaEditor({
  media,
  onSaved
}: {
  media: MediaDetails
  onSaved: () => Promise<void>
}) {
  const [title, setTitle] = useState(media.title ?? '')
  const [alt, setAlt] = useState(media.alt ?? '')
  const [caption, setCaption] = useState(media.caption ?? '')
  const [credit, setCredit] = useState(media.credit ?? '')
  const [url, setUrl] = useState(media.url)
  const [file, setFile] = useState<File | null>(null)
  const [rotate, setRotate] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)
  const [crop, setCrop] = useState({
    left: '',
    top: '',
    width: '',
    height: ''
  })
  const [pending, setPending] = useState(false)

  async function saveMetadata(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    try {
      await updateMedia(media.id, {
        title: title || null,
        alt: alt || null,
        caption: caption || null,
        credit: credit || null,
        ...(media.source === 'EXTERNAL' ? { url } : {})
      })
      await onSaved()
      toast.success('Dados atualizados.')
    } catch {
      toast.error('Não foi possível salvar os dados.')
    } finally {
      setPending(false)
    }
  }

  async function applyTransform() {
    setPending(true)
    try {
      const hasAnyCrop = Object.values(crop).some((value) => value !== '')
      const hasCrop = Object.values(crop).every((value) => value !== '')
      if (hasAnyCrop && !hasCrop) {
        throw new Error('Preencha os quatro campos do recorte.')
      }
      await transformMedia(media.id, {
        file,
        rotate,
        flipHorizontal,
        flipVertical,
        ...(hasCrop
          ? {
              cropLeft: Number(crop.left),
              cropTop: Number(crop.top),
              cropWidth: Number(crop.width),
              cropHeight: Number(crop.height)
            }
          : {})
      })
      await onSaved()
      setFile(null)
      setRotate(0)
      setFlipHorizontal(false)
      setFlipVertical(false)
      setCrop({ left: '', top: '', width: '', height: '' })
      toast.success('Nova versão criada sem quebrar as URLs anteriores.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível transformar a imagem.'
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image
            src={media.url}
            alt={media.alt || 'Prévia'}
            fill
            sizes="50vw"
            className="object-contain"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(media.url)}
          >
            <Copy className="size-4" /> Copiar URL
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={media.url} target="_blank">
              <ExternalLink className="size-4" /> Abrir
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <p>
            {media.width ?? '—'} × {media.height ?? '—'} ·{' '}
            {formatBytes(media.fileSizeBytes)}
          </p>
          <p>
            {media.mimeType ?? 'MIME desconhecido'} · {media.versions.length}{' '}
            versão(ões)
          </p>
        </div>
        {media.versions.length > 0 && (
          <div className="space-y-2">
            <Label>Histórico de versões</Label>
            {media.versions.map((version) => (
              <Link
                key={version.id}
                href={version.url}
                target="_blank"
                className="flex items-center justify-between rounded border p-2 text-xs hover:bg-muted"
              >
                <span>
                  {new Intl.DateTimeFormat('pt-BR').format(
                    new Date(version.createdAt)
                  )}{' '}
                  · {formatBytes(version.fileSizeBytes)}
                </span>
                {version.isCurrent && <Badge>Atual</Badge>}
              </Link>
            ))}
          </div>
        )}
        {media.usages.length > 0 && (
          <div className="space-y-2">
            <Label>Usada em {media.usageCount} local(is)</Label>
            {media.usages.map((usage) => (
              <Link
                key={`${usage.id}-${usage.kind}`}
                href={`/posts/edit/${usage.id}`}
                className="block rounded border p-2 text-sm hover:bg-muted"
              >
                {usage.title} · {usage.kind === 'cover' ? 'capa' : 'conteúdo'}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-6">
        <form className="space-y-3" onSubmit={saveMetadata}>
          <div>
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div>
            <Label>Texto alternativo</Label>
            <Input
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          </div>
          <div>
            <Label>Legenda</Label>
            <Textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
          <div>
            <Label>Crédito</Label>
            <Input
              value={credit}
              onChange={(event) => setCredit(event.target.value)}
            />
          </div>
          {media.source === 'EXTERNAL' && (
            <div>
              <Label>URL externa</Label>
              <Input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
          )}
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}Salvar dados
          </Button>
        </form>
        {media.canEditImage && (
          <div className="space-y-3 border-t pt-5">
            <Label>Nova versão da imagem</Label>
            <Input
              type="file"
              accept={ALLOWED_MEDIA_TYPES.join(',')}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRotate((value) => (value + 90) % 360)}
              >
                <RotateCw className="size-4" /> Girar {rotate}°
              </Button>
              <Button
                type="button"
                variant={flipHorizontal ? 'default' : 'outline'}
                onClick={() => setFlipHorizontal((value) => !value)}
              >
                Espelhar H
              </Button>
              <Button
                type="button"
                variant={flipVertical ? 'default' : 'outline'}
                onClick={() => setFlipVertical((value) => !value)}
              >
                Espelhar V
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Recorte opcional em pixels</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['left', 'Esquerda'],
                    ['top', 'Topo'],
                    ['width', 'Largura'],
                    ['height', 'Altura']
                  ] as const
                ).map(([field, label]) => (
                  <Input
                    key={field}
                    type="number"
                    min="0"
                    placeholder={label}
                    value={crop[field]}
                    onChange={(event) =>
                      setCrop((current) => ({
                        ...current,
                        [field]: event.target.value
                      }))
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Informe os quatro valores ou deixe todos vazios.
              </p>
            </div>
            <Button
              type="button"
              disabled={
                pending ||
                (!file &&
                  rotate === 0 &&
                  !flipHorizontal &&
                  !flipVertical &&
                  Object.values(crop).every((value) => value === ''))
              }
              onClick={applyTransform}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}Criar nova
              versão
            </Button>
            <p className="text-xs text-muted-foreground">
              A URL anterior continuará funcionando permanentemente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
