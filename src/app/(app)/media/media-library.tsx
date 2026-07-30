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
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const q = searchParams.get('q') ?? ''
  const source = (searchParams.get('source') ?? 'all') as
    'all' | 'EXTERNAL' | 'S3'
  const [search, setSearch] = useState(q)
  const [createOpen, setCreateOpen] = useState(false)

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
              <MediaCard key={item.id} item={item} />
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
    </div>
  )
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <Card className="group overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link
        href={`/media/${item.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Gerenciar ${item.title || item.alt || 'imagem'}`}
      >
        <Image
          src={item.url}
          alt={item.alt || item.title || 'Imagem da biblioteca'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-3 bottom-3 flex justify-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Badge className="shadow-sm">Abrir detalhes</Badge>
        </div>
      </Link>
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
        <Button asChild variant="outline" className="w-full">
          <Link href={`/media/${item.id}`}>
            <Pencil className="size-4" />
            Gerenciar
          </Link>
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

export function MediaEditor({
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
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
      <div className="space-y-6">
        <Card className="overflow-hidden pt-0">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[linear-gradient(45deg,var(--muted)_25%,transparent_25%),linear-gradient(-45deg,var(--muted)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,var(--muted)_75%),linear-gradient(-45deg,transparent_75%,var(--muted)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] sm:min-h-[500px]">
            <div
              className="relative size-full min-h-[360px] transition-transform sm:min-h-[500px]"
              style={{
                transform: `rotate(${rotate}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`
              }}
            >
              <Image
                src={media.url}
                alt={media.alt || 'Prévia da mídia'}
                fill
                sizes="(max-width: 1280px) 100vw, 65vw"
                className="object-contain p-4"
              />
            </div>
          </div>
          <CardFooter className="flex flex-col items-stretch gap-4 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium">
                {media.originalFilename || media.title || 'Imagem'}
              </p>
              <p className="text-muted-foreground">
                {media.width ?? '—'} × {media.height ?? '—'} px ·{' '}
                {formatBytes(media.fileSizeBytes)} ·{' '}
                {media.mimeType ?? 'tipo desconhecido'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(media.url)
                  toast.success('URL copiada.')
                }}
              >
                <Copy className="size-4" /> Copiar URL
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={media.url} target="_blank">
                  <ExternalLink className="size-4" /> Abrir original
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {media.canEditImage && (
          <Card>
            <CardHeader>
              <CardTitle>Editar arquivo</CardTitle>
              <p className="text-sm text-muted-foreground">
                Substitua, gire, espelhe ou recorte a imagem. Uma nova versão
                será criada e os locais que já usam esta mídia continuarão
                funcionando.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="media-version-file">
                  Substituir arquivo (opcional)
                </Label>
                <Input
                  id="media-version-file"
                  type="file"
                  accept={ALLOWED_MEDIA_TYPES.join(',')}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ajustes rápidos</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={rotate ? 'secondary' : 'outline'}
                    onClick={() => setRotate((value) => (value + 90) % 360)}
                  >
                    <RotateCw className="size-4" /> Girar 90°
                  </Button>
                  <Button
                    type="button"
                    variant={flipHorizontal ? 'secondary' : 'outline'}
                    onClick={() => setFlipHorizontal((value) => !value)}
                  >
                    Espelhar horizontal
                  </Button>
                  <Button
                    type="button"
                    variant={flipVertical ? 'secondary' : 'outline'}
                    onClick={() => setFlipVertical((value) => !value)}
                  >
                    Espelhar vertical
                  </Button>
                </div>
                {(rotate !== 0 || flipHorizontal || flipVertical) && (
                  <p className="text-xs text-muted-foreground">
                    Prévia: rotação {rotate}°
                    {flipHorizontal ? ' · espelhada horizontalmente' : ''}
                    {flipVertical ? ' · espelhada verticalmente' : ''}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <Label>Recorte em pixels (opcional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Preencha os quatro valores somente se precisar de um recorte
                    preciso.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      ['left', 'Esquerda'],
                      ['top', 'Topo'],
                      ['width', 'Largura'],
                      ['height', 'Altura']
                    ] as const
                  ).map(([field, label]) => (
                    <div key={field} className="space-y-1.5">
                      <Label htmlFor={`crop-${field}`} className="text-xs">
                        {label}
                      </Label>
                      <Input
                        id={`crop-${field}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={crop[field]}
                        onChange={(event) =>
                          setCrop((current) => ({
                            ...current,
                            [field]: event.target.value
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start justify-between gap-3 border-t sm:flex-row sm:items-center">
              <p className="text-xs text-muted-foreground">
                A versão anterior permanece no histórico.
              </p>
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
                {pending && <Loader2 className="size-4 animate-spin" />}
                Criar nova versão
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <div className="space-y-6 xl:sticky xl:top-20">
        <Card>
          <CardHeader>
            <CardTitle>Informações da mídia</CardTitle>
            <p className="text-sm text-muted-foreground">
              Estes dados ajudam na organização, acessibilidade e atribuição da
              imagem.
            </p>
          </CardHeader>
          <form onSubmit={saveMetadata}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="media-title">Título</Label>
                <Input
                  id="media-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Nome interno da imagem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media-alt">Texto alternativo</Label>
                <Textarea
                  id="media-alt"
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  placeholder="Descreva o conteúdo visual para leitores de tela"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media-caption">Legenda</Label>
                <Textarea
                  id="media-caption"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Texto exibido junto à imagem"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media-credit">Crédito</Label>
                <Input
                  id="media-credit"
                  value={credit}
                  onChange={(event) => setCredit(event.target.value)}
                  placeholder="Autor ou fonte"
                />
              </div>
              {media.source === 'EXTERNAL' && (
                <div className="space-y-2">
                  <Label htmlFor="media-url">URL externa</Label>
                  <Input
                    id="media-url"
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end border-t">
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                Salvar informações
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso da imagem</CardTitle>
            <p className="text-sm text-muted-foreground">
              {media.usageCount === 0
                ? 'Esta mídia ainda não está vinculada a uma publicação.'
                : `Utilizada em ${media.usageCount} local(is), sendo ${media.coverUsageCount} como capa e ${media.bodyUsageCount} no conteúdo.`}
            </p>
          </CardHeader>
          {media.usages.length > 0 && (
            <CardContent className="space-y-2">
              {media.usages.map((usage) => (
                <Link
                  key={`${usage.id}-${usage.kind}`}
                  href={`/posts/edit/${usage.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                >
                  <span className="line-clamp-2 font-medium">
                    {usage.title}
                  </span>
                  <Badge variant="outline">
                    {usage.kind === 'cover' ? 'Capa' : 'Conteúdo'}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de versões</CardTitle>
            <p className="text-sm text-muted-foreground">
              {media.versions.length} versão(ões) armazenada(s).
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {media.versions.map((version) => (
              <Link
                key={version.id}
                href={version.url}
                target="_blank"
                className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
              >
                <span>
                  {new Intl.DateTimeFormat('pt-BR').format(
                    new Date(version.createdAt)
                  )}
                  <span className="block text-xs text-muted-foreground">
                    {version.width} × {version.height} ·{' '}
                    {formatBytes(version.fileSizeBytes)}
                  </span>
                </span>
                {version.isCurrent ? (
                  <Badge>Atual</Badge>
                ) : (
                  <ExternalLink className="size-4 text-muted-foreground" />
                )}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
