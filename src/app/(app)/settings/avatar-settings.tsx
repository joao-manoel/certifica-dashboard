'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormState } from '@/hooks/use-form-state'
import { setAvatarAction } from '@/actions/set-avatar-action'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, ImagePlus, XCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { env } from '@/lib/env'

type Props = {
  user: { name: string | null; username: string }
  /** Layout: 'stack' (coluna) ou 'row' (linha). Default: row */
  orientation?: 'row' | 'stack'
}

const ACCEPTED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif'
] as const
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export default function AvatarSettings({ user, orientation = 'row' }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(setAvatarAction)

  const [version, setVersion] = useState<number>(() => Date.now())
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const buildAvatarUrl = useCallback(
    (v?: number | string) =>
      `/api/users/avatar/${encodeURIComponent(user.username)}.jpg${
        v ? `?v=${encodeURIComponent(String(v))}` : ''
      }`,
    [user.username]
  )

  useEffect(() => {
    setCurrentUrl(buildAvatarUrl(version))
  }, [buildAvatarUrl, version])

  useEffect(() => {
    if (success) {
      const v = Date.now()
      setVersion(v)
      setCurrentUrl(buildAvatarUrl(v))
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }, [success, buildAvatarUrl, previewUrl])

  const initials = useMemo(() => {
    const base = (user?.name || user?.username || '').trim()
    if (!base) return 'U'
    const [a, b] = base.split(/\s+/)
    return (a?.[0] || '') + (b?.[0] || '')
  }, [user])

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0]
    if (!f) return

    if (!ACCEPTED.includes(f.type as (typeof ACCEPTED)[number])) {
      alert('Formato inválido. Use JPEG, PNG, WEBP ou AVIF.')
      ev.currentTarget.value = ''
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      alert('Arquivo excede 5MB.')
      ev.currentTarget.value = ''
      return
    }

    const localUrl = URL.createObjectURL(f)
    setPreviewUrl(localUrl)

    formRef.current?.requestSubmit()
    ev.currentTarget.value = ''
  }

  return (
    <div
      className={clsx(
        'flex gap-6 items-center  w-full',
        orientation === 'stack' && 'flex'
      )}
    >
      {/* Avatar / Preview */}
      <div className="relative h-28 w-28 shrink-0">
        <div className="h-full w-full rounded-full border bg-muted/40 overflow-hidden grid place-items-center text-xl font-semibold">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={currentUrl}
              src={currentUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
              onError={() => setCurrentUrl(null)}
            />
          ) : (
            <span>{initials.substring(0, 2).toUpperCase()}</span>
          )}
        </div>
      </div>

      <div className="w-full">
        {!success && message && (
          <Alert className="mb-3 bg-red-200">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Ops!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {success && message && (
          <Alert className="mb-3 bg-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {errors?.file?.[0] && (
          <p className="mb-2 text-xs font-medium text-red-500 dark:text-red-400">
            {errors.file[0]}
          </p>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-2"
        >
          <div
            className={clsx(
              'rounded-lg border border-dashed p-4 w-full',
              'bg-muted/20 hover:bg-muted/30 transition-colors'
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                <p className="font-medium">Arraste uma imagem aqui</p>
                <p className="text-muted-foreground text-xs">
                  ou selecione um arquivo do seu dispositivo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  name="file"
                  type="file"
                  accept={ACCEPTED.join(',')}
                  className="hidden"
                  onChange={onInputChange}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando…
                    </>
                  ) : currentUrl ? (
                    <>
                      <ImagePlus className="h-4 w-4" />
                      Trocar avatar
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Enviar avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
