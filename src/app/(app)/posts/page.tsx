'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stats-card'
import { SearchBar } from '@/components/search-bar'
import { DeleteDialog } from '@/components/delete-dialog'

const initialPosts = [
  {
    id: 1,
    title: 'Inovações em Engenharia Civil para 2024',
    category: 'Engenharia Civil',
    status: 'published',
    views: 1234,
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Sustentabilidade na Construção',
    category: 'Sustentabilidade',
    status: 'published',
    views: 856,
    date: '2024-01-10'
  },
  {
    id: 3,
    title: 'Tecnologia BIM na Prática',
    category: 'Tecnologia',
    status: 'draft',
    views: 0,
    date: '2024-01-08'
  },
  {
    id: 4,
    title: 'Segurança em Obras',
    category: 'Segurança',
    status: 'published',
    views: 2341,
    date: '2024-01-05'
  },
  {
    id: 5,
    title: 'Gestão de Projetos de Engenharia',
    category: 'Gestão',
    status: 'published',
    views: 1567,
    date: '2024-01-03'
  }
]

export default function BlogManagement() {
  const [posts, setPosts] = useState(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciar Blog"
        description="Gerencie todos os posts do blog"
        action={
          <Link href="/blog/post/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total de Posts" value={posts.length} />
        <StatCard
          title="Publicados"
          value={posts.filter((p) => p.status === 'published').length}
        />
        <StatCard
          title="Rascunhos"
          value={posts.filter((p) => p.status === 'draft').length}
        />
      </div>

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
      />
    </div>
  )
}
