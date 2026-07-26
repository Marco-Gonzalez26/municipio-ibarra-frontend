'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { ActividadesForm } from '../types/canvas.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface ActividadesStepProps {
  onNext: () => void
  onPrevious: () => void
}

export const ActividadesStep = forwardRef<StepHandle, ActividadesStepProps>(
  function ActividadesStep({ onNext, onPrevious }, ref) {
    const updateActividades = useModeloNegocioWizardStore(
      (state) => state.updateActividades
    )

    const { control, handleSubmit, getValues } = useForm<ActividadesForm>({
      defaultValues:
        useModeloNegocioWizardStore.getState().formData.actividades,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateActividades(getValues()),
    }))

    function onSubmit(data: ActividadesForm) {
      updateActividades(data)
      onNext()
    }

    function onSaveDraft() {
      updateActividades(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Actividades clave"
          subtitle="Tareas esenciales para producir y entregar."
        />

        <Controller
          name="actividades"
          control={control}
          rules={{ required: 'Las actividades clave son obligatorias' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Actividades clave *</FieldLabel>
              <Textarea {...field} id={field.name} rows={7} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
