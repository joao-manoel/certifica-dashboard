'use client'

import { useEffect, useState } from 'react'
import { FileText, Eye, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/stats-card'
import { getMetrics, type MetricsResponse } from '@/http/get-metrics'
import { Card } from '@/components/ui/card'
import { ViewsDailyChart } from './views-daily-chart'
import { EngagementCards } from './engagement-cards'
import { TopPostsTable } from './top-posts-table'

interface Stat {
  name: string
  value: string
  change: string
  icon: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([
    {
      name: 'Total de Posts Publicados',
      value: '0',
      change: '0%',
      icon: FileText
    },
    {
      name: 'Total de Posts Publicado Mensal',
      value: '0',
      change: '0%',
      icon: FileText
    },
    { name: 'Visualizações', value: '0', change: '+0%', icon: Eye },
    {
      name: 'Taxa de Crescimento',
      value: '0%',
      change: '+0%',
      icon: TrendingUp
    }
  ])

  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getMetrics()

        const newStats: Stat[] = [
          {
            name: 'Total de Posts Publicados',
            value: String(res.totalPublished),
            change: `${res.monthlyPublished.momDeltaPct.toFixed(1)}%`,
            icon: FileText
          },
          {
            name: 'Total de Posts Publicado Mensal',
            value: String(res.monthlyPublished.value),
            change: `${res.monthlyPublished.momDeltaPct.toFixed(1)}%`,
            icon: FileText
          },
          {
            name: 'Visualizações',
            value: String(res.monthlyViews.value),
            change: `${
              res.monthlyViews.momDeltaPct >= 0 ? '+' : ''
            }${res.monthlyViews.momDeltaPct.toFixed(1)}%`,
            icon: Eye
          },
          {
            name: 'Taxa de Crescimento',
            value: `${res.growthRateMonthly.toFixed(1)}%`,
            change: `${
              res.growthRateMonthly >= 0 ? '+' : ''
            }${res.growthRateMonthly.toFixed(1)}%`,
            icon: TrendingUp
          }
        ]

        setStats(newStats)
        setMetrics(res)
      } catch (err) {
        console.error('Erro ao carregar métricas do dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das métricas e atividades
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
            trend={`${stat.change} em relação ao mês anterior`}
          />
        ))}
      </div>

      {/* Charts & tables */}
      {loading ? (
        <Card className="h-40 grid place-content-center text-muted-foreground">
          Carregando métricas…
        </Card>
      ) : metrics ? (
        <div className="space-y-6">
          <ViewsDailyChart data={metrics.viewsDaily} />
          <EngagementCards
            devices={metrics.engagement.devices}
            browsers={metrics.engagement.browsers}
            os={metrics.engagement.os}
          />
          <TopPostsTable items={metrics.topPosts} />
        </div>
      ) : (
        <Card className="h-40 grid place-content-center text-muted-foreground">
          Sem dados
        </Card>
      )}
    </div>
  )
}
