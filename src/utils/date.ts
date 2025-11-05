export function formatYYYYMMDDToBR(s: string) {
  if (!/^\d{8}$/.test(s)) return s
  const y = Number(s.slice(0, 4))
  const m = Number(s.slice(4, 6)) - 1
  const d = Number(s.slice(6, 8))
  const dt = new Date(Date.UTC(y, m, d, 0, 0, 0, 0))
  // exibe no fuso local do browser
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}


