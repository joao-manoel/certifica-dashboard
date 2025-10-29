import { auth } from '@/auth/auth'
import PasswordForm from './password-form'

export default async function PasswordSettingsCard() {
  const { user } = await auth()
  return (
    <div className="rounded-2xl border bg-card shadow-sm max-w-3xl">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">Segurança</h2>
        <p className="text-sm text-muted-foreground">
          Altere sua senha regularmente para manter a conta segura.
        </p>
      </div>
      <PasswordForm />
    </div>
  )
}
