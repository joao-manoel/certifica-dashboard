import { LockKeyhole, Palette, UserRound } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AppearanceSettingsCard from './appearance-settings-card'
import PasswordSettingsCard from './password-settings-card'
import ProfileSettingsCard from './profile-settings-card'

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie seu perfil, segurança e preferências visuais."
      />
      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto p-1 sm:w-fit">
          <TabsTrigger value="profile" className="gap-2">
            <UserRound className="size-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <LockKeyhole className="size-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="size-4" />
            Aparência
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettingsCard />
        </TabsContent>
        <TabsContent value="security">
          <PasswordSettingsCard />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettingsCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
