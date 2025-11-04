import type { Visibility } from '@/@types/types-posts'
import { Earth, Link2, Lock } from 'lucide-react'
import { Badge } from './ui/badge'

export default function VisibilityBadge({
  visibility
}: {
  visibility: Visibility
}) {
  if (visibility === 'PUBLIC') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-black">
        <Earth className="" />
        Publico
      </Badge>
    )
  } else if (visibility === 'UNLISTED') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-black">
        <Link2 />
        Não listado
      </Badge>
    )
  } else if (visibility === 'PRIVATE') {
    return (
      <Badge className="inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-black">
        <Lock />
        Privado
      </Badge>
    )
  }
}
