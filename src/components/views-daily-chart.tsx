'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import { formatYYYYMMDDToBR } from '@/utils/date'

type Point = { day: string; value: number }

const chartConfig = {
  views: {
    label: 'Visualizações',
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig

export function ViewsDailyChart({ data }: { data: Point[] }) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        name: formatYYYYMMDDToBR(p.day),
        views: p.value
      })),
    [data]
  )

  const currentMonth = useMemo(() => {
    return new Date().toLocaleString('pt-BR', { month: 'long' })
  }, [])
  // Obtém o nome do mês atual em português (ex: "Novembro")

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle>
          Visualizações por Dia —{' '}
          {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-60">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={chartData}
            margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              axisLine={false}
              tickLine={false}
            />

            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#fillViews)"
              name={chartConfig.views.label}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
