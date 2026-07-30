'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarClock,
  Edit3,
  Eye,
  FileText,
  LayoutGrid,
  List,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
  X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'

import type {
  PostListItem,
  PostStatus,
  Role,
  Visibility
} from '@/@types/types-posts'
import { deletePostAction } from '@/actions/delete-post-action'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState, ErrorState } from '@/components/page-state'
import StatusBadge from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import VisibilityBadge from '@/components/visibility-badge'
import { listPosts } from '@/http/list-posts'
import { searchPosts } from '@/http/search-posts'
import { cn } from '@/lib/utils'

type ViewMode = 'table' | 'cards'
const perPage = 12

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debounced
}

function formatDate(value: string | null) {
  if (!value) return 'Não publicado'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function PostCover({
  post,
  compact = false
}: {
  post: PostListItem
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-lg border bg-muted',
        compact ? 'h-14 w-20' : 'aspect-[16/9] w-full'
      )}
    >
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt=""
          fill
          sizes={compact ? '80px' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center">
          <FileText className="size-5 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export function PostsList({
  currentUser
}: {
  currentUser: { id: string; role: Role } | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const status = (searchParams.get('status') ?? 'all') as PostStatus | 'all'
  const visibility = (searchParams.get('visibility') ?? 'all') as
    Visibility | 'all'
  const view = (
    searchParams.get('view') === 'cards' ? 'cards' : 'table'
  ) as ViewMode
  const urlQuery = searchParams.get('q') ?? ''
  const [search, setSearch] = useState(urlQuery)
  const debouncedSearch = useDebounced(search)
  const [postToDelete, setPostToDelete] = useState<PostListItem | null>(null)
  const [isDeleting, startDeleting] = useTransition()

  function replaceParams(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString())
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || value === 'all' || (key === 'page' && value === '1')) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    router.replace(`/posts${next.size ? `?${next.toString()}` : ''}`, {
      scroll: false
    })
  }

  useEffect(() => {
    if (debouncedSearch.trim() === urlQuery) return
    replaceParams({ q: debouncedSearch.trim() || undefined, page: undefined })
    // replaceParams intentionally reads the current URL at execution time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, urlQuery])

  const queryKey = useMemo(
    () => ['posts', { page, q: urlQuery, status, visibility }],
    [page, status, urlQuery, visibility]
  )

  const query = useQuery({
    queryKey,
    queryFn: () => {
      const filters = {
        page,
        perPage,
        status: status === 'all' ? undefined : status,
        visibility: visibility === 'all' ? undefined : visibility
      }
      return urlQuery
        ? searchPosts({ ...filters, q: urlQuery })
        : listPosts(filters)
    }
  })

  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const hasFilters = Boolean(
    urlQuery || status !== 'all' || visibility !== 'all'
  )

  function canDelete(post: PostListItem) {
    return (
      currentUser?.role === 'ADMIN' ||
      (currentUser?.role === 'EDITOR' && post.author.id === currentUser.id)
    )
  }

  function handleDelete() {
    if (!postToDelete) return

    startDeleting(async () => {
      const response = await deletePostAction(postToDelete.id)
      if (!response.success) {
        toast.error(response.message)
        return
      }
      setPostToDelete(null)
      if (items.length === 1 && page > 1) {
        replaceParams({ page: String(page - 1) })
      }
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.refresh()
      toast.success('Publicação excluída.')
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título, categoria ou tag…"
                className="pl-9 pr-10"
                aria-label="Buscar publicações"
              />
              {query.isFetching ? (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              ) : search ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                  onClick={() => setSearch('')}
                  aria-label="Limpar busca"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>

            <Select
              value={status}
              onValueChange={(value) =>
                replaceParams({ status: value, page: undefined })
              }
            >
              <SelectTrigger
                className="w-full lg:w-44"
                aria-label="Filtrar por status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PUBLISHED">Publicados</SelectItem>
                <SelectItem value="DRAFT">Rascunhos</SelectItem>
                <SelectItem value="SCHEDULED">Agendados</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={visibility}
              onValueChange={(value) =>
                replaceParams({ visibility: value, page: undefined })
              }
            >
              <SelectTrigger
                className="w-full lg:w-44"
                aria-label="Filtrar por visibilidade"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda visibilidade</SelectItem>
                <SelectItem value="PUBLIC">Públicas</SelectItem>
                <SelectItem value="UNLISTED">Não listadas</SelectItem>
                <SelectItem value="PRIVATE">Privadas</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border p-1">
              <Button
                variant={view === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={() => replaceParams({ view: 'table' })}
                aria-label="Visualização em lista"
                aria-pressed={view === 'table'}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={view === 'cards' ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={() => replaceParams({ view: 'cards' })}
                aria-label="Visualização em cards"
                aria-pressed={view === 'cards'}
              >
                <LayoutGrid className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {total}{' '}
              {total === 1
                ? 'publicação encontrada'
                : 'publicações encontradas'}
            </span>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  router.replace('/posts', { scroll: false })
                }}
              >
                <X className="size-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {query.isPending ? (
        view === 'table' ? (
          <Card className="overflow-hidden py-0">
            <div className="space-y-0 divide-y">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-14 w-20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-7 w-20" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-xl" />
            ))}
          </div>
        )
      ) : query.isError ? (
        <ErrorState
          title="Não foi possível carregar as publicações"
          description={
            query.error instanceof Error
              ? query.error.message
              : 'Verifique sua conexão e tente novamente.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-10 text-muted-foreground" />}
          title={
            hasFilters ? 'Nenhuma publicação encontrada' : 'Comece seu blog'
          }
          description={
            hasFilters
              ? 'Tente remover alguns filtros ou usar outros termos de busca.'
              : 'Crie a primeira publicação para começar a alimentar o blog.'
          }
          action={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  router.replace('/posts', { scroll: false })
                }}
              >
                Limpar filtros
              </Button>
            ) : (
              <Button asChild>
                <Link href="/posts/create">Criar publicação</Link>
              </Button>
            )
          }
        />
      ) : view === 'table' ? (
        <Card className="overflow-hidden py-0">
          <div className="overflow-hidden">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[calc(100%-3.5rem)] sm:w-[58%]">
                    Publicação
                  </TableHead>
                  <TableHead className="hidden w-32 sm:table-cell">
                    Estado
                  </TableHead>
                  <TableHead className="hidden w-36 xl:table-cell">
                    Autor
                  </TableHead>
                  <TableHead className="hidden w-28 2xl:table-cell">
                    Desempenho
                  </TableHead>
                  <TableHead className="hidden w-36 lg:table-cell">
                    Data
                  </TableHead>
                  <TableHead className="w-14">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((post) => (
                  <ContextMenu key={post.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow className="group">
                        <TableCell className="min-w-0">
                          <Link
                            href={`/posts/edit/${post.id}`}
                            className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <PostCover post={post} compact />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <p className="truncate font-medium group-hover:text-primary">
                                {post.title}
                              </p>
                              <p
                                className="mt-1 block max-w-full truncate text-xs text-muted-foreground"
                                title={post.excerpt || `/${post.slug}`}
                              >
                                {post.excerpt || `/${post.slug}`}
                              </p>
                              {post.categories.length > 0 && (
                                <div className="mt-2 hidden gap-1 sm:flex">
                                  {post.categories
                                    .slice(0, 2)
                                    .map((category) => (
                                      <Badge
                                        key={category.id}
                                        variant="outline"
                                        className="h-5 max-w-28 truncate text-[10px]"
                                      >
                                        {category.name}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="space-y-1.5">
                            <StatusBadge status={post.status} />
                            <div>
                              <VisibilityBadge visibility={post.visibility} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <p className="truncate text-sm">{post.author.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{post.author.username}
                          </p>
                        </TableCell>
                        <TableCell className="hidden 2xl:table-cell">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Eye className="size-4 text-muted-foreground" />
                            {post.views.toLocaleString('pt-BR')}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {post.readTime} min de leitura
                          </p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="truncate text-sm">
                            {formatDate(post.publishedAt)}
                          </p>
                          {post.status === 'SCHEDULED' && post.scheduledFor && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarClock className="size-3" />
                              {formatDate(post.scheduledFor)}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <PostActions
                            post={post}
                            canDelete={canDelete(post)}
                            disabled={isDeleting}
                            onDelete={() => setPostToDelete(post)}
                          />
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <PostContextMenu
                      post={post}
                      canDelete={canDelete(post)}
                      disabled={isDeleting}
                      onDelete={() => setPostToDelete(post)}
                    />
                  </ContextMenu>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((post) => (
            <ContextMenu key={post.id}>
              <ContextMenuTrigger asChild>
                <Card className="group overflow-hidden pt-0">
                  <Link href={`/posts/edit/${post.id}`} className="block">
                    <PostCover post={post} />
                  </Link>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/posts/edit/${post.id}`}
                          className="line-clamp-2 font-semibold leading-snug hover:text-primary"
                        >
                          {post.title}
                        </Link>
                        <p
                          className="mt-1 truncate text-sm text-muted-foreground"
                          title={post.excerpt || 'Sem resumo cadastrado.'}
                        >
                          {post.excerpt || 'Sem resumo cadastrado.'}
                        </p>
                      </div>
                      <PostActions
                        post={post}
                        canDelete={canDelete(post)}
                        disabled={isDeleting}
                        onDelete={() => setPostToDelete(post)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge status={post.status} />
                      <VisibilityBadge visibility={post.visibility} />
                    </div>
                    <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {post.views.toLocaleString('pt-BR')}
                      </span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <PostContextMenu
                post={post}
                canDelete={canDelete(post)}
                disabled={isDeleting}
                onDelete={() => setPostToDelete(post)}
              />
            </ContextMenu>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} · {total} itens
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => replaceParams({ page: String(page - 1) })}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => replaceParams({ page: String(page + 1) })}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <DeleteDialog
        open={postToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPostToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Excluir publicação?"
        description={`“${postToDelete?.title ?? ''}” será removida definitivamente do blog. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir publicação"
        isPending={isDeleting}
      />
    </div>
  )
}

function PostContextMenu({
  post,
  canDelete,
  disabled,
  onDelete
}: {
  post: PostListItem
  canDelete: boolean
  disabled: boolean
  onDelete: () => void
}) {
  return (
    <ContextMenuContent className="w-48">
      <ContextMenuItem asChild>
        <Link href={`/posts/edit/${post.id}`}>
          <Edit3 className="size-4" />
          Editar publicação
        </Link>
      </ContextMenuItem>
      {canDelete && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            disabled={disabled}
            onSelect={onDelete}
          >
            <Trash2 className="size-4" />
            Excluir publicação
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  )
}

function PostActions({
  post,
  canDelete,
  disabled,
  onDelete
}: {
  post: PostListItem
  canDelete: boolean
  disabled: boolean
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label={`Ações para ${post.title}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/posts/edit/${post.id}`}>
            <Edit3 className="size-4" />
            Editar publicação
          </Link>
        </DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={disabled}
              onSelect={onDelete}
            >
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
