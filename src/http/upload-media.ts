import type { HTTPError } from 'ky'

import type { MediaItem } from '@/@types/types-media'
import { api } from '@/http/api-client'

export const MAX_MEDIA_FILE_SIZE = 25 * 1024 * 1024
export const ALLOWED_MEDIA_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const

export async function uploadMedia(file: File, alt?: string) {
  const formData = new FormData()
  if (alt?.trim()) formData.set('alt', alt.trim())
  formData.set('file', file)

  return api
    .post('blog/media/upload', {
      body: formData,
      timeout: 120_000
    })
    .json<MediaItem>()
}

export async function getUploadMediaError(error: unknown) {
  const httpError = error as HTTPError
  if (!httpError.response) {
    return 'Não foi possível hospedar a imagem. Tente novamente.'
  }

  try {
    const body = (await httpError.response.json()) as { message?: string }
    if (body.message) return body.message
  } catch {}

  switch (httpError.response.status) {
    case 401:
    case 403:
      return 'Sua sessão não permite enviar imagens.'
    case 413:
      return 'A imagem deve ter no máximo 25 MB.'
    case 415:
      return 'Use uma imagem JPEG, PNG ou WebP.'
    default:
      return 'Não foi possível hospedar a imagem. Tente novamente.'
  }
}
