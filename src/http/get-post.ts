import type { PostDetail } from '@/@types/types-posts'
import { api } from './api-client'

/**
 * Aceita tanto UUID quanto slug.
 */
export async function getPost(identifier: string) {
  const result = await api
    .get(`blog/posts/${encodeURIComponent(identifier)}`, {
      // Opcional: ajuste as tags de cache conforme sua estratégia
      next: { tags: ['post', identifier] }
    })
    .json<PostDetail>()

  return result
}
