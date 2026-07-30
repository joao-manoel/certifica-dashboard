'use client'

import { Eye, FileText, type LucideIcon,TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { EngagementRadials } from '@/components/engagement'
import { PageHeader } from '@/components/page-header'
import { EmptyState, ErrorState, PageLoading } from '@/components/page-state'
import { StatCard } from '@/components/stats-card'
import { getMetrics, type MetricsResponse } from '@/http/get-metrics'

import { TopPostsTable } from './top-posts-table'
import { ViewsDailyChart } from './views-daily-chart'

interface Stat {
  name: string
  value: string
  change: string
  icon: LucideIcon
}

const initialStats: Stat[] = [
  {
    name: 'Posts publicados no mês',
    value: '0',
    change: '0%',
    icon: FileText
  },
  { name: 'Visualizações no mês', value: '0', change: '0%', icon: Eye },
  {
    name: 'Taxa de crescimento',
    value: '0%',
    change: '0%',
    icon: TrendingUp
  }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>(initialStats)
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    setHasError(false)

    try {
      const response = await getMetrics()
      const newStats: Stat[] = [
        {
          name: 'Posts publicados no mês',
          value: String(response.monthlyPublished.value),
          change: `${response.monthlyPublished.momDeltaPct.toFixed(1)}%`,
          icon: FileText
        },
        {
          name: 'Visualizações no mês',
          value: String(response.monthlyViews.value),
          change: `${response.monthlyViews.momDeltaPct >= 0 ? '+' : ''}${response.monthlyViews.momDeltaPct.toFixed(1)}%`,
          icon: Eye
        },
        {
          name: 'Taxa de crescimento',
          value: `${response.growthRateMonthly.toFixed(1)}%`,
          change: `${response.growthRateMonthly >= 0 ? '+' : ''}${response.growthRateMonthly.toFixed(1)}%`,
          icon: TrendingUp
        }
      ]

      setStats(newStats)
      setMetrics(response)
    } catch (error) {
      console.error('Erro ao carregar métricas do dashboard:', error)
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMetrics()
  }, [loadMetrics])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Acompanhe o desempenho do conteúdo no período atual."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {loading ? (
        <PageLoading cards={3} />
      ) : hasError ? (
        <ErrorState onRetry={() => void loadMetrics()} />
      ) : metrics ? (
        <div className="space-y-6">
          <ViewsDailyChart data={metrics.viewsDaily} />
          <TopPostsTable items={metrics.topPosts} />
          <EngagementRadials
            devices={metrics.engagement.devices}
            browsers={metrics.engagement.browsers}
            os={metrics.engagement.os}
          />
        </div>
      ) : (
        <EmptyState
          title="Ainda não há métricas"
          description="Os indicadores aparecerão quando o blog começar a registrar atividade."
        />
      )}
    </div>
  )
}
