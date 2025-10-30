import { api } from './api-client'

export interface CreateMediaPayload {
  url: string
  alt?: string
  mimeType?: string
  width?: number
  height?: number
  dominantClr?: string
}

export interface CreateMediaResponse {
  id: string
  url: string
  alt?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  dominantClr?: string | null
  createdAt: string
  updatedAt: string
}

export async function createMedia(data: CreateMediaPayload) {
  const result = await api
    .post('blog/media', { json: data })
    .json<CreateMediaResponse>()

  return result
}
