import { api } from './api-client'

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

export interface EditPostPayload {
  title?: string
  slug?: string
  excerpt?: string
  content?: unknown
  coverId?: string | null
  status?: PostStatus
  visibility?: Visibility
  scheduledFor?: string
  categoryNames?: string[]
  tagNames?: string[]
}

export interface EditPostResponse {
  id: string
  slug: string
  status: PostStatus
  visibility: Visibility
  publishedAt: string | null
  scheduledFor: string | null
  wordCount: number
  readTime: number
  createdAt: string
  updatedAt: string
}

/**
 * Edita um post existente.
 * Apenas usuários com role ADMIN ou EDITOR têm permissão.
 */
export async function editPost(id: string, data: EditPostPayload) {
  const result = await api
    .patch(`blog/admin/posts/${id}`, { json: data })
    .json<EditPostResponse>()

  return result
}
