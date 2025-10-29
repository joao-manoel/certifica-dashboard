import { auth } from '@/auth/auth'
import ProfileForm from './profile-form'

export default async function ProfileSettingsCard() {
  const { user } = await auth()

  return (
    <div className="rounded-2xl border bg-card shadow-sm max-w-3xl">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Informações visíveis na sua conta.
        </p>
      </div>

      <ProfileForm user={user!!} />
    </div>
  )
}
