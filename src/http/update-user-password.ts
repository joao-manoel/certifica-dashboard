import { api } from './api-client'

export type ChangePasswordResponse = {
  id: string
  updatedAt: string
}

export type ChangePasswordPayloadSelf = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export async function updateUserPassword(data: ChangePasswordPayloadSelf) {
  const result = await api
    .put('user/password', { json: data })
    .json<ChangePasswordResponse>()

  return result
}
