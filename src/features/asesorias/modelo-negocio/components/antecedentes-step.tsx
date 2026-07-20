'use client'

import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { AntecedentesForm } from '../types/documento.type'
import { StepFooter, StepHeader } from './step-shell'

interface AntecedentesStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function AntecedentesStep({
  onNext,
  onPrevious,
}: AntecedentesStepProps) {
  const updateAntecedentes = useModeloNegocioWizardStore(
    (state) => state.updateAntecedentes
  )

  const { control, handleSubmit, getValues } = useForm<AntecedentesForm>({
    defaultValues: useModeloNegocioWizardStore.getState().formData.antecedentes,
  })

  function onSubmit(data: AntecedentesForm) {
    updateAntecedentes(data)
    onNext()
  }

  function onSaveDraft() {
    updateAntecedentes(getValues())
    toast.success('Borrador guardado')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title="Antecedentes del emprendimiento"
        subtitle="Cómo nació la idea y su evolución inicial."
      />

      <Controller
        name="antecedentes"
        control={control}
        rules={{ required: 'Los antecedentes son obligatorios' }}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Antecedentes *</FieldLabel>
            <Textarea {...field} id={field.name} rows={7} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
    </form>
  )
}
