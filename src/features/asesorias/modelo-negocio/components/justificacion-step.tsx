'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { JustificacionForm } from '../types/documento.type'
import { StepFooter, StepHeader } from './step-shell'

interface JustificacionStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function JustificacionStep({
  onNext,
  onPrevious,
}: JustificacionStepProps) {
  const updateJustificacion = useModeloNegocioWizardStore(
    (state) => state.updateJustificacion
  )

  const { control, handleSubmit, getValues } = useForm<JustificacionForm>({
    defaultValues:
      useModeloNegocioWizardStore.getState().formData.justificacion,
  })

  function onSubmit(data: JustificacionForm) {
    updateJustificacion(data)
    onNext()
  }

  function onSaveDraft() {
    updateJustificacion(getValues())
    toast.success('Borrador guardado')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title="Justificación"
        subtitle="Por qué el emprendimiento y el modelo de negocio son necesarios."
      />

      <Controller
        name="justificacion"
        control={control}
        rules={{ required: 'La justificación es obligatoria' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Justificación *</FieldLabel>
            <Textarea {...field} id={field.name} rows={7} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
    </form>
  )
}
