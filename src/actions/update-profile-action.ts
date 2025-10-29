'use server'

import { updateUser } from '@/http/update-user'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { z } from 'zod'

const updateProfileSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'nome deve ter ao menos 3 caracteres')
    .max(32, 'username deve ter no máximo 32 caracteres')
    .optional(),
  username: z
    .string()
    .min(3, 'username deve ter ao menos 3 caracteres')
    .max(32, 'username deve ter no máximo 32 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'username inválido')
    .optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional()
})

export async function updateProfileAction(data: FormData) {
  const result = updateProfileSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { id, username, name, email, role } = result.data

  try {
    const response = await updateUser(id, {
      username,
      email,
      name,
      role
    })

    if (!response) {
      return {
        success: false,
        message: 'Não Foi possivel atualizar, tente novamente mais tarde!',
        errors: null
      }
    }

    revalidateTag('profile', 'update-profile-action')

    return {
      success: true,
      message: 'Seu perfil foi atualizado com sucesso.',
      errors: null
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }
}
