export type UserRole = 'ADMIN' | 'EDITOR' | 'USER'

export type ManagedUser = {
  id: string
  username: string
  name: string
  email: string | null
  role: UserRole
  isActive: boolean
  mustChangePassword: boolean
  createdAt: string
  updatedAt: string
}

export type UsersResponse = {
  items: ManagedUser[]
  pagination: { page: number; perPage: number; total: number; totalPages: number }
  stats: { total: number; active: number; admins: number; editors: number }
}
