'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear + 11 - 1800 }, (_, index) => currentYear + 10 - index)

export function PortfolioYearPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Select value={value || 'none'} onValueChange={(next) => onChange(next === 'none' ? '' : next)}>
    <SelectTrigger><SelectValue placeholder="Selecionar ano" /></SelectTrigger>
    <SelectContent className="max-h-72"><SelectItem value="none">Não informado</SelectItem>{years.map((year) => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent>
  </Select>
}
