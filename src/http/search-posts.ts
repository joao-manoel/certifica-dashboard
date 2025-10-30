import type { PostListItem, PostStatus, Visibility } from '@/@types/types-posts'
import { api } from './api-client'

export interface SearchPostsParams {
  q: string
  page?: number
  perPage?: number
  status?: PostStatus
  visibility?: Visibility
  categorySlug?: string
  tagSlug?: string
  authorId?: string
  sort?: string
}

export interface SearchPostsResponse {
  page: number
  perPage: number
  total: number
  items: PostListItem[]
}

export async function searchPosts(params: SearchPostsParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('q', params.q)
  if (params.page != null) searchParams.set('page', String(params.page))
  if (params.perPage != null) searchParams.set('perPage', String(params.perPage))
  if (params.status) searchParams.set('status', params.status)
  if (params.visibility) searchParams.set('visibility', params.visibility)
  if (params.categorySlug) searchParams.set('category', params.categorySlug)
  if (params.tagSlug) searchParams.set('tag', params.tagSlug)
  if (params.authorId) searchParams.set('authorId', params.authorId)
  if (params.sort) searchParams.set('sort', params.sort)

  const url = `blog/posts/search?${searchParams.toString()}`

  const result = await api
    .get(url, {
      next: { tags: ['posts', 'search', params.q] }
    })
    .json<SearchPostsResponse>()

  return result
}