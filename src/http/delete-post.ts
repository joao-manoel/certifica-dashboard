import { api } from './api-client'

interface DeletePostResponse {
  id: string
  deleted: true
}

export async function deletePost(id: string) {
  return api.delete(`blog/posts/${id}`).json<DeletePostResponse>()
}
