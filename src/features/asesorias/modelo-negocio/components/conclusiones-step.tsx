'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { ConclusionesForm } from '../types/cierre.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface ConclusionesStepProps {
  onNext: () => void
  onPrevious: () => void
}

export const ConclusionesStep = forwardRef<StepHandle, ConclusionesStepProps>(
  function ConclusionesStep({ onNext, onPrevious }, ref) {
    const updateConclusiones = useModeloNegocioWizardStore(
      (state) => state.updateConclusiones
    )

    const { control, handleSubmit, getValues } = useForm<ConclusionesForm>({
      defaultValues:
        useModeloNegocioWizardStore.getState().formData.conclusiones,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateConclusiones(getValues()),
    }))

    function onSubmit(data: ConclusionesForm) {
      updateConclusiones(data)
      onNext()
    }

    function onSaveDraft() {
      updateConclusiones(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Conclusiones"
          subtitle="Síntesis de factibilidad y proyección del emprendimiento."
        />

        <Controller
          name="conclusiones"
          control={control}
          rules={{ required: 'Las conclusiones son obligatorias' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Conclusiones *</FieldLabel>
              <Textarea {...field} id={field.name} rows={8} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
