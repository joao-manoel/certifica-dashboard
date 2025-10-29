// src/http/update-user.ts
import { api } from './api-client'

export type Role = 'ADMIN' | 'USER' | 'EDITOR'

export type UpdateUserPayload = {
  name?: string
  username?: string
  email?: string
  role?: Role
}

export type UpdateUserResponse = {
  id: string
  username: string
  name: string | null
  email: string | null
  role: Role
  createdAt: string
  updatedAt: string
}

/** Remove chaves com valor undefined para evitar updates indesejados */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (out as any)[k] = v
  }
  return out
}

/**
 * Atualiza um usuário.
 * - Usa PUT /user/:id (singular), conforme backend.
 * - Envia apenas campos definidos.
 * - Lança o erro original do ky para o caller tratar (401/404/409 etc.).
 */
export async function updateUser(id: string, data: UpdateUserPayload) {
  const json = compact(data)

  const result = await api
    .put(`user/${id}`, { json })
    .json<UpdateUserResponse>()

  return result
}
