'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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

type ChipsInputProps = {
  label: string
  name: string
  placeholder?: string
  defaultValues?: string[]
  disabled?: boolean
  /** Dispara sempre que a lista de chips mudar (sem duplicatas, já normalizada) */
  onChange?: (values: string[]) => void
  /** Se true, adiciona o que ficou digitado ao sair do input */
  addOnBlur?: boolean
}

export function ChipsInput({
  label,
  name,
  placeholder,
  defaultValues = [],
  disabled,
  onChange,
  addOnBlur = true
}: ChipsInputProps) {
  const [items, setItems] = useState<string[]>(defaultValues)
  const [text, setText] = useState('')

  // Atualiza quando defaultValues mudar (ex.: tela de edição abrindo dados do servidor)
  useEffect(() => {
    setItems(defaultValues)
  }, [defaultValues])

  // Notifica o pai sempre que items mudar
  useEffect(() => {
    onChange?.(items)
  }, [items, onChange])

  const addMany = useCallback(
    (raw: string) => {
      const candidates = raw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (!candidates.length) return

      // evita duplicatas por slug
      const map = new Map(items.map((v) => [slugify(v), v]))
      for (const v of candidates) {
        map.set(slugify(v), v)
      }
      setItems(Array.from(map.values()))
      setText('')
    },
    [items]
  )

  const addOne = useCallback((value: string) => addMany(value), [addMany])

  const remove = useCallback((v: string) => {
    setItems((prev) => prev.filter((i) => i !== v))
  }, [])

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
              onClick={() => remove(v)}
              aria-label={`Remover ${v}`}
              disabled={disabled}
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
            addOne(text)
          }
        }}
        onBlur={() => {
          if (addOnBlur && text.trim()) addOne(text)
        }}
        onPaste={(e) => {
          // permite colar "foo, bar, baz" de uma vez
          const pasted = e.clipboardData.getData('text')
          if (pasted && pasted.match(/[,|\n]/)) {
            e.preventDefault()
            addMany(pasted)
          }
        }}
        placeholder={placeholder ?? 'Digite e pressione Enter'}
        disabled={disabled}
      />

      {/* hidden inputs para FormData.getAll(name) */}
      {hiddenInputs}

      <p className="text-xs text-muted-foreground">
        Dica: use <kbd>Enter</kbd> ou vírgula para adicionar
      </p>
    </div>
  )
}
