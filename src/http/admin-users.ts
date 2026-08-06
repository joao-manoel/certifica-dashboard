import type { ManagedUser, UserRole, UsersResponse } from '@/@types/types-users'

import { api } from './api-client'

export async function listAdminUsers(params: { page: number; search?: string; role?: string; status?: string }) {
  return api.get('admin/users', { searchParams: Object.fromEntries(Object.entries(params).filter(([, value]) => value)) as Record<string, string> }).json<UsersResponse>()
}

export async function createAdminUser(data: { name: string; username: string; email?: string; role: UserRole; temporaryPassword: string; confirmPassword: string }) {
  return api.post('admin/users', { json: data }).json<{ user: ManagedUser }>()
}

export async function updateAdminUser(id: string, data: Partial<Pick<ManagedUser, 'name' | 'username' | 'email' | 'role' | 'isActive'>>) {
  return api.patch(`admin/users/${id}`, { json: data }).json<{ user: ManagedUser }>()
}

export async function resetAdminUserPassword(id: string, data: { newPassword: string; confirmPassword: string; forceChangeOnNextLogin: boolean }) {
  return api.put(`admin/users/${id}/password`, { json: data }).json<{ id: string; updated: true }>()
}
