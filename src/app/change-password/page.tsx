import { redirect } from 'next/navigation'

import PasswordForm from '@/app/(app)/settings/password-form'
import { auth } from '@/auth/auth'
import Logo from '@/components/logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ChangePasswordPage() {
  const { user } = await auth()
  if (!user) redirect('/sign-in')
  if (!user.mustChangePassword) redirect('/')

  return (
    <main className="grid min-h-dvh place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          <Logo size="sm" />
          <div>
            <CardTitle>Defina sua senha pessoal</CardTitle>
            <CardDescription>
              Sua conta foi criada com uma senha temporária. Troque-a antes de acessar o painel.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <PasswordForm />
        </CardContent>
      </Card>
    </main>
  )
}
