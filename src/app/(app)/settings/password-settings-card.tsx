import { Card, CardHeader } from '@/components/ui/card'

import PasswordForm from './password-form'

export default async function PasswordSettingsCard() {
  return (
    <Card className="max-w-3xl overflow-hidden">
      <CardHeader className="border-b">
        <h2 className="text-lg font-semibold">Segurança</h2>
        <p className="text-sm text-muted-foreground">
          Altere sua senha regularmente para manter a conta segura.
        </p>
      </CardHeader>
      <PasswordForm />
    </Card>
  )
}
