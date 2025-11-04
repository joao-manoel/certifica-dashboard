export type Role = 'ADMIN' | 'EDITOR' | 'USER'
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'

export interface AuthorSummary {
  id: string
  name: string
  username: string
}

export interface CategorySummary {
  id: string
  name: string
  slug: string
}

export interface TagSummary {
  id: string
  name: string
  slug: string
}

export interface PostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  status: PostStatus
  visibility: Visibility
  views: number
  publishedAt: string | null
  scheduledFor: string | null
  wordCount: number
  readTime: number
  createdAt: string
  updatedAt: string
  author: AuthorSummary
  coverUrl: string | null
  categories: CategorySummary[]
  tags: TagSummary[]
}

export interface PostDetail extends PostListItem {
  content: unknown
}
