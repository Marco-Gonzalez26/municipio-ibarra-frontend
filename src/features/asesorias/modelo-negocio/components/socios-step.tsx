'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { SociosForm } from '../types/canvas.type'
import { StepFooter, StepHeader } from './step-shell'

interface SociosStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function SociosStep({ onNext, onPrevious }: SociosStepProps) {
  const updateSocios = useModeloNegocioWizardStore(
    (state) => state.updateSocios
  )

  const { control, handleSubmit, getValues } = useForm<SociosForm>({
    defaultValues: useModeloNegocioWizardStore.getState().formData.socios,
  })

  function onSubmit(data: SociosForm) {
    updateSocios(data)
    onNext()
  }

  function onSaveDraft() {
    updateSocios(getValues())
    toast.success('Borrador guardado')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title="Socios clave"
        subtitle="Apoyos, alianzas y colaboradores."
      />

      <Controller
        name="socios"
        control={control}
        rules={{ required: 'Los socios clave son obligatorios' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Socios clave *</FieldLabel>
            <Textarea {...field} id={field.name} rows={6} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
    </form>
  )
}
