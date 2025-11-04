'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  computeReadability,
  DEFAULT_TARGETS,
  type Status,
  type ReadabilityItem
} from '@/utils/readability-utils'
import { CheckCircle2, AlertTriangle, XCircle, Eye } from 'lucide-react'

function StatusDot({ status }: { status: Status }) {
  const cls =
    status === 'good'
      ? 'bg-emerald-500'
      : status === 'ok'
      ? 'bg-amber-500'
      : 'bg-red-500'
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} />
}

export function ReadabilityPanel({
  title,
  excerpt,
  html
}: {
  title: string
  excerpt: string
  html: string
}) {
  const { score, items, totals } = useMemo(
    () => computeReadability(html, title, excerpt, DEFAULT_TARGETS),
    [html, title, excerpt]
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Legibilidade
          <Badge variant="secondary" className="ml-2">
            {score}%
          </Badge>
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {totals.wordsTotal} palavras · {totals.sentences} frases ·{' '}
          {totals.paragraphs} parágrafos
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {items.map((it: ReadabilityItem) => (
          <div
            key={it.id}
            className="flex items-start justify-between gap-2 py-1"
          >
            <div className="flex items-start gap-2">
              <StatusDot status={it.status} />
              <span className="text-sm">{it.label}</span>
              {it.details && (
                <span title={it.details} className="text-muted-foreground">
                  <Eye className="ml-1 h-4 w-4 inline-block align-text-bottom" />
                </span>
              )}
            </div>
            <div className="shrink-0">
              {it.status === 'good' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {it.status === 'ok' && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              {it.status === 'bad' && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
