import type { MediaDetails, MediaItem } from '@/@types/types-media'
import { api } from '@/http/api-client'

export type MediaMetadataInput = {
  title?: string | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
  url?: string
}

export async function getMediaDetails(id: string) {
  return api.get(`blog/media/${id}`).json<MediaDetails>()
}

export async function createExternalMedia(
  input: MediaMetadataInput & { url: string }
) {
  return api.post('blog/media', { json: input }).json<MediaItem>()
}

export async function updateMedia(id: string, input: MediaMetadataInput) {
  return api.patch(`blog/media/${id}`, { json: input }).json<MediaItem>()
}

export async function transformMedia(
  id: string,
  input: {
    file?: File | null
    rotate?: number
    flipHorizontal?: boolean
    flipVertical?: boolean
    cropLeft?: number
    cropTop?: number
    cropWidth?: number
    cropHeight?: number
  }
) {
  const body = new FormData()
  if (input.file) body.set('file', input.file)
  body.set('rotate', String(input.rotate ?? 0))
  body.set('flipHorizontal', String(Boolean(input.flipHorizontal)))
  body.set('flipVertical', String(Boolean(input.flipVertical)))
  if (input.cropLeft !== undefined) {
    body.set('cropLeft', String(input.cropLeft))
    body.set('cropTop', String(input.cropTop))
    body.set('cropWidth', String(input.cropWidth))
    body.set('cropHeight', String(input.cropHeight))
  }
  return api
    .post(`blog/media/${id}/transform`, { body, timeout: 120_000 })
    .json<MediaItem>()
}

export async function deleteMedia(id: string) {
  await api.delete(`blog/media/${id}`)
}
