import { Skeleton } from '@/components/ui/skeleton'

export default function IntegrationsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  )
}
