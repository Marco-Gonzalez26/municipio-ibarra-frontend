// Formato de visualización DD/MM/YYYY en hora de Ecuador.
// No usa dateStyle/timeStyle para evitar "14 sept 2026, 5:05 p. m."
// separator permite el estilo local con guiones: DD-MM-YYYY.
export function formatDate(value?: string | null, separator = '/'): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const formatted = new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Guayaquil',
  }).format(date)
  return separator === '/' ? formatted : formatted.split('/').join(separator)
}

// Formato de visualización DD-MM-YYYY HH:mm en hora de Ecuador.
// Sin nombres de mes: siempre numérico con guiones.
export function formatDateTime(value?: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const parts = new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Guayaquil',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get('minute')}`
}

// true si la fecha YYYY-MM-DD ya pasó (vencida). null/undefined = sin vencimiento.
export function isDateExpired(value?: string | null): boolean {
  if (!value) return false
  const today = toLocalDate(new Date().toISOString())
  if (!today) return false
  return value.slice(0, 10) < today
}

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
