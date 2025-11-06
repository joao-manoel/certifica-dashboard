'use server'

import { HTTPError } from 'ky'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { setUserAvatar } from '@/http/user-avatar'

// validações alinhadas com o client e com o backend
const ACCEPTED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif'
])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

// Como no seu padrão, retornamos { success, message, errors }
type ActionResult = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export async function setAvatarAction(form: FormData): Promise<ActionResult> {
  const file = form.get('file')

  // validações básicas de presence/type
  if (!(file instanceof File)) {
    return {
      success: false,
      message: null,
      errors: { file: ['Arquivo é obrigatório.'] }
    }
  }

  // validação de tipo/tamanho
  if (!ACCEPTED.has(file.type)) {
    return {
      success: false,
      message: null,
      errors: { file: ['Formato inválido. Use JPEG, PNG, WEBP ou AVIF.'] }
    }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      message: null,
      errors: { file: ['Arquivo excede 5MB.'] }
    }
  }

  try {
    // Encaminha multipart ao backend
    await setUserAvatar({ file })

    // Força revalidação da página de settings (se tiver cache)
    revalidatePath('/settings')

    return {
      success: true,
      message: 'Seu avatar foi atualizado com sucesso.',
      errors: null
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      // tenta extrair mensagem JSON do backend
      try {
        const body = await err.response.json()
        return {
          success: false,
          message:
            typeof body?.message === 'string'
              ? body.message
              : 'Falha no upload.',
          errors: null
        }
      } catch {}
      return {
        success: false,
        message: `Falha no upload (${err.response.status}).`,
        errors: null
      }
    }

    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }
}
