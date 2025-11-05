'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'

type KV = { key: string | null; value: number }
type Props = {
  devices: KV[]
  browsers: KV[]
  os: KV[]
}

// Paleta independente do tema (tons contrastantes)
const FIXED_COLORS = [
  '#3b82f6', // azul
  '#10b981', // verde
  '#f59e0b', // amarelo
  '#ef4444', // vermelho
  '#8b5cf6', // roxo
  '#0ea5e9', // ciano
  '#14b8a6', // teal
  '#f472b6', // rosa
  '#22c55e', // verde claro
  '#eab308', // dourado
  '#a855f7', // lilás
  '#f97316' // laranja
]

function sliceColor(i: number) {
  return FIXED_COLORS[i % FIXED_COLORS.length]
}

function Donut({ title, data }: { title: string; data: KV[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0)
  const label = (v: string | null) => (v && v.trim().length ? v : '—')

  const chartConfig = {
    value: { label: 'Visualizações', color: '#3b82f6' } // cor padrão azul
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <ChartContainer className="h-[180px] w-full" config={chartConfig}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              stroke="#1f2937" // borda cinza escuro
              strokeWidth={1}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={sliceColor(i)} />
              ))}
            </Pie>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => [
                    String(value),
                    (item?.payload?.key as string) || '—'
                  ]}
                />
              }
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-1 text-sm">
          <div className="text-muted-foreground">Total: {total}</div>
          <ul className="space-y-1">
            {data.map((d, i) => (
              <li
                key={`${title}-${i}`}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: sliceColor(i) }}
                  />
                  <span className="truncate">{label(d.key)}</span>
                </div>
                <span className="tabular-nums">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export function EngagementCards(props: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Donut title="Dispositivos" data={props.devices} />
      <Donut title="Navegadores" data={props.browsers} />
      <Donut title="Sistemas Operacionais" data={props.os} />
    </div>
  )
}
