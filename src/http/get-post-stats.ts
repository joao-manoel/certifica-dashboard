import { api } from './api-client'

export interface PostStatsResponse {
  total: number
  published: number
  drafts: number
}

export async function getPostStats() {
  const result = await api
    .get('blog/metrics/posts/stats')
    .json<PostStatsResponse>()

  return result
}
