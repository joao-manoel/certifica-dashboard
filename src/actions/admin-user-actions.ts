'use server'

import { HTTPError } from 'ky'

import type { ManagedUser, UserRole } from '@/@types/types-users'
import { createAdminUser, resetAdminUserPassword, updateAdminUser } from '@/http/admin-users'

async function errorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = await error.response.json<{ message?: string }>().catch(() => null)
    return body?.message || 'Não foi possível concluir a operação.'
  }
  return 'Erro inesperado. Tente novamente.'
}

export async function createAdminUserAction(data: { name: string; username: string; email?: string; role: UserRole; temporaryPassword: string; confirmPassword: string }) {
  try { return { success: true as const, data: await createAdminUser(data) } }
  catch (error) { return { success: false as const, message: await errorMessage(error) } }
}

export async function updateAdminUserAction(id: string, data: Partial<Pick<ManagedUser, 'name' | 'username' | 'email' | 'role' | 'isActive'>>) {
  try { return { success: true as const, data: await updateAdminUser(id, data) } }
  catch (error) { return { success: false as const, message: await errorMessage(error) } }
}

export async function resetAdminUserPasswordAction(id: string, data: { newPassword: string; confirmPassword: string; forceChangeOnNextLogin: boolean }) {
  try { return { success: true as const, data: await resetAdminUserPassword(id, data) } }
  catch (error) { return { success: false as const, message: await errorMessage(error) } }
}
