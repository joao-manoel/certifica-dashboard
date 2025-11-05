'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

type KV = { key: string | null; value: number }
type Props = {
  devices: KV[]
  browsers: KV[]
  os: KV[]
}

const COLORS = [
  '#5B8DEF',
  '#7CCBA2',
  '#F6BD60',
  '#F28482',
  '#B07CFF',
  '#7BDFF2',
  '#C9ADA7',
  '#84A59D'
]

function Donut({ title, data }: { title: string; data: KV[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0)
  const label = (v: string | null) => (v && v.trim().length ? v : '—')

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-muted-foreground">Total: {total}</div>
          <ul className="space-y-1">
            {data.map((d, i) => (
              <li
                key={`${title}-${i}`}
                className="flex items-center justify-between"
              >
                <span className="truncate">{label(d.key)}</span>
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
