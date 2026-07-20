'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { RelacionForm } from '../types/canvas.type'
import { StepFooter, StepHeader } from './step-shell'

interface RelacionStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function RelacionStep({ onNext, onPrevious }: RelacionStepProps) {
  const updateRelacion = useModeloNegocioWizardStore(
    (state) => state.updateRelacion
  )

  const { control, handleSubmit, getValues } = useForm<RelacionForm>({
    defaultValues: useModeloNegocioWizardStore.getState().formData.relacion,
  })

  function onSubmit(data: RelacionForm) {
    updateRelacion(data)
    onNext()
  }

  function onSaveDraft() {
    updateRelacion(getValues())
    toast.success('Borrador guardado')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title="Relación con clientes"
        subtitle="Cómo se construye y se mantiene el vínculo."
      />

      <Controller
        name="relacion"
        control={control}
        rules={{ required: 'La relación con clientes es obligatoria' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Relación con clientes *
            </FieldLabel>
            <Textarea {...field} id={field.name} rows={6} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
    </form>
  )
}
