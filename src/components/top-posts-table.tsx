'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ArrowUpRight } from 'lucide-react'
import { env } from '@/lib/env'
import { useMemo } from 'react'

type TopPost = { postId: string; title: string; slug: string; views: number }

export function TopPostsTable({ items }: { items: TopPost[] }) {
  const currentMonth = useMemo(() => {
    return new Date().toLocaleString('pt-BR', { month: 'long' })
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Top Posts (
          {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Nenhum dado nos últimos 30 dias.
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.postId}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.views}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`${env.NEXT_PUBLIC_BLOG_URL}/${p.slug}`}
                      target="_blank"
                      className="inline-flex"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
