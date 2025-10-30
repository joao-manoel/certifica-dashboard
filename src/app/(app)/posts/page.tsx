import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stats-card'
import { PostsList } from './list-posts'

export default async function BlogManagementPage() {
  const total = undefined
  const published = undefined
  const drafts = undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Blog"
        description="Gerencie todos os posts do blog"
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
      <PostsList />
    </div>
  )
}
