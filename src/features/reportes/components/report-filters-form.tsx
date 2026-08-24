'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EntitySelectorConfig {
  paramName: string
  label: string
  placeholder: string
}

export function ReportFiltersForm({
  slug,
  entitySelector,
  entityOptions,
}: {
  slug: string
  entitySelector?: EntitySelectorConfig
  entityOptions?: { value: string; label: string }[]
}) {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [entityValue, setEntityValue] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (desde) params.set('desde', desde)
    if (hasta) params.set('hasta', hasta)
    if (entitySelector && entityValue) params.set(entitySelector.paramName, entityValue)

    window.location.href = `/api/reportes/${slug}/pdf?${params.toString()}`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:flex sm:flex-wrap sm:items-end">
        {entitySelector && entityOptions && (
          <Field>
            <FieldLabel htmlFor={entitySelector.paramName}>
              {entitySelector.label}
            </FieldLabel>
            <Select value={entityValue} onValueChange={setEntityValue}>
              <SelectTrigger id={entitySelector.paramName} className="sm:w-64">
                <SelectValue placeholder={entitySelector.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

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

      <Button
        type="submit"
        disabled={Boolean(entitySelector && !entityValue)}
      >
        <FileDown className="mr-2 size-4" />
        Generar PDF
      </Button>
    </form>
  )
}
