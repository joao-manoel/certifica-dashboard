'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { listMedia, type MediaItem } from '@/http/list-media'
import { createMediaFromUrlAction } from '@/actions/create-media-action'

type CoverPickerDialogProps = {
  /** URL atual (opcional) */
  value?: string | null
  /**
   * Agora aceita (url, id?)
   * - Em "Galeria": retorna o par do item selecionado
   * - Em "URL": cria a mídia no Confirm e retorna o par criado
   */
  onChange: (url: string | null, id?: string | null) => void
  trigger?: React.ReactNode
}

type Selected = { id: string | null; url: string | null }

export function CoverPickerDialog({
  value,
  onChange,
  trigger
}: CoverPickerDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<'gallery' | 'url'>('gallery')

  // Seleção atual (guarda id+url)
  const [selected, setSelected] = React.useState<Selected>({
    id: null,
    url: value ?? null
  })

  // Campos da aba URL
  const [url, setUrl] = React.useState(value ?? '')
  const [alt, setAlt] = React.useState('')

  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['media', { page: 1, perPage: 12 }],
    queryFn: () => listMedia({ page: 1, perPage: 12 }),
    enabled: open && tab === 'gallery'
  })

  const items: MediaItem[] = data?.items ?? []

  function pickFromGallery(item: MediaItem) {
    setSelected({ id: item.id, url: item.url })
  }

  async function confirm() {
    setSubmitError(null)

    // Caso 1: Confirm na galeria -> já temos id+url
    if (tab === 'gallery') {
      onChange(selected.url ?? null, selected.id ?? null)
      setOpen(false)
      return
    }

    // Caso 2: Confirm na aba URL -> cria a mídia e retorna id+url
    if (tab === 'url') {
      const trimmed = url.trim()
      if (!trimmed) return

      setSubmitting(true)
      try {
        const fd = new FormData()
        fd.set('url', trimmed)
        if (alt.trim()) fd.set('alt', alt.trim())

        const result = await createMediaFromUrlAction(fd)
        if (result.success && result.object) {
          // Opcional: atualizar cache da galeria
          await queryClient.invalidateQueries({ queryKey: ['media'] })

          // Retorna para o pai já com o par (url, id)
          onChange(result.object.url, result.object.id)
          setOpen(false)
        } else {
          setSubmitError(result.message ?? 'Falha ao criar a mídia.')
        }
      } catch (err) {
        console.error(err)
        setSubmitError('Erro inesperado ao criar a mídia.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  function clear() {
    setSelected({ id: null, url: null })
    setUrl('')
    setAlt('')
    onChange(null, null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="secondary">Selecionar capa</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar imagem de capa</DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'gallery' | 'url')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="url">Usar URL</TabsTrigger>
          </TabsList>

          {/* Galeria */}
          <TabsContent value="gallery" className="mt-4">
            {isLoading || isFetching ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma imagem encontrada.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item) => {
                  const active =
                    selected.id === item.id || selected.url === item.url
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pickFromGallery(item)}
                      className={cn(
                        'relative aspect-video rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition',
                        active ? 'ring-2 ring-primary' : ''
                      )}
                      title={item.alt || undefined}
                    >
                      <Image
                        src={item.url}
                        alt={item.alt ?? 'Cover'}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 50vw"
                      />
                      {item.dominantClr && (
                        <span
                          className="absolute right-1 bottom-1 h-4 w-4 rounded-full border"
                          title={item.dominantClr}
                          style={{ backgroundColor: item.dominantClr }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* URL -> cria mídia no Confirm */}
          <TabsContent value="url" className="mt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="url">URL da imagem</Label>
                <Input
                  id="url"
                  placeholder="https://…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Texto alternativo (alt)</Label>
                <Input
                  id="alt"
                  placeholder="Descrição breve da imagem"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </div>

              {url ? (
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="ghost" type="button" onClick={clear}>
            Remover capa
          </Button>
          <Button
            type="button"
            onClick={confirm}
            disabled={tab === 'gallery' ? !selected.url : !url || submitting}
          >
            {tab === 'url' && submitting ? 'Confirmando…' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
