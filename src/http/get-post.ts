import type { PostDetail } from '@/@types/types-posts'
import { api } from './api-client'

export async function getPost(identifier: string) {
  const result = await api
    .get(`blog/posts/${encodeURIComponent(identifier)}`, {
      next: { tags: ['post', identifier] }
    })
    .json<PostDetail>()

  return result
}
