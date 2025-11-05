export function formatYYYYMMDDToBR(s: string) {
  if (!/^\d{8}$/.test(s)) return s
  const y = Number(s.slice(0, 4))
  const m = Number(s.slice(4, 6)) - 1
  const d = Number(s.slice(6, 8))
  // cria a data em UTC e também exibe em UTC para não "voltar" um dia no BRT
  const dt = new Date(Date.UTC(y, m, d, 0, 0, 0, 0))
  return dt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC' // 👈 chave do conserto
  })
}
export function localDatetimeToUtcIso(local: string): string | undefined {
  if (!local?.trim()) return undefined
  // cria Date interpretando como horário local
  const [datePart, timePart] = local.split('T') ?? []
  if (!datePart || !timePart) return undefined
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = timePart.split(':').map(Number)
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0) // local time
  if (Number.isNaN(dt.getTime())) return undefined
  dt.setSeconds(0, 0) // higieniza
  return dt.toISOString() // UTC
}
