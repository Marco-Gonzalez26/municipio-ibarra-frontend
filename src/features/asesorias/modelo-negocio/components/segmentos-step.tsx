'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { SegmentosForm } from '../types/canvas.type'
import { StepFooter, StepHeader } from './step-shell'

interface SegmentosStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function SegmentosStep({ onNext, onPrevious }: SegmentosStepProps) {
  const updateSegmentos = useModeloNegocioWizardStore(
    (state) => state.updateSegmentos
  )

  const { control, handleSubmit, getValues } = useForm<SegmentosForm>({
    defaultValues: useModeloNegocioWizardStore.getState().formData.segmentos,
  })

  function onSubmit(data: SegmentosForm) {
    updateSegmentos(data)
    onNext()
  }

  function onSaveDraft() {
    updateSegmentos(getValues())
    toast.success('Borrador guardado')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title="Segmentos de clientes"
        subtitle="A quién se dirige el producto."
      />

      <Controller
        name="segmentos"
        control={control}
        rules={{ required: 'La descripción de los segmentos es obligatoria' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Descripción de los segmentos *
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
