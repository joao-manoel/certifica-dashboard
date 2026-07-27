'use client'

import { Check, Copy, ExternalLink, Terminal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

const packageName = 'certifica-mcp'
const packageVersion = '0.1.0'

function CodeBlock({
  label,
  value
}: {
  label: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success(`${label} copiado.`)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <span className="text-xs text-zinc-400">{label}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={copy}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
      <pre className="max-h-96 overflow-auto p-4 text-xs leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  )
}

export function McpInstallationGuide({
  apiUrl,
  apiKey
}: {
  apiUrl: string
  apiKey: string
}) {
  const codexConfig = `[mcp_servers.certifica]
enabled = true
required = true
command = "cmd"
args = ["/c", "npx", "-y", "${packageName}"]
startup_timeout_sec = 30.0

[mcp_servers.certifica.env]
CERTIFICA_API_URL = "${apiUrl}"
CERTIFICA_API_TOKEN = "COLE_SEU_TOKEN_CERTIFICA"
CERTIFICA_API_KEY = "${apiKey}"`

  const claudeConfig = `{
  "mcpServers": {
    "certifica": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "${packageName}"],
      "env": {
        "CERTIFICA_API_URL": "${apiUrl}",
        "CERTIFICA_API_TOKEN": "COLE_SEU_TOKEN_CERTIFICA",
        "CERTIFICA_API_KEY": "${apiKey}"
      }
    }
  }
}`

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="size-5" />
              Instalar o MCP Certifica
            </CardTitle>
            <CardDescription>
              Conecte o Claude ou Codex à API usando o pacote publicado no npm.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {packageName}@{packageVersion}
            </Badge>
            <Button size="sm" variant="outline" asChild>
              <a
                href={`https://www.npmjs.com/package/${packageName}`}
                target="_blank"
                rel="noreferrer"
              >
                npm
                <ExternalLink />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <ol className="grid gap-3 text-sm md:grid-cols-3">
          <li className="rounded-lg border p-3">
            <span className="mb-1 block font-medium">1. Prepare o ambiente</span>
            Instale o Node.js 20 ou mais recente.
          </li>
          <li className="rounded-lg border p-3">
            <span className="mb-1 block font-medium">2. Crie um token</span>
            Use o formulário abaixo e copie o token exibido.
          </li>
          <li className="rounded-lg border p-3">
            <span className="mb-1 block font-medium">3. Configure o cliente</span>
            Cole o token no lugar indicado e reinicie o cliente.
          </li>
        </ol>

        <Tabs defaultValue="codex">
          <TabsList className="grid w-full grid-cols-2 md:w-80">
            <TabsTrigger value="codex">Codex</TabsTrigger>
            <TabsTrigger value="claude">Claude</TabsTrigger>
          </TabsList>

          <TabsContent value="codex" className="space-y-4 pt-2">
            <div className="space-y-1 text-sm">
              <p className="font-medium">Configuração do Codex</p>
              <p className="text-muted-foreground">
                Abra <code>~/.codex/config.toml</code>, adicione o conteúdo
                abaixo e substitua <code>COLE_SEU_TOKEN_CERTIFICA</code>.
              </p>
            </div>
            <CodeBlock label="~/.codex/config.toml" value={codexConfig} />
            <p className="text-sm text-muted-foreground">
              Reinicie o Codex, abra uma nova tarefa e peça para listar as
              mídias ou os posts do Certifica.
            </p>
          </TabsContent>

          <TabsContent value="claude" className="space-y-4 pt-2">
            <div className="space-y-1 text-sm">
              <p className="font-medium">Configuração do Claude Code</p>
              <p className="text-muted-foreground">
                Crie ou atualize o arquivo <code>.mcp.json</code> do projeto e
                substitua <code>COLE_SEU_TOKEN_CERTIFICA</code>.
              </p>
            </div>
            <CodeBlock label=".mcp.json" value={claudeConfig} />
            <p className="text-sm text-muted-foreground">
              Reinicie o Claude Code e execute <code>/mcp</code> para confirmar
              que o servidor <code>certifica</code> está conectado.
            </p>
          </TabsContent>
        </Tabs>

        <Alert>
          <Terminal />
          <AlertTitle>Windows e outros sistemas</AlertTitle>
          <AlertDescription>
            Os exemplos acima estão prontos para Windows. No macOS ou Linux,
            troque <code>command</code> por <code>npx</code> e use somente{' '}
            <code>{`["-y", "${packageName}"]`}</code> em <code>args</code>.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
