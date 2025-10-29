import { api } from './api-client'

export interface GetProfileResponse {
  user: {
    id: string
    username: string
    name: string
    email?: string | null
    role: 'ADMIN' | 'USER' | 'EDITOR'
  }
}

export async function getProfile() {
  const result = await api
    .get('auth/profile', {
      next: {
        tags: ['profile']
      }
    })
    .json<GetProfileResponse>()
  return result
}
