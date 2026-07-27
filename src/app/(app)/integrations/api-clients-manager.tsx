'use client'

import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import type {
  ApiClient,
  ApiClientScope,
  CreatedApiClient
} from '@/@types/types-api-clients'
import {
  createApiClientAction,
  revokeApiClientAction
} from '@/actions/api-client-actions'
import { DeleteDialog } from '@/components/delete-dialog'
import { PageHeader } from '@/components/page-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const scopes: Array<{
  value: ApiClientScope
  label: string
  description: string
}> = [
  {
    value: 'posts:read',
    label: 'Ler posts',
    description: 'Consultar posts e gerar links internos.'
  },
  {
    value: 'posts:write',
    label: 'Criar e editar posts',
    description: 'Validar, criar e atualizar rascunhos.'
  },
  {
    value: 'media:read',
    label: 'Ler mídias',
    description: 'Consultar a biblioteca de imagens.'
  },
  {
    value: 'media:write',
    label: 'Enviar mídias',
    description: 'Enviar imagens para a API armazenar no S3.'
  },
  {
    value: 'posts:publish',
    label: 'Publicar e agendar',
    description: 'Permissão sensível; publicação ainda exige confirmação.'
  }
]

const defaultScopes: ApiClientScope[] = [
  'posts:read',
  'posts:write',
  'media:read',
  'media:write'
]

function formatDate(value: string | null) {
  if (!value) return 'Nunca'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value))
}

function clientStatus(client: ApiClient) {
  if (!client.isActive) return 'Revogado'
  if (client.expiresAt && new Date(client.expiresAt) <= new Date()) {
    return 'Expirado'
  }
  return 'Ativo'
}

export default function ApiClientsManager({
  initialItems
}: {
  initialItems: ApiClient[]
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [name, setName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState(defaultScopes)
  const [expiresInDays, setExpiresInDays] = useState<
    30 | 90 | 180 | 365 | null
  >(90)
  const [createdClient, setCreatedClient] =
    useState<CreatedApiClient | null>(null)
  const [copied, setCopied] = useState(false)
  const [clientToRevoke, setClientToRevoke] = useState<ApiClient | null>(null)
  const [isCreating, startCreating] = useTransition()
  const [isRevoking, startRevoking] = useTransition()

  function toggleScope(scope: ApiClientScope) {
    setSelectedScopes((current) =>
      current.includes(scope)
        ? current.filter((item) => item !== scope)
        : [...current, scope]
    )
  }

  function handleCreate() {
    startCreating(async () => {
      const response = await createApiClientAction({
        name,
        scopes: selectedScopes,
        expiresInDays
      })
      if (!response.success) {
        toast.error(response.message)
        return
      }

      setItems((current) => [response.client, ...current])
      setCreatedClient(response.client)
      setName('')
      setSelectedScopes(defaultScopes)
      setCopied(false)
      toast.success('Token criado com sucesso.')
      router.refresh()
    })
  }

  function handleRevoke() {
    if (!clientToRevoke) return
    const id = clientToRevoke.id
    startRevoking(async () => {
      const response = await revokeApiClientAction(id)
      if (!response.success) {
        toast.error(response.message)
        return
      }

      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isActive: false } : item
        )
      )
      setClientToRevoke(null)
      toast.success('Token revogado. Ele não pode mais acessar a API.')
      router.refresh()
    })
  }

  async function copyToken() {
    if (!createdClient) return
    await navigator.clipboard.writeText(createdClient.token)
    setCopied(true)
    toast.success('Token copiado.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrações"
        description="Crie tokens para conectar o MCP Certifica ao Claude ou Codex."
      />

      <Alert>
        <ShieldCheck />
        <AlertTitle>O token aparece somente uma vez</AlertTitle>
        <AlertDescription>
          A API armazena apenas o hash. Se perder o token, revogue-o e crie
          outro. Nunca envie tokens em conversas ou arquivos versionados.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-5" />
            Novo token
          </CardTitle>
          <CardDescription>
            O token será vinculado à sua conta e respeitará as permissões
            selecionadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="integration-name">Nome da integração</Label>
              <Input
                id="integration-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Claude do escritório"
                maxLength={80}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="integration-expiration">Expiração</Label>
              <select
                id="integration-expiration"
                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={expiresInDays ?? 'never'}
                onChange={(event) =>
                  setExpiresInDays(
                    event.target.value === 'never'
                      ? null
                      : (Number(event.target.value) as 30 | 90 | 180 | 365)
                  )
                }
                disabled={isCreating}
              >
                <option value={30}>30 dias</option>
                <option value={90}>90 dias</option>
                <option value={180}>180 dias</option>
                <option value={365}>1 ano</option>
                <option value="never">Sem expiração</option>
              </select>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Permissões</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {scopes.map((scope) => (
                <label
                  key={scope.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-primary"
                    checked={selectedScopes.includes(scope.value)}
                    onChange={() => toggleScope(scope.value)}
                    disabled={isCreating}
                  />
                  <span>
                    <span className="block text-sm font-medium">
                      {scope.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {scope.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <Button
            onClick={handleCreate}
            disabled={
              isCreating ||
              name.trim().length < 3 ||
              selectedScopes.length === 0
            }
          >
            {isCreating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <KeyRound />
            )}
            Criar token
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tokens cadastrados</CardTitle>
          <CardDescription>
            Revogar um token interrompe imediatamente o acesso do MCP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum token cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Último uso</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((client) => {
                  const status = clientStatus(client)
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="font-medium">{client.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {client.id.slice(0, 8)}…
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'Ativo'
                              ? 'default'
                              : status === 'Expirado'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-sm flex-wrap gap-1">
                          {client.scopes.map((scope) => (
                            <Badge key={scope} variant="outline">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(client.lastUsedAt)}</TableCell>
                      <TableCell>
                        {client.expiresAt
                          ? formatDate(client.expiresAt)
                          : 'Sem expiração'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setClientToRevoke(client)}
                          disabled={status === 'Revogado' || isRevoking}
                        >
                          <Trash2 />
                          Revogar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!createdClient}
        onOpenChange={(open) => {
          if (!open) setCreatedClient(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guarde seu token agora</DialogTitle>
            <DialogDescription>
              Ele não poderá ser consultado novamente depois que esta janela
              fechar.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted p-3">
            <code className="block break-all text-sm">
              {createdClient?.token}
            </code>
          </div>
          <Alert>
            <KeyRound />
            <AlertTitle>Configuração do MCP</AlertTitle>
            <AlertDescription>
              Use este valor em <code>CERTIFICA_API_TOKEN</code>.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={copyToken}>
              {copied ? <Check /> : <Copy />}
              {copied ? 'Copiado' : 'Copiar token'}
            </Button>
            <Button onClick={() => setCreatedClient(null)}>
              Já guardei o token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!clientToRevoke}
        onOpenChange={(open) => {
          if (!open && !isRevoking) setClientToRevoke(null)
        }}
        onConfirm={handleRevoke}
        title="Revogar token"
        confirmLabel="Revogar"
        description={`Revogar “${clientToRevoke?.name ?? ''}” interromperá imediatamente o acesso dessa integração. Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}
