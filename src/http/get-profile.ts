import { api } from './api-client'

interface GetProfileResponse {
  user: {
    id: number
    username: string
    name: string
    email?: string | null
    role: 'ADMIN' | 'USER' | 'MOD'
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
