'use server'

import { updateUserPassword } from '@/http/update-user-password'
import { HTTPError } from 'ky'
import { z } from 'zod'

const updatePasswordSelfSchema = z
  .object({
    currentPassword: z
      .string()
      .min(3, 'Digite a senha atual')
      .transform((s) => s.trim()),
    newPassword: z
      .string()
      .min(8, 'A nova senha deve ter pelo menos 8 caracteres')
      .transform((s) => s.trim()),
    confirmPassword: z
      .string()
      .min(1, 'Confirme a nova senha')
      .transform((s) => s.trim())
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Confirmação não confere com a nova senha'
      })
    }
    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'A nova senha não pode ser igual à senha atual'
      })
    }
  })

export async function updatePasswordAction(form: FormData) {
  const parsed = updatePasswordSelfSchema.safeParse(Object.fromEntries(form))

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data

  try {
    const response = await updateUserPassword({
      currentPassword,
      newPassword,
      confirmPassword
    })

    if (!response) {
      return {
        success: false,
        message: 'Não foi possível atualizar. Tente novamente mais tarde.',
        errors: null
      }
    }

    return {
      success: true,
      message: 'Senha atualizada com sucesso.',
      errors: null
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      try {
        const { message } = await err.response.json()
        return { success: false, message, errors: null }
      } catch {
        // fallback quando a API não responde JSON
        return {
          success: false,
          message: 'Falha ao atualizar a senha.',
          errors: null
        }
      }
    }

    console.error(err)
    return {
      success: false,
      message: 'Erro inesperado. Tente novamente em alguns minutos.',
      errors: null
    }
  }
}
