'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ChipsInput({
  label,
  name, // ex.: "categoryNames" ou "tagNames"
  placeholder,
  defaultValues = [],
  disabled
}: {
  label: string
  name: string
  placeholder?: string
  defaultValues?: string[]
  disabled?: boolean
}) {
  const [items, setItems] = useState<string[]>(defaultValues)
  const [text, setText] = useState('')

  const add = (raw: string) => {
    const candidates = raw
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (!candidates.length) return
    const map = new Map(items.map((v) => [slugify(v), v]))
    candidates.forEach((v) => map.set(slugify(v), v))
    setItems(Array.from(map.values()))
    setText('')
  }

  const hiddenInputs = useMemo(
    () =>
      items.map((v, i) => (
        <input key={`${name}-${i}`} type="hidden" name={name} value={v} />
      )),
    [items, name]
  )

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {items.map((v) => (
          <Badge
            key={slugify(v)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {v}
            <button
              type="button"
              className="ml-1 opacity-70 hover:opacity-100"
              onClick={() => setItems(items.filter((i) => i !== v))}
              aria-label={`Remover ${v}`}
              disabled
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(text)
          }
        }}
        placeholder={placeholder ?? 'Digite e pressione Enter'}
      />

      {/* hidden para FormData.getAll(name) */}
      {hiddenInputs}

      <p className="text-xs text-muted-foreground">
        Dica: use <kbd>Enter</kbd> ou vírgula para adicionar
      </p>
    </div>
  )
}
