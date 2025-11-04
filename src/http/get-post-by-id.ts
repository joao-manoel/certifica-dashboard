import { api } from './api-client'

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

export type GetPostByIdResponse = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: unknown
  coverId: string | null
  coverUrl: string | null
  status: PostStatus
  visibility: Visibility
  publishedAt: string | null
  scheduledFor: string | null
  wordCount: number
  readTime: number
  createdAt: string
  updatedAt: string
  categories: { name: string; slug: string }[]
  tags: { name: string; slug: string }[]
}

export async function getPostById(id: string) {
  const result = await api
    .get(`blog/admin/posts/${id}`)
    .json<GetPostByIdResponse>()

  return result
}
