'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function ReportFiltersForm({ slug }: { slug: string }) {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (desde) params.set('desde', desde)
    if (hasta) params.set('hasta', hasta)

    window.location.href = `/api/reportes/${slug}/pdf?${params.toString()}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:flex sm:flex-wrap sm:items-end">
        <Field>
          <FieldLabel htmlFor="desde">Desde</FieldLabel>
          <Input
            id="desde"
            type="date"
            value={desde}
            max={hasta || undefined}
            onChange={(event) => setDesde(event.target.value)}
            className="sm:w-40"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="hasta">Hasta</FieldLabel>
          <Input
            id="hasta"
            type="date"
            value={hasta}
            min={desde || undefined}
            onChange={(event) => setHasta(event.target.value)}
            className="sm:w-40"
          />
        </Field>
      </div>

      <Button type="submit">
        <FileDown className="mr-2 size-4" />
        Generar PDF
      </Button>
    </form>
  )
}
