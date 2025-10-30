'use client'

import { useRef, useCallback } from 'react'
import { useFormState } from '@/hooks/use-form-state'
import { createPostAction } from '@/actions/create-post-action'

import Link from 'next/link'
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

export function CreatePostForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createPostAction)

  // refs para editor e para o hidden input 'content'
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const contentInputRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // 1) capturar HTML do Tiny
      const html = editorRef.current?.getContent({ format: 'html' }) ?? ''

      // 2) empacotar no JSON que o backend aceita no campo Json
      const asJson = JSON.stringify({
        format: 'html',
        html,
        // opcional: metadados úteis
        version: 1
      })

      // 3) gravar no hidden antes de enviar
      if (contentInputRef.current) {
        contentInputRef.current.value = asJson
      } else {
        // fallback: cria on-the-fly se o hidden não existir
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = 'content'
        hidden.value = asJson
        e.currentTarget.appendChild(hidden)
        contentInputRef.current = hidden
      }

      // (Opcional) Se status !== SCHEDULED, limpar scheduledFor
      // const formData = new FormData(e.currentTarget)
      // const status = formData.get('status')
      // if (status !== 'SCHEDULED') {
      //   const input = e.currentTarget.querySelector<HTMLInputElement>('#scheduledFor')
      //   if (input) input.value = ''
      // }

      // 4) delegar para seu handleSubmit
      handleSubmit(e)
    },
    [handleSubmit]
  )

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/post">
          <Button type="button" variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Post</h1>
          <p className="text-muted-foreground">Crie um novo post para o blog</p>
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
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (opcional)</Label>
                <Input id="slug" name="slug" placeholder="meu-slug-opcional" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  maxLength={300}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Máx. 300 caracteres.
                </p>
              </div>

              {/* Hidden que receberá o JSON do TinyMCE */}
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
                    // Escolha plugins comedidos; deixe premiums se realmente usar
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
                      // premium de teste (opcional)
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
                    // UX
                    placeholder: 'Escreva seu texto…',
                    branding: false,
                    statusbar: true,
                    // conteúdo clean
                    block_unsupported_drop: true,
                    // evitar inline styles agressivos
                    content_style:
                      'body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; font-size: 16px; } ' +
                      'img { max-width: 100%; height: auto; }'
                  }}
                  initialValue=""
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
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue="DRAFT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Rascunho</SelectItem>
                    <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibilidade</Label>
                <Select name="visibility" defaultValue="PUBLIC">
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

              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Agendar (se SCHEDULED)</Label>
                <Input
                  id="scheduledFor"
                  name="scheduledFor"
                  type="datetime-local"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverId">Cover ID</Label>
                <Input id="coverId" name="coverId" placeholder="opcional" />
              </div>

              <ChipsInput label="Categorias" name="categoryNames" />
              <ChipsInput label="Tags" name="tagNames" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Post'}
              </Button>

              {message && <p className="text-sm text-center">{message}</p>}
              {!!errors && (
                <pre className="text-xs text-red-500 whitespace-pre-wrap">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
