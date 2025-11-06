import { auth } from '@/auth/auth'
import ProfileForm from './profile-form'
import AvatarSettings from './avatar-settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function ProfileSettingsCard() {
  const { user } = await auth()

  return (
    <Card className="overflow-hidden max-w-3xl">
      <CardHeader className="border-b p-5">
        <h2 className="text-lg font-semibold">Perfil</h2>
        <p className="text-sm text-muted-foreground">
          Altera os dados do seu perfil.
        </p>
      </CardHeader>

      <CardContent className="p-6 flex flex-col gap-8">
        {/* Avatar na parte superior */}
        <div className="flex">
          <AvatarSettings
            user={{ name: user?.name!!, username: user?.username!! }}
            orientation="row"
          />
        </div>

        {/* Formulário logo abaixo */}
        <div className="w-full">
          <ProfileForm user={user!!} />
        </div>
      </CardContent>
    </Card>
  )
}
