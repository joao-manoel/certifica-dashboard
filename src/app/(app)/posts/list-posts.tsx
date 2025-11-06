'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  X,
  Loader2,
  LayoutGrid,
  Table as TableIcon,
  FileText,
  Eye
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink
} from '@/components/ui/pagination'

import { listPosts } from '@/http/list-posts'
import { searchPosts } from '@/http/search-posts'
import type { PostListItem } from '@/@types/types-posts'
import SkeletonPostTable from './skeleton-posts-table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import StatusBadge from '@/components/status-badge'
import VisibilityBadge from '@/components/visibility-badge'

function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

type ViewMode = 'table' | 'cards'

export function PostsList() {
  const router = useRouter()
  const params = useSearchParams()

  // estado de URL / filtros
  const [page, setPage] = useState<number>(() => {
    const p = Number(params.get('page') ?? '1')
    return Number.isFinite(p) && p > 0 ? p : 1
  })
  const perPage = 12 // fixo
  const [q, setQ] = useState<string>(() => params.get('q') ?? '')
  const debouncedQ = useDebounced(q, 400)

  // view mode (persistência simples no localStorage)
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'table'
    return (localStorage.getItem('posts_view') as ViewMode) || 'table'
  })
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('posts_view', view)
    }
  }, [view])

  // sync query string
  useEffect(() => {
    const sp = new URLSearchParams()
    if (page > 1) sp.set('page', String(page))
    if (q.trim()) sp.set('q', q.trim())
    router.replace(`?${sp.toString()}`, { scroll: false })
  }, [page, q, router])

  // dados
  const queryKey = useMemo(
    () => ['posts', { page, perPage, q: debouncedQ }],
    [page, perPage, debouncedQ]
  )

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (debouncedQ.trim()) {
        return searchPosts({ q: debouncedQ.trim(), page, perPage })
      }
      return listPosts({ page, perPage })
    }
  })

  const items = (data?.items ?? []) as PostListItem[]
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  // reset page quando a busca muda
  useEffect(() => {
    setPage(1)
  }, [debouncedQ])

  return (
    <div className="space-y-5">
      {/* Topbar: busca + view toggle + contagem */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, categoria ou tag…"
            className="pl-9 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {q && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setQ('')}
                title="Limpar busca"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* toggle view */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="rounded-lg border p-1">
            <div className="flex">
              <Button
                variant={view === 'table' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'gap-2 rounded-md',
                  view === 'table' ? '' : 'hover:bg-transparent'
                )}
                onClick={() => setView('table')}
              >
                <TableIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Tabela</span>
              </Button>
              <Button
                variant={view === 'cards' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'gap-2 rounded-md',
                  view === 'cards' ? '' : 'hover:bg-transparent'
                )}
                onClick={() => setView('cards')}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            {total > 0 ? `${total} resultado${total === 1 ? '' : 's'}` : '—'}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        view === 'table' ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Visibilidade
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Categorias
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Tags</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Publicado
                  </TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 12 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <SkeletonPostTable />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`sk-card-${i}`} className="overflow-hidden">
                <Skeleton className="h-32 w-full bg-zinc-300" />
                <CardHeader className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : isError ? (
        <p className="text-sm text-red-500">
          {(error as Error)?.message ?? 'Erro ao carregar posts.'}
        </p>
      ) : (items ?? []).length === 0 ? (
        <div className="rounded-md border p-10 text-center text-sm text-muted-foreground">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Nenhuma publicação</EmptyTitle>
              <EmptyDescription>
                Você ainda não criou nenhuma publicação. Comece criando sua
                primeira publicação.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/posts/create">Criar Publicação</Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      ) : view === 'table' ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Visibilidade
                </TableHead>

                <TableHead className="hidden lg:table-cell">Autor</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Publicado
                </TableHead>
                <TableHead className="hidden lg:table-cell text-center">
                  Visualizações
                </TableHead>
                <TableHead className="w-[120px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((p) => {
                const categories = p.categories ?? []
                const tags = p.tags ?? []
                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.coverUrl}
                            alt=""
                            className="h-10 w-16 rounded object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-16 rounded border bg-muted" />
                        )}
                        <div className="flex flex-col">
                          <h1 className="font-medium line-clamp-1">
                            {p.title}
                          </h1>
                          <div className="flex gap-2">
                            <span className="flex gap-2">
                              {categories.length
                                ? categories.map((c) => (
                                    <Badge
                                      key={c.id}
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      {c.name}
                                    </Badge>
                                  ))
                                : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <StatusBadge status={p.status} />
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <VisibilityBadge visibility={p.visibility} />
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.author.name}
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <span
                        className={cn(
                          'text-xs',
                          !p.publishedAt && 'text-muted-foreground'
                        )}
                      >
                        {p.publishedAt
                          ? new Date(p.publishedAt).toLocaleDateString()
                          : '—'}
                      </span>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell justify-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {p.views}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/posts/edit/${p.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                          >
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        // cards view
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const categories = p.categories ?? []
            const tags = p.tags ?? []
            return (
              <Card key={p.id} className="overflow-hidden group">
                <div className="relative h-32 w-full bg-muted">
                  {p.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : null}
                </div>

                <CardHeader className="pb-2">
                  <h3 className="line-clamp-2 font-semibold">{p.title}</h3>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 3).map((c) => (
                      <Badge
                        key={c.id}
                        variant="outline"
                        className="text-[10px]"
                      >
                        {c.name}
                      </Badge>
                    ))}
                    {categories.length === 0 && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.slice(0, 4).map((t) => (
                      <Badge
                        key={t.id}
                        variant="outline"
                        className="text-[10px]"
                      >
                        #{t.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <VisibilityBadge visibility={p.visibility} />
                    <span
                      className={cn(
                        'text-[10px]',
                        !p.publishedAt && 'text-muted-foreground'
                      )}
                    >
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString()
                        : '—'}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Eye className="size-4" />
                      {p.views}
                    </div>
                  </div>

                  <Link href={`/posts/edit/${p.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Editar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Paginação (shadcn) */}
      {totalPages > 1 && (
        <>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={page <= 1}
                  className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages })
                .slice(
                  Math.max(0, page - 3),
                  Math.max(0, page - 3) + Math.min(5, totalPages)
                )
                .map((_, i) => {
                  const start = Math.max(1, page - 2)
                  const pnum = start + i
                  return (
                    <PaginationItem key={pnum}>
                      <PaginationLink
                        isActive={pnum === page}
                        onClick={() => setPage(pnum)}
                      >
                        {pnum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

              <PaginationItem>
                <PaginationNext
                  aria-disabled={page >= totalPages}
                  className={cn(
                    page >= totalPages && 'pointer-events-none opacity-50'
                  )}
                  onClick={() => page < totalPages && setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-xs text-muted-foreground">
            Página {page} de {totalPages} • {total} itens
          </div>
        </>
      )}
    </div>
  )
}
