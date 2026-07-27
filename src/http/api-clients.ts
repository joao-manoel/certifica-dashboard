import type {
  ApiClient,
  ApiClientScope,
  CreatedApiClient
} from '@/@types/types-api-clients'

import { api } from './api-client'

export async function listApiClients() {
  return api
    .get('integrations/api-clients', {
      next: { tags: ['api-clients'] }
    })
    .json<{ items: ApiClient[] }>()
}

export async function createApiClient(input: {
  name: string
  scopes: ApiClientScope[]
  expiresInDays: 30 | 90 | 180 | 365 | null
}) {
  return api
    .post('integrations/api-clients', { json: input })
    .json<CreatedApiClient>()
}

export async function revokeApiClient(id: string) {
  return api
    .delete(`integrations/api-clients/${id}`)
    .json<{ success: true }>()
}
