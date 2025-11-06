import PasswordSettingsCard from '@/app/(app)/settings/password-settings-card'
import AvatarSettings from '@/app/(app)/settings/avatar-settings'
import { getProfile } from '@/http/get-profile' // sua função de fetch no server (ou passe via props)
import ProfileSettingsCard from './profile-settings-card'

// Se preferir Server Component pai:
export default async function SettingsPage() {
  // pegue o profile no server (sem presign) só pra ter name/username
  const { user } = await getProfile() // ou via loader que você já tenha

  return (
    <div className="flex flex-col gap-5">
      <ProfileSettingsCard />
      <PasswordSettingsCard />
    </div>
  )
}
