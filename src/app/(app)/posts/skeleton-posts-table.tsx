import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export default function SkeletonPostTable() {
  return (
    <>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-16 bg-zinc-300" />
          <div className="flex flex-col">
            <Skeleton className="h-4 w-64 bg-zinc-300" />
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-20 bg-zinc-300" />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-20 bg-zinc-300" />
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-4 w-18 bg-zinc-300" />
        </div>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-4 w-14 bg-zinc-300" />
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-4 w-18 bg-zinc-300" />
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" disabled>
            Editar
          </Button>
        </div>
      </TableCell>
    </>
  )
}
