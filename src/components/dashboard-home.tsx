'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Eye, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { StatCard } from '@/components/stats-card'

const stats = [
  {
    name: 'Total de Posts',
    value: '0',
    change: '0%',
    icon: FileText
  },
  {
    name: 'Usuários Ativos',
    value: '1',
    change: '+0%',
    icon: Users
  },
  {
    name: 'Visualizações',
    value: '0',
    change: '+0%',
    icon: Eye
  },
  {
    name: 'Taxa de Crescimento',
    value: '0%',
    change: '+0%',
    icon: TrendingUp
  }
]

const visitData = [
  { name: 'Jan', visitas: 4000 },
  { name: 'Fev', visitas: 3000 },
  { name: 'Mar', visitas: 5000 },
  { name: 'Abr', visitas: 4500 },
  { name: 'Mai', visitas: 6000 },
  { name: 'Jun', visitas: 5500 }
]

const postData = [
  { name: 'Seg', posts: 12 },
  { name: 'Ter', posts: 19 },
  { name: 'Qua', posts: 15 },
  { name: 'Qui', posts: 25 },
  { name: 'Sex', posts: 22 },
  { name: 'Sáb', posts: 18 },
  { name: 'Dom', posts: 10 }
]

export default function AdminDashboard() {
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
    </div>
  )
}
