// src/http/get-metrics.ts
import { api } from './api-client'

export interface MonthlyMetric {
  value: number
  prev: number
  momDeltaPct: number
}

export interface DailyPoint {
  day: string // yyyyMMdd
  value: number
}

export interface KeyValue {
  key: string | null
  value: number
}

export interface Engagement {
  devices: KeyValue[]
  browsers: KeyValue[]
  os: KeyValue[]
  countries: KeyValue[]
  referrers: KeyValue[]
}

export interface TopPost {
  postId: string
  title: string
  slug: string
  views: number
}

/**
 * Métricas consolidadas do mês atual.
 */
export interface MetricsResponse {
  monthlyPublished: MonthlyMetric
  monthlyViews: MonthlyMetric
  growthRateMonthly: number
  viewsDaily: DailyPoint[]
  engagement: Engagement
  topPosts: TopPost[]
}

export async function getMetrics() {
  const result = await api.get('blog/metrics').json<MetricsResponse>()
  return result
}
