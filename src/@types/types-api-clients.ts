export const apiClientScopes = [
  'posts:read',
  'posts:write',
  'posts:publish',
  'media:read',
  'media:write'
] as const

export type ApiClientScope = (typeof apiClientScopes)[number]

export type ApiClient = {
  id: string
  name: string
  scopes: ApiClientScope[]
  isActive: boolean
  expiresAt: string | null
  lastUsedAt: string | null
  createdAt: string
}

export type CreatedApiClient = ApiClient & {
  token: string
}
