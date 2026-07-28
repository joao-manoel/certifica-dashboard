'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { deletePost } from '@/http/delete-post'

async function errorMessage(error: unknown) {
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
          : 'Não foi possível excluir o post.'
      )
      .catch(() => 'Não foi possível excluir o post.')
  }

  return 'Não foi possível excluir o post.'
}

export async function deletePostAction(id: string) {
  if (!z.string().uuid().safeParse(id).success) {
    return { success: false as const, message: 'Post inválido.' }
  }

  try {
    await deletePost(id)
    revalidateTag('posts', 'max')
    return { success: true as const }
  } catch (error) {
    return { success: false as const, message: await errorMessage(error) }
  }
}
