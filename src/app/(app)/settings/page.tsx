import PasswordSettingsCard from '@/app/(app)/settings/password-settings-card'
import ProfileSettingsCard from '@/app/(app)/settings/profile-settings-card'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <ProfileSettingsCard />
      <PasswordSettingsCard />
    </div>
  )
}
