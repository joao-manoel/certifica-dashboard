import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'

import UsersManagement from './users-management'

export default async function UsersPage() {
  const { user } = await auth()
  if (!user) redirect('/sign-in')
  if (user.role !== 'ADMIN') redirect('/')
  return <UsersManagement currentUserId={user.id} />
}
