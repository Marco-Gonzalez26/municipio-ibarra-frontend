export function getApiErrorMessage(
  error: unknown,
  fallback = 'Intente nuevamente.'
): string {
  if (error instanceof Error && error.message) return error.message
  if (
    typeof error === 'object' &&
    error !== null &&
    'msg' in error &&
    typeof (error as { msg: unknown }).msg === 'string'
  ) {
    return (error as { msg: string }).msg
  }
  return fallback
}
