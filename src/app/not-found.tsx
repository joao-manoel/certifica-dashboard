'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background px-4">
      {/* Blobs de fundo (glass vibe) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_20%,rgba(255,255,255,0.08),transparent_60%)] dark:bg-[radial-gradient(600px_circle_at_50%_20%,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 dark:bg-neutral-900/20 dark:ring-white/10">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            <motion.div
              initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 12,
                delay: 0.05
              }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/20"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <AlertTriangle className="h-10 w-10 text-destructive drop-shadow" />
              </motion.div>
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Página não encontrada
              </h1>
              <p className="mt-2 text-balance text-muted-foreground">
                O recurso solicitado não existe ou foi movido. Verifique a URL
                ou volte para a página inicial.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="default" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para Início
                </Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground/80"
            >
              Erro <span className="font-mono">404</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
