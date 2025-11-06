import { api } from './api-client'

/** Resposta padrão das rotas de avatar. */
export interface AvatarResponse {
  url: string
  expiresIn: number
}

/** Opções para upload do avatar. */
export interface SetAvatarOptions {
  file: File | Blob
  /** Nome do arquivo quando `file` for um Blob sem name (opcional). */
  filename?: string
  /** AbortController.signal opcional. */
  signal?: AbortSignal
}

/**
 * Define/substitui o avatar do usuário autenticado.
 * Envia multipart (campo `file`) para POST /users/me/avatar.
 * Retorna a URL pré-assinada para uso imediato no <img src>.
 */
export async function setUserAvatar(opts: SetAvatarOptions) {
  const { file, filename, signal } = opts

  const form = new FormData()

  // Se for File, preserva o nome; se for Blob, usa o filename passado ou um fallback.
  if (file instanceof File) {
    form.append('file', file, file.name || 'avatar')
  } else {
    form.append('file', file, filename ?? 'avatar')
  }

  // IMPORTANTE: aqui usamos `body` (FormData). Não use `json:` para multipart.
  const result = await api
    .post('users/me/avatar', { body: form, signal })
    .json<AvatarResponse>()

  return result
}
