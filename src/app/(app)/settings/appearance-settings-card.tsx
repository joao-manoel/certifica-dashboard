'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme()
  return (
    <Card className="max-w-3xl">
      <CardHeader className="border-b">
        <CardTitle>Aparência</CardTitle>
        <p className="text-sm text-muted-foreground">
          Escolha como o painel deve aparecer neste dispositivo.
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <Label htmlFor="theme-select">Tema</Label>
          <p className="text-sm text-muted-foreground">
            O modo sistema acompanha a preferência do dispositivo.
          </p>
        </div>
        <Select value={theme ?? 'system'} onValueChange={setTheme}>
          <SelectTrigger id="theme-select" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <Sun className="size-4" /> Claro
            </SelectItem>
            <SelectItem value="dark">
              <Moon className="size-4" /> Escuro
            </SelectItem>
            <SelectItem value="system">
              <Laptop className="size-4" /> Sistema
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
