'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { useFormState } from '@/hooks/use-form-state'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { ChipsInput } from '@/components/chips-input'

import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { CoverPickerDialog } from '@/app/(app)/posts/create/cover-picker-dialog'
import { editPostAction } from '@/actions/edit-post-action'

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

type Cover = { id: string; url: string }

type EditPostFormProps = {
  post: {
    id: string
    title: string
    excerpt: string | null
    content: unknown // { format: 'html', html: string, version: number } | outro formato seu
    coverId: string | null
    coverUrl?: string | null
    status: PostStatus
    visibility: Visibility
    scheduledFor: string | null // ISO
    categories?: { name: string }[]
    tags?: { name: string }[]
  }
}

function isoToDatetimeLocal(iso: string) {
  // transforma "2025-11-03T21:10:00.000Z" em "2025-11-03T18:10" (ajustado ao fuso do browser)
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    editPostAction.bind(null, post.id)
  )

  const editorRef = useRef<TinyMCEEditor | null>(null)
  const contentInputRef = useRef<HTMLInputElement | null>(null)

  const initialHtml =
    (post.content &&
      typeof post.content === 'object' &&
      (post.content as any).format === 'html' &&
      (post.content as any).html) ||
    ''

  const [status, setStatus] = useState<PostStatus>(post.status)
  const [cover, setCover] = useState<Cover | null>(
    post.coverId && post.coverUrl
      ? { id: post.coverId, url: post.coverUrl }
      : null
  )

  // Redireciona após sucesso
  useEffect(() => {
    if (success) {
      router.push('/posts')
    }
  }, [success, router])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const html = editorRef.current?.getContent({ format: 'html' }) ?? ''
      const asJson = JSON.stringify({ format: 'html', html, version: 1 })

      if (contentInputRef.current) {
        contentInputRef.current.value = asJson
      } else {
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = 'content'
        hidden.value = asJson
        e.currentTarget.appendChild(hidden)
        contentInputRef.current = hidden
      }

      // envia coverId (opcional)
      if (cover?.id) {
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = 'coverId'
        hidden.value = cover.id
        e.currentTarget.appendChild(hidden)
      }

      handleSubmit(e)
    },
    [handleSubmit, cover]
  )

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-live="polite">
      <div className="flex items-center gap-4">
        <Link href="/posts">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Post</h1>
          <p className="text-muted-foreground">Atualize o conteúdo do post</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post.title}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  maxLength={300}
                  required
                  disabled={isPending}
                  defaultValue={post.excerpt ?? ''}
                />
                <p className="text-xs text-muted-foreground">
                  Máx. 300 caracteres.
                </p>
              </div>

              {/* hidden content */}
              <input ref={contentInputRef} type="hidden" name="content" />

              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Editor
                  apiKey="gvivvvi7xjncbwzkuxvfq7pnts47bdem1n3gjvrfazfvu2vh"
                  onInit={(_, editor) => {
                    editorRef.current = editor
                  }}
                  init={{
                    height: 520,
                    menubar: false,
                    plugins: [
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'table',
                      'codesample',
                      'charmap',
                      'searchreplace',
                      'visualblocks',
                      'wordcount',
                      'emoticons',
                      'checklist',
                      'advtable',
                      'advcode',
                      'typography',
                      'markdown'
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic underline strikethrough | ' +
                      'alignleft aligncenter alignright alignjustify | ' +
                      'bullist numlist checklist outdent indent | ' +
                      'link image table codesample | removeformat',
                    placeholder: 'Edite seu texto…',
                    branding: false,
                    statusbar: true,
                    block_unsupported_drop: true,
                    content_style:
                      'body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; font-size: 16px; } ' +
                      'img { max-width: 100%; height: auto; }'
                  }}
                  initialValue={initialHtml}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    name="status"
                    defaultValue={post.status}
                    disabled={isPending}
                    onValueChange={(v) => setStatus(v as PostStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Rascunho</SelectItem>
                      <SelectItem value="PUBLISHED">Publicado</SelectItem>
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === 'SCHEDULED' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Agendar para</Label>
                    <Input
                      id="scheduledFor"
                      name="scheduledFor"
                      type="datetime-local"
                      defaultValue={
                        post.scheduledFor
                          ? isoToDatetimeLocal(post.scheduledFor)
                          : ''
                      }
                      disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground">
                      Necessário quando o status for &quot;Agendado&quot;.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Visibilidade</Label>
                  <Select
                    name="visibility"
                    defaultValue={post.visibility}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Pública</SelectItem>
                      <SelectItem value="UNLISTED">Não listada</SelectItem>
                      <SelectItem value="PRIVATE">Privada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Capa</Label>
                {cover ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover.url}
                      alt="Capa"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-md border text-sm text-muted-foreground">
                    Nenhuma capa selecionada
                  </div>
                )}

                <div className="flex gap-2">
                  <CoverPickerDialog
                    value={cover?.url}
                    onChange={(url, id) =>
                      setCover(url && id ? { url, id } : null)
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isPending}
                      >
                        Selecionar capa
                      </Button>
                    }
                  />
                  {cover && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCover(null)}
                      disabled={isPending}
                    >
                      Remover
                    </Button>
                  )}
                </div>

                {/* hidden coverId é adicionado no submit, se houver */}
              </div>

              {/* Se seu ChipsInput aceitar valores iniciais, use as props adequadas.
                 Aqui usamos o mesmo padrão do create (sem valor inicial controlado). */}
              <ChipsInput
                label="Categorias"
                name="categoryNames"
                defaultValues={post.categories?.map((c) => c.name) ?? []}
              />

              <ChipsInput
                label="Tags"
                name="tagNames"
                defaultValues={post.tags?.map((t) => t.name) ?? []}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              {message && (
                <p
                  className={`text-sm text-center ${
                    success ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </p>
              )}

              {!!errors && (
                <pre className="text-xs text-red-500 whitespace-pre-wrap">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
