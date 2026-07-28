'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { IntroduccionForm } from '../types/documento.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface IntroduccionStepProps {
  onNext: () => void
  onPrevious: () => void
}

export const IntroduccionStep = forwardRef<StepHandle, IntroduccionStepProps>(
  function IntroduccionStep({ onNext, onPrevious }, ref) {
    const updateIntroduccion = useModeloNegocioWizardStore(
      (state) => state.updateIntroduccion
    )

    const { control, handleSubmit, getValues } = useForm<IntroduccionForm>({
      defaultValues:
        useModeloNegocioWizardStore.getState().formData.introduccion,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateIntroduccion(getValues()),
    }))

    function onSubmit(data: IntroduccionForm) {
      updateIntroduccion(data)
      onNext()
    }

    function onSaveDraft() {
      updateIntroduccion(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Introducción"
          subtitle="Origen, motivación y enfoque general del emprendimiento."
        />

        <Controller
          name="introduccion"
          control={control}
          rules={{ required: 'La reseña introductoria es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Reseña introductoria *
              </FieldLabel>
              <p className="text-xs text-muted-foreground">
                Describe el origen y la propuesta general del emprendimiento.
              </p>
              <Textarea {...field} id={field.name} rows={6} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="importancia"
          control={control}
          rules={{ required: 'La importancia del documento es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Importancia del documento *
              </FieldLabel>
              <Textarea {...field} id={field.name} rows={5} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
