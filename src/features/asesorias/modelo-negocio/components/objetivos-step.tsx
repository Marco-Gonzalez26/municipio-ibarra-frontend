'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface ObjetivosStepProps {
  onNext: () => void
  onPrevious: () => void
}

interface ObjetivosFormValues {
  objetivoGeneral: string
  objetivosEspecificos: { value: string }[]
}

export const ObjetivosStep = forwardRef<StepHandle, ObjetivosStepProps>(
  function ObjetivosStep({ onNext, onPrevious }, ref) {
    const updateObjetivos = useModeloNegocioWizardStore(
      (state) => state.updateObjetivos
    )

    const stored = useModeloNegocioWizardStore.getState().formData.objetivos
    const { control, handleSubmit, getValues } = useForm<ObjetivosFormValues>({
      defaultValues: {
        objetivoGeneral: stored.objetivoGeneral,
        objetivosEspecificos: stored.objetivosEspecificos.length
          ? stored.objetivosEspecificos.map((value) => ({ value }))
          : [{ value: '' }],
      },
    })
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'objetivosEspecificos',
    })

    function toStoreShape(data: ObjetivosFormValues) {
      return {
        objetivoGeneral: data.objetivoGeneral,
        objetivosEspecificos: data.objetivosEspecificos
          .map((item) => item.value)
          .filter(Boolean),
      }
    }

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateObjetivos(toStoreShape(getValues())),
    }))

    function onSubmit(data: ObjetivosFormValues) {
      updateObjetivos(toStoreShape(data))
      onNext()
    }

    function onSaveDraft() {
      updateObjetivos(toStoreShape(getValues()))
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Objetivos"
          subtitle="Objetivo general y objetivos específicos del modelo de negocio."
        />

        <Controller
          name="objetivoGeneral"
          control={control}
          rules={{ required: 'El objetivo general es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Objetivo general *</FieldLabel>
              <Textarea {...field} id={field.name} rows={4} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Objetivos específicos</FieldLabel>
          <p className="text-xs text-muted-foreground">
            Agrega cada objetivo como un punto independiente.
          </p>
          <div className="space-y-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="mt-2 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <Controller
                  name={`objetivosEspecificos.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} rows={2} className="flex-1" />
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ value: '' })}
          >
            + Agregar punto
          </Button>
        </Field>

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
