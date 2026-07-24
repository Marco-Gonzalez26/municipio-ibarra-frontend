'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { RecursosForm } from '../types/canvas.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface RecursosStepProps {
  onNext: () => void
  onPrevious: () => void
}

export const RecursosStep = forwardRef<StepHandle, RecursosStepProps>(
  function RecursosStep({ onNext, onPrevious }, ref) {
    const updateRecursos = useModeloNegocioWizardStore(
      (state) => state.updateRecursos
    )

    const { control, handleSubmit, getValues } = useForm<RecursosForm>({
      defaultValues: useModeloNegocioWizardStore.getState().formData.recursos,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateRecursos(getValues()),
    }))

    function onSubmit(data: RecursosForm) {
      updateRecursos(data)
      onNext()
    }

    function onSaveDraft() {
      updateRecursos(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Recursos clave"
          subtitle="Recursos financieros, físicos e infraestructura."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="recursosFinancieros"
            control={control}
            rules={{ required: 'Los recursos financieros son obligatorios' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Recursos financieros *
                </FieldLabel>
                <Textarea {...field} id={field.name} rows={4} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="recursosFisicos"
            control={control}
            rules={{ required: 'Los recursos físicos son obligatorios' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Recursos materiales / físicos *
                </FieldLabel>
                <Textarea {...field} id={field.name} rows={4} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="mobiliario"
            control={control}
            rules={{ required: 'El mobiliario funcional es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Mobiliario funcional *
                </FieldLabel>
                <Textarea {...field} id={field.name} rows={3} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="local"
            control={control}
            rules={{ required: 'El local o punto de operación es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Local / punto de operación *
                </FieldLabel>
                <Textarea {...field} id={field.name} rows={3} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
