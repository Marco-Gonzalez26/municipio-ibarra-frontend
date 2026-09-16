'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    toast.error('Ocurrió un error inesperado', {
      description: error.digest
        ? `Código de referencia: ${error.digest}`
        : 'Intente nuevamente más tarde.',
    })
  }, [error])

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-lg font-semibold">Ocurrió un error</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Intente nuevamente más tarde.
          {error.digest ? ` Código de referencia: ${error.digest}.` : ''}
        </p>
        <Button onClick={reset} variant="outline">
          Reintentar
        </Button>
      </body>
    </html>
  )
}
