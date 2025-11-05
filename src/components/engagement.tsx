'use client'

import { DonutCard } from './donut-card'

type KV = { key: string | null; value: number }

export function EngagementRadials({
  devices,
  browsers,
  os
}: {
  devices: KV[]
  browsers: KV[]
  os: KV[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DonutCard title="Dispositivos" data={devices} />
      <DonutCard title="Navegadores" data={browsers} />
      <DonutCard title="Sistemas Operacionais" data={os} />
    </div>
  )
}
