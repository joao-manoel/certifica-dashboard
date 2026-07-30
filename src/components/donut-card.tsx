'use client'

import { Cell,Pie, PieChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

type KV = { key: string | null; value: number }

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)'
]
const color = (i: number) => COLORS[i % COLORS.length]
const label = (v: string | null) => (v && v.trim().length ? v : '—')

export function DonutCard({
  title,
  data,
  maxSlices = 6,
  height = 320,
  innerRadius = 70,
  outerRadius = 105,
  className,
  showCenter = true
}: {
  title: string
  data: KV[]
  maxSlices?: number
  height?: number
  innerRadius?: number
  outerRadius?: number
  className?: string
  showCenter?: boolean
}) {
  const slices = [...data].sort((a, b) => b.value - a.value).slice(0, maxSlices)
  const total = slices.reduce((acc, s) => acc + s.value, 0)

  const chartConfig: ChartConfig = {
    value: { label: 'Valor', color: COLORS[0] }
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-[minmax(280px,420px)_1fr] gap-6 items-center">
        <div className="relative w-full" style={{ height }}>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="key"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                stroke="var(--border)"
                strokeWidth={1}
                isAnimationActive={false}
              >
                {slices.map((_, i) => (
                  <Cell key={i} fill={color(i)} />
                ))}
              </Pie>

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => [
                      String(value),
                      label(item?.payload?.key as string | null)
                    ]}
                  />
                }
              />
            </PieChart>
          </ChartContainer>

          {showCenter && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-semibold tabular-nums">
                  {total}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          )}
        </div>

        {/* Legenda / Lista */}
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground">Total: {total}</div>
          <ul className="space-y-2">
            {slices.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: color(i) }}
                  />
                  <span className="truncate">{label(s.key)}</span>
                </div>
                <span className="tabular-nums">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
