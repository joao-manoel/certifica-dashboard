import type { MediaItem } from '@/@types/types-media'

import { api } from './api-client'

export interface CreateMediaPayload {
  url: string
  alt?: string
  mimeType?: string
  width?: number
  height?: number
  dominantClr?: string
}

export async function createMedia(data: CreateMediaPayload) {
  const result = await api
    .post('blog/media', { json: data })
    .json<MediaItem>()

  return result
}
