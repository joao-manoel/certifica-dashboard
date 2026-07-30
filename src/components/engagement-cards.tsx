'use client'

import { PolarGrid, PolarRadiusAxis,RadialBar, RadialBarChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent} from '@/components/ui/chart'

type KV = { key: string | null; value: number }

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
]
const ringColor = (i: number) => COLORS[i % COLORS.length]
const labelOf = (v: string | null) => (v && v.trim().length ? v : '—')

export function RadialEngagementCard({
  title,
  data,
  maxRings = 6,
  chartHeight = 300, // altura maior
  baseInner = 40, // raio interno do 1º anel
  outerGrow = 80 // raio externo total a partir do inner
}: {
  title: string
  data: KV[]
  maxRings?: number
  chartHeight?: number
  baseInner?: number
  outerGrow?: number
  ringThickness?: number
}) {
  // Top N por valor
  const items = [...data].sort((a, b) => b.value - a.value).slice(0, maxRings)
  const total = items.reduce((acc, i) => acc + i.value, 0)
  const maxValue = Math.max(1, ...items.map((i) => i.value))

  // chartConfig obrigatório para o ChartTooltip do shadcn
  const chartConfig: ChartConfig = items.reduce((acc, it, i) => {
    acc[`ring${i}`] = { label: labelOf(it.key), color: ringColor(i) }
    return acc
  }, {} as ChartConfig)

  // Dados no formato 1 objeto com várias chaves (uma por anel)
  const chartData = [
    items.reduce(
      (obj, it, i) => {
        obj[`ring${i}`] = it.value
        return obj
      },
      { name: 'rings' } as Record<string, number | string>
    )
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-[minmax(300px,460px)_1fr] gap-6 items-center">
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: chartHeight }}
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={baseInner}
            outerRadius={baseInner + outerGrow}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="var(--border)"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, maxValue]}
              tick={false}
              axisLine={false}
            />

            {items.map((_, i) => (
              <RadialBar
                key={`ring-${i}`}
                dataKey={`ring${i}`}
                background
                cornerRadius={10}
                fill={ringColor(i)}
                stroke={ringColor(i)}
                // sem innerRadius/outerRadius aqui ➜ pertencem ao RadialBarChart
              />
            ))}

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    String(value),
                    chartConfig[name as keyof typeof chartConfig]?.label ?? '—'
                  ]}
                />
              }
            />
          </RadialBarChart>
        </ChartContainer>

        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">Total: {total}</div>
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: ringColor(i) }}
                  />
                  <span className="truncate">{labelOf(it.key)}</span>
                </div>
                <span className="tabular-nums">{it.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
