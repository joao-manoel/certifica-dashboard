import { AlarmClockCheck, BookCheck, PencilLine } from 'lucide-react'

import type { PostStatus } from '@/@types/types-posts'
import { Badge } from '@/components/ui/badge'

const statusConfig = {
  PUBLISHED: {
    label: 'Publicado',
    icon: BookCheck,
    className: 'border-success/25 bg-success/10 text-success'
  },
  DRAFT: {
    label: 'Rascunho',
    icon: PencilLine,
    className: 'border-warning/25 bg-warning/10 text-warning-foreground'
  },
  SCHEDULED: {
    label: 'Agendado',
    icon: AlarmClockCheck,
    className: 'border-info/25 bg-info/10 text-info'
  }
} as const

export default function StatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  )
}
