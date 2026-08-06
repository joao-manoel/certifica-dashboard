'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, KeyRound, Loader2, MoreVertical, Search, User, UserPlus } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

import type { ManagedUser, UserRole } from '@/@types/types-users'
import { createAdminUserAction, resetAdminUserPasswordAction, updateAdminUserAction } from '@/actions/admin-user-actions'
import { PageHeader } from '@/components/page-header'
import { EmptyState, ErrorState } from '@/components/page-state'
import { StatCard } from '@/components/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listAdminUsers } from '@/http/admin-users'

const emptyCreate = { name: '', username: '', email: '', role: 'USER' as UserRole, temporaryPassword: '', confirmPassword: '' }

function roleLabel(role: UserRole) { return { ADMIN: 'Administrador', EDITOR: 'Editor', USER: 'Usuário' }[role] }

export default function UsersManagement({ currentUserId }: { currentUserId: string }) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(emptyCreate)
  const [editUser, setEditUser] = useState<ManagedUser | null>(null)
  const [resetUser, setResetUser] = useState<ManagedUser | null>(null)
  const [password, setPassword] = useState({ newPassword: '', confirmPassword: '', forceChangeOnNextLogin: true })
  const [isPending, startTransition] = useTransition()

  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 350); return () => window.clearTimeout(timer) }, [search])

  const query = useQuery({
    queryKey: ['admin-users', page, debouncedSearch, role, status],
    queryFn: () => listAdminUsers({ page, search: debouncedSearch || undefined, role: role === 'all' ? undefined : role, status: status === 'all' ? undefined : status })
  })

  const refresh = async () => { await queryClient.invalidateQueries({ queryKey: ['admin-users'] }) }
  const run = (operation: () => Promise<{ success: boolean; message?: string }>, onSuccess: () => void, successMessage: string) => startTransition(async () => {
    const result = await operation()
    if (!result.success) {
      toast.error(result.message || 'Não foi possível concluir a operação.')
      return
    }
    onSuccess(); await refresh(); toast.success(successMessage)
  })

  const submitCreate = () => run(() => createAdminUserAction(createForm), () => { setCreateOpen(false); setCreateForm(emptyCreate) }, 'Usuário criado com sucesso.')
  const submitEdit = () => editUser && run(() => updateAdminUserAction(editUser.id, { name: editUser.name, username: editUser.username, email: editUser.email, role: editUser.role, isActive: editUser.isActive }), () => setEditUser(null), 'Usuário atualizado com sucesso.')
  const submitPassword = () => resetUser && run(() => resetAdminUserPasswordAction(resetUser.id, password), () => { setResetUser(null); setPassword({ newPassword: '', confirmPassword: '', forceChangeOnNextLogin: true }) }, 'Senha redefinida com sucesso.')

  return <div className="space-y-6">
    <PageHeader title="Gerenciar usuários" description="Crie contas, controle cargos e redefina acessos." action={<Button onClick={() => setCreateOpen(true)}><UserPlus className="size-4" />Novo usuário</Button>} />
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="Total de usuários" value={query.data?.stats.total ?? '—'} />
      <StatCard title="Ativos" value={query.data?.stats.active ?? '—'} />
      <StatCard title="Administradores" value={query.data?.stats.admins ?? '—'} />
      <StatCard title="Editores" value={query.data?.stats.editors ?? '—'} />
    </div>
    <Card><CardContent className="flex flex-col gap-4 pt-6 md:flex-row">
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, usuário ou e-mail" className="pl-10" /></div>
      <Select value={role} onValueChange={(value) => { setRole(value); setPage(1) }}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os cargos</SelectItem><SelectItem value="ADMIN">Administradores</SelectItem><SelectItem value="EDITOR">Editores</SelectItem><SelectItem value="USER">Usuários</SelectItem></SelectContent></Select>
      <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1) }}><SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="active">Ativos</SelectItem><SelectItem value="inactive">Inativos</SelectItem></SelectContent></Select>
    </CardContent></Card>
    {query.isLoading ? <Card><CardContent className="space-y-3 p-6">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}</CardContent></Card> : query.isError ? <ErrorState title="Não foi possível carregar os usuários" description="Verifique a conexão com a API e tente novamente." onRetry={() => query.refetch()} /> : !query.data?.items.length ? <EmptyState title="Nenhum usuário encontrado" description="Ajuste os filtros ou crie um novo usuário." /> : <Card><CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>E-mail</TableHead><TableHead>Cargo</TableHead><TableHead>Status</TableHead><TableHead>Cadastro</TableHead><TableHead className="w-16" /></TableRow></TableHeader><TableBody>{query.data.items.map((item) => <TableRow key={item.id}><TableCell><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-primary/10"><User className="size-4 text-primary" /></div><div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">@{item.username}</p></div></div></TableCell><TableCell>{item.email || '—'}</TableCell><TableCell><Badge variant={item.role === 'ADMIN' ? 'default' : item.role === 'EDITOR' ? 'secondary' : 'outline'}>{roleLabel(item.role)}</Badge></TableCell><TableCell><Badge variant={item.isActive ? 'default' : 'outline'}>{item.isActive ? 'Ativo' : 'Inativo'}</Badge></TableCell><TableCell>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</TableCell><TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Ações para ${item.name}`}><MoreVertical className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setEditUser(item)}><Edit className="size-4" />Editar</DropdownMenuItem>{item.id !== currentUserId && <><DropdownMenuSeparator /><DropdownMenuItem onClick={() => setResetUser(item)}><KeyRound className="size-4" />Redefinir senha</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table></div><div className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground"><span>{query.data.pagination.total} usuário(s)</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Anterior</Button><span className="grid place-items-center px-2">{page} de {query.data.pagination.totalPages}</span><Button variant="outline" size="sm" disabled={page >= query.data.pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Próxima</Button></div></div></CardContent></Card>}

    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Novo usuário</DialogTitle><DialogDescription>Crie a conta com uma senha temporária.</DialogDescription></DialogHeader><UserFields value={createForm} onChange={setCreateForm} password /><DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button onClick={submitCreate} disabled={isPending}>{isPending && <Loader2 className="animate-spin" />}Criar usuário</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}><DialogContent><DialogHeader><DialogTitle>Editar usuário</DialogTitle><DialogDescription>Atualize dados, cargo e status da conta.</DialogDescription></DialogHeader>{editUser && <UserFields value={editUser} onChange={setEditUser} showStatus /> }<DialogFooter><Button variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button><Button onClick={submitEdit} disabled={isPending}>{isPending && <Loader2 className="animate-spin" />}Salvar</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={!!resetUser} onOpenChange={(open) => !open && setResetUser(null)}><DialogContent><DialogHeader><DialogTitle>Redefinir senha</DialogTitle><DialogDescription>Defina uma senha temporária para {resetUser?.name}. As sessões anteriores serão encerradas.</DialogDescription></DialogHeader><div className="grid gap-4"><Field label="Nova senha"><Input type="password" autoComplete="new-password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} /></Field><Field label="Confirmar senha"><Input type="password" autoComplete="new-password" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={password.forceChangeOnNextLogin} onChange={(event) => setPassword({ ...password, forceChangeOnNextLogin: event.target.checked })} />Exigir troca no próximo acesso</label></div><DialogFooter><Button variant="outline" onClick={() => setResetUser(null)}>Cancelar</Button><Button onClick={submitPassword} disabled={isPending}>{isPending && <Loader2 className="animate-spin" />}Redefinir senha</Button></DialogFooter></DialogContent></Dialog>
  </div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }

function UserFields<T extends { name: string; username: string; email?: string | null; role: UserRole; isActive?: boolean; temporaryPassword?: string; confirmPassword?: string }>({ value, onChange, password, showStatus }: { value: T; onChange: (value: T) => void; password?: boolean; showStatus?: boolean }) {
  return <div className="grid gap-4 py-2"><Field label="Nome"><Input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} /></Field><Field label="Username"><Input value={value.username} onChange={(event) => onChange({ ...value, username: event.target.value })} /></Field><Field label="E-mail"><Input type="email" value={value.email || ''} onChange={(event) => onChange({ ...value, email: event.target.value })} /></Field><Field label="Cargo"><Select value={value.role} onValueChange={(role: UserRole) => onChange({ ...value, role })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ADMIN">Administrador</SelectItem><SelectItem value="EDITOR">Editor</SelectItem><SelectItem value="USER">Usuário</SelectItem></SelectContent></Select></Field>{showStatus && <Field label="Status"><Select value={value.isActive ? 'active' : 'inactive'} onValueChange={(status) => onChange({ ...value, isActive: status === 'active' })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Ativo</SelectItem><SelectItem value="inactive">Inativo</SelectItem></SelectContent></Select></Field>}{password && <><Field label="Senha temporária"><Input type="password" value={value.temporaryPassword || ''} onChange={(event) => onChange({ ...value, temporaryPassword: event.target.value })} /></Field><Field label="Confirmar senha"><Input type="password" value={value.confirmPassword || ''} onChange={(event) => onChange({ ...value, confirmPassword: event.target.value })} /></Field></>}</div>
}
