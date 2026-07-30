import type { MediaItem } from '@/@types/types-media'

import { api } from './api-client'

export type { MediaItem } from '@/@types/types-media'

export interface ListMediaParams {
  page?: number
  perPage?: number
  q?: string
  mimeType?: string
  source?: 'EXTERNAL' | 'S3'
  orderBy?: 'createdAt' | 'updatedAt'
  sort?: 'asc' | 'desc'
  ids?: string[]
}

export interface ListMediaResponse {
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
  items: MediaItem[]
}

export async function listMedia(params: ListMediaParams = {}) {
  const search = new URLSearchParams()

  if (params.page) search.set('page', String(params.page))
  if (params.perPage) search.set('perPage', String(params.perPage))
  if (params.q) search.set('q', params.q)
  if (params.mimeType) search.set('mimeType', params.mimeType)
  if (params.source) search.set('source', params.source)
  if (params.orderBy) search.set('orderBy', params.orderBy)
  if (params.sort) search.set('sort', params.sort)
  if (params.ids) params.ids.forEach((id) => search.append('ids', id))

  const result = await api
    .get(`blog/media?${search.toString()}`)
    .json<ListMediaResponse>()

  return result
}
