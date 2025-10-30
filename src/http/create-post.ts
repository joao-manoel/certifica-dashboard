import { api } from './api-client'

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

export interface CreatePostPayload {
  title: string
  slug?: string
  excerpt?: String
  content: unknown
  coverId?: string | null
  status?: PostStatus
  visibility?: Visibility
  scheduledFor?: string
  categoryNames?: string[]
  tagNames?: string[]
}

export interface CreatePostResponse {
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

export async function createPost(data: CreatePostPayload) {
  const result = await api
    .post('blog/posts', { json: data })
    .json<CreatePostResponse>()

  return result
}
