'use server'

import { signInWithUsername } from '@/http/sign-in-with-email'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { z } from 'zod'

const signInWithUsernameSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Please, provide your username' })
    .max(16, { message: 'Please, provide your username' }),
  password: z.string().min(1, { message: 'Please, provide your password' })
})

export async function signInWithUsernameAction(data: FormData) {
  const result = signInWithUsernameSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { username, password } = result.data

  try {
    const response = await signInWithUsername({
      username,
      password
    })

    if (!response) {
      return {
        success: false,
        message: 'Authentication failed. Please check your credentials.',
        errors: null
      }
    }

    const { token } = response

    await (
      await cookies()
    ).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 1, // 7 days
      sameSite: 'lax', // Permite compartilhamento entre subdomínios
      domain:
        process.env.NODE_ENV === 'production' ? '.ressurgersps.com' : undefined // 🔥 Usa domínio apenas em produção
    })
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

  return { success: true, message: null, errors: null }
}
