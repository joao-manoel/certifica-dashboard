import { auth } from '@/auth/auth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import AvatarSettings from './avatar-settings'
import ProfileForm from './profile-form'

export default async function ProfileSettingsCard() {
  const { user } = await auth()

  return (
    <Card className="max-w-3xl overflow-hidden">
      <CardHeader className="border-b p-5">
        <h2 className="text-lg font-semibold">Perfil</h2>
        <p className="text-sm text-muted-foreground">
          Altera os dados do seu perfil.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-8 p-6">
        <div className="flex">
          {user && (
            <AvatarSettings
              user={{ name: user.name, username: user.username }}
              orientation="row"
            />
          )}
        </div>

        <div className="w-full">{user && <ProfileForm user={user} />}</div>
      </CardContent>
    </Card>
  )
}
