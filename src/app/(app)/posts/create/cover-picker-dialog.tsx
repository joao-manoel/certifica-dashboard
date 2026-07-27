'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'

import { createMediaFromUrlAction } from '@/actions/create-media-action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { listMedia, type MediaItem } from '@/http/list-media'
import {
  ALLOWED_MEDIA_TYPES,
  getUploadMediaError,
  MAX_MEDIA_FILE_SIZE,
  uploadMedia
} from '@/http/upload-media'
import { cn } from '@/lib/utils'

type CoverPickerDialogProps = {
  value?: string | null
  onChange: (url: string | null, id?: string | null) => void
  trigger?: React.ReactNode
}

type Selected = { id: string | null; url: string | null }
type Tab = 'gallery' | 'url' | 'upload'

export function CoverPickerDialog({
  value,
  onChange,
  trigger
}: CoverPickerDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<Tab>('gallery')
  const [selected, setSelected] = React.useState<Selected>({
    id: null,
    url: value ?? null
  })
  const [url, setUrl] = React.useState(value ?? '')
  const [urlAlt, setUrlAlt] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = React.useState('')
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['media', { page: 1, perPage: 12 }],
    queryFn: () => listMedia({ page: 1, perPage: 12 }),
    enabled: open && tab === 'gallery'
  })

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  React.useEffect(() => {
    if (open) {
      setSelected({ id: null, url: value ?? null })
      setUrl(value ?? '')
      setSubmitError(null)
    }
  }, [open, value])

  const items: MediaItem[] = data?.items ?? []

  function selectFile(nextFile: File | null) {
    setSubmitError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFile(null)

    if (!nextFile) return
    if (
      !ALLOWED_MEDIA_TYPES.includes(
        nextFile.type as (typeof ALLOWED_MEDIA_TYPES)[number]
      )
    ) {
      setSubmitError('Use uma imagem JPEG, PNG ou WebP.')
      return
    }
    if (nextFile.size > MAX_MEDIA_FILE_SIZE) {
      setSubmitError('A imagem deve ter no máximo 25 MB.')
      return
    }
    if (nextFile.size === 0) {
      setSubmitError('O arquivo selecionado está vazio.')
      return
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  function clearFile() {
    selectFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function clear() {
    clearFile()
    setSelected({ id: null, url: null })
    setUrl('')
    setUrlAlt('')
    setUploadAlt('')
    onChange(null, null)
    setOpen(false)
  }

  async function confirm() {
    setSubmitError(null)

    if (tab === 'gallery') {
      onChange(selected.url, selected.id)
      setOpen(false)
      return
    }

    setSubmitting(true)
    try {
      if (tab === 'url') {
        const formData = new FormData()
        formData.set('url', url.trim())
        if (urlAlt.trim()) formData.set('alt', urlAlt.trim())

        const result = await createMediaFromUrlAction(formData)
        if (!result.success || !result.object) {
          setSubmitError(result.message ?? 'Falha ao criar a mídia.')
          return
        }

        await queryClient.invalidateQueries({ queryKey: ['media'] })
        onChange(result.object.url, result.object.id)
      } else if (file) {
        const created = await uploadMedia(file, uploadAlt)
        await queryClient.invalidateQueries({ queryKey: ['media'] })
        onChange(created.url, created.id)
      }

      setOpen(false)
      clearFile()
    } catch (error) {
      setSubmitError(await getUploadMediaError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submitting) return
        if (!nextOpen) {
          clearFile()
          setUploadAlt('')
          setDragging(false)
        }
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? <Button variant="secondary">Selecionar capa</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar imagem de capa</DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(nextTab) => {
            setTab(nextTab as Tab)
            setSubmitError(null)
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="url">Usar URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-4">
            {isLoading || isFetching ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma imagem encontrada.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((item) => {
                  const active =
                    selected.id === item.id || selected.url === item.url
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSelected({ id: item.id, url: item.url })
                      }
                      className={cn(
                        'relative aspect-video overflow-hidden rounded-md border transition hover:ring-2 hover:ring-primary',
                        active && 'ring-2 ring-primary'
                      )}
                      title={item.alt ?? undefined}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt ?? 'Imagem da galeria'}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 50vw"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="media-url">URL da imagem</Label>
                <Input
                  id="media-url"
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url-alt">Texto alternativo</Label>
                <Input
                  id="url-alt"
                  maxLength={200}
                  value={urlAlt}
                  onChange={(event) => setUrlAlt(event.target.value)}
                  disabled={submitting}
                />
              </div>
              {url && (
                <div className="relative aspect-video overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={urlAlt || 'Prévia da imagem informada'}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="space-y-3">
              <Label
                htmlFor="media-file"
                className={cn(
                  'flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 text-center transition',
                  dragging && 'border-primary bg-primary/5',
                  submitting && 'pointer-events-none opacity-60'
                )}
                onDragEnter={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setDragging(false)
                  selectFile(event.dataTransfer.files[0] ?? null)
                }}
              >
                <Upload className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Clique ou arraste uma imagem
                </span>
                <span className="text-xs text-muted-foreground">
                  JPEG, PNG ou WebP, até 25 MB
                </span>
              </Label>
              <Input
                ref={fileInputRef}
                id="media-file"
                type="file"
                className="sr-only"
                accept={ALLOWED_MEDIA_TYPES.join(',')}
                onChange={(event) =>
                  selectFile(event.target.files?.[0] ?? null)
                }
                disabled={submitting}
              />

              {file && previewUrl && (
                <div className="space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={uploadAlt || 'Prévia da imagem selecionada'}
                      className="h-full w-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={clearFile}
                      disabled={submitting}
                      aria-label="Remover arquivo selecionado"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="upload-alt">Texto alternativo</Label>
                <Input
                  id="upload-alt"
                  maxLength={200}
                  placeholder="Descrição breve da imagem"
                  value={uploadAlt}
                  onChange={(event) => setUploadAlt(event.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {submitError && (
          <p role="alert" className="text-sm text-destructive">
            {submitError}
          </p>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={clear}
            disabled={submitting}
          >
            Remover capa
          </Button>
          <Button
            type="button"
            onClick={confirm}
            disabled={
              submitting ||
              (tab === 'gallery' && !selected.id) ||
              (tab === 'url' && !url.trim()) ||
              (tab === 'upload' && !file)
            }
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Enviando...
              </>
            ) : tab === 'upload' ? (
              <>
                <ImagePlus />
                Enviar e usar
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
