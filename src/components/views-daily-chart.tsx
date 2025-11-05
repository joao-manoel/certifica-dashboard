'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import { formatYYYYMMDDToBR } from '@/utils/date'

type Point = { day: string; value: number }

export function ViewsDailyChart({ data }: { data: Point[] }) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        name: formatYYYYMMDDToBR(p.day),
        views: p.value
      })),
    [data]
  )

  return (
    <Card className="h-[320px]">
      <CardHeader>
        <CardTitle>Visualizações por Dia (30 dias)</CardTitle>
      </CardHeader>
      <CardContent className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopOpacity={0.35} />
                <stop offset="95%" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickMargin={8} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#viewsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
