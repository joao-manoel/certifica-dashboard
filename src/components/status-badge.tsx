import type { PostStatus } from '@/@types/types-posts'
import { AlarmClockCheck, BookCheck, Earth, PencilLine } from 'lucide-react'
import { Badge } from './ui/badge'

export default function StatusBadge({ status }: { status: PostStatus }) {
  if (status === 'PUBLISHED') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-black">
        <BookCheck className="" />
        Publicado
      </Badge>
    )
  } else if (status === 'DRAFT') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-yellow-800">
        <PencilLine />
        Rascunho
      </Badge>
    )
  } else if (status === 'SCHEDULED') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-orange-500">
        <AlarmClockCheck />
        Agendado
      </Badge>
    )
  }
}
