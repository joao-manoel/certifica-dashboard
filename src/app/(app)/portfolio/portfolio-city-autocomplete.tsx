'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, MapPin } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'

type IbgeCity = {
  id: number
  nome: string
  microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } }
  'regiao-imediata'?: { 'regiao-intermediaria'?: { UF?: { sigla?: string } } }
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function stateCode(city: IbgeCity) {
  return city.microrregiao?.mesorregiao?.UF?.sigla ?? city['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla ?? ''
}

async function listCities() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome')
  if (!response.ok) throw new Error('Não foi possível consultar os municípios.')
  return response.json() as Promise<IbgeCity[]>
}

export function PortfolioCityAutocomplete({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [focused, setFocused] = useState(false)
  const deferredValue = useDeferredValue(value)
  const query = useQuery({ queryKey: ['ibge', 'cities'], queryFn: listCities, staleTime: 24 * 60 * 60 * 1000, enabled: focused && deferredValue.trim().length >= 2 })
  const suggestions = useMemo(() => {
    const term = normalize(deferredValue.trim())
    if (term.length < 2) return []
    return (query.data ?? []).filter((city) => normalize(`${city.nome} ${stateCode(city)}`).includes(term)).slice(0, 8)
  }, [deferredValue, query.data])

  return <div className="relative">
    <Input value={value} maxLength={160} autoComplete="off" placeholder="Digite uma cidade" onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} onChange={(event) => onChange(event.target.value)} />
    {focused && value.trim().length >= 2 ? <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {query.isLoading ? <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Buscando cidades...</div> : suggestions.length ? suggestions.map((city) => { const uf = stateCode(city); const label = `${city.nome}${uf ? ` - ${uf}` : ''}`; return <button key={city.id} type="button" className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(label); setFocused(false) }}><MapPin className="size-4 text-muted-foreground" />{label}</button> }) : <p className="px-3 py-2 text-sm text-muted-foreground">Nenhuma cidade encontrada. Você ainda pode usar o texto digitado.</p>}
    </div> : null}
  </div>
}
