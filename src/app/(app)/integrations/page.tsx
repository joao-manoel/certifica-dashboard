import { KeyRound } from 'lucide-react'

import { auth } from '@/auth/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { listApiClients } from '@/http/api-clients'

import ApiClientsManager from './api-clients-manager'

export default async function IntegrationsPage() {
  const { user } = await auth()

  if (!user || user.role === 'USER') {
    return (
      <Alert variant="destructive">
        <KeyRound />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Apenas administradores e editores podem gerenciar integrações.
        </AlertDescription>
      </Alert>
    )
  }

  const { items } = await listApiClients()
  return <ApiClientsManager initialItems={items} />
}
