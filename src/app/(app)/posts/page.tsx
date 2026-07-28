import { Plus } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stats-card'
import { Button } from '@/components/ui/button'
import { getPostStats } from '@/http/get-post-stats'

import { PostsList } from './list-posts'

export default async function BlogManagementPage() {
  const { user } = await auth()
  const blogStats = await getPostStats()
  const total = blogStats.total
  const published = blogStats.published
  const drafts = blogStats.drafts

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Blog"
        description="Gerencie todas publicações do blog"
        action={
          <Link href="/posts/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Publicação
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total de Posts" value={total ?? '—'} />
        <StatCard title="Publicados" value={published ?? '—'} />
        <StatCard title="Rascunhos" value={drafts ?? '—'} />
      </div>

      {/* Listagem com busca/paginação (client) */}
      <PostsList
        currentUser={
          user
            ? {
                id: user.id,
                role: user.role
              }
            : null
        }
      />
    </div>
  )
}
