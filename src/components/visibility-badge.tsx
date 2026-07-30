import { Earth, Link2, Lock } from 'lucide-react'

import type { Visibility } from '@/@types/types-posts'
import { Badge } from '@/components/ui/badge'

const visibilityConfig = {
  PUBLIC: { label: 'Público', icon: Earth },
  UNLISTED: { label: 'Não listado', icon: Link2 },
  PRIVATE: { label: 'Privado', icon: Lock }
} as const

export default function VisibilityBadge({
  visibility
}: {
  visibility: Visibility
}) {
  const config = visibilityConfig[visibility]
  const Icon = config.icon
  return (
    <Badge
      variant="outline"
      className="border-border bg-muted/50 text-muted-foreground"
    >
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  )
}
