'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { apiClientScopes } from '@/@types/types-api-clients'
import {
  createApiClient,
  revokeApiClient
} from '@/http/api-clients'

const createSchema = z.object({
  name: z.string().trim().min(3).max(80),
  scopes: z.array(z.enum(apiClientScopes)).min(1).max(5),
  expiresInDays: z.union([
    z.literal(30),
    z.literal(90),
    z.literal(180),
    z.literal(365),
    z.null()
  ])
})

function errorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response instanceof Response
  ) {
    return error.response
      .json()
      .then((body: unknown) =>
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof body.message === 'string'
          ? body.message
          : 'Não foi possível concluir a operação.'
      )
      .catch(() => 'Não foi possível concluir a operação.')
  }
  return Promise.resolve('Não foi possível concluir a operação.')
}

export async function createApiClientAction(input: unknown) {
  const parsed = createSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? 'Dados inválidos.'
    }
  }

  try {
    const client = await createApiClient(parsed.data)
    revalidateTag('api-clients', 'max')
    return { success: true as const, client }
  } catch (error) {
    return { success: false as const, message: await errorMessage(error) }
  }
}

export async function revokeApiClientAction(id: string) {
  if (!z.string().uuid().safeParse(id).success) {
    return { success: false as const, message: 'Token inválido.' }
  }

  try {
    await revokeApiClient(id)
    revalidateTag('api-clients', 'max')
    return { success: true as const }
  } catch (error) {
    return { success: false as const, message: await errorMessage(error) }
  }
}
