'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { CanalesForm } from '../types/canvas.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface CanalesStepProps {
  onNext: () => void
  onPrevious: () => void
}

export const CanalesStep = forwardRef<StepHandle, CanalesStepProps>(
  function CanalesStep({ onNext, onPrevious }, ref) {
    const updateCanales = useModeloNegocioWizardStore(
      (state) => state.updateCanales
    )

    const { control, handleSubmit, getValues } = useForm<CanalesForm>({
      defaultValues: useModeloNegocioWizardStore.getState().formData.canales,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateCanales(getValues()),
    }))

    function onSubmit(data: CanalesForm) {
      updateCanales(data)
      onNext()
    }

    function onSaveDraft() {
      updateCanales(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Canales de distribución"
          subtitle="Cómo llega el producto al cliente."
        />

        <Controller
          name="canales"
          control={control}
          rules={{ required: 'Los canales de distribución son obligatorios' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Canales de distribución *
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
)
