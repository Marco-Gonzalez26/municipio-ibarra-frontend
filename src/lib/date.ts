// Convierte un timestamp ISO del backend a YYYY-MM-DD en hora local,
// para poder compararlo contra un <input type="date">.
export function toLocalDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function isWithinDateRange(
  value: string,
  desde?: string,
  hasta?: string
): boolean {
  const localDate = toLocalDate(value)
  if (!localDate) return false

  if (desde && localDate < desde) return false
  if (hasta && localDate > hasta) return false

  return true
}
