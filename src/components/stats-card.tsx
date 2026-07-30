import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend
}: StatCardProps) {
  return (
    <Card className="shadow-xs transition-shadow hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="font-mono text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {(description || trend) && (
          <p className="text-xs text-primary">{trend || description}</p>
        )}
      </CardContent>
    </Card>
  )
}
