'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface PropuestaStepProps {
  onNext: () => void
  onPrevious: () => void
}

interface PropuestaFormValues {
  propuestaValor: string
  portafolio: { value: string }[]
}

export const PropuestaStep = forwardRef<StepHandle, PropuestaStepProps>(
  function PropuestaStep({ onNext, onPrevious }, ref) {
    const updatePropuesta = useModeloNegocioWizardStore(
      (state) => state.updatePropuesta
    )

    const stored = useModeloNegocioWizardStore.getState().formData.propuesta
    const { control, handleSubmit, getValues } = useForm<PropuestaFormValues>({
      defaultValues: {
        propuestaValor: stored.propuestaValor,
        portafolio: stored.portafolio.length
          ? stored.portafolio.map((value) => ({ value }))
          : [{ value: '' }],
      },
    })
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'portafolio',
    })

    function toStoreShape(data: PropuestaFormValues) {
      return {
        propuestaValor: data.propuestaValor,
        portafolio: data.portafolio.map((item) => item.value).filter(Boolean),
      }
    }

    useImperativeHandle(ref, () => ({
      saveDraft: () => updatePropuesta(toStoreShape(getValues())),
    }))

    function onSubmit(data: PropuestaFormValues) {
      updatePropuesta(toStoreShape(data))
      onNext()
    }

    function onSaveDraft() {
      updatePropuesta(toStoreShape(getValues()))
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Propuesta de valor"
          subtitle="Qué hace única a la oferta y el portafolio de productos."
        />

        <Controller
          name="propuestaValor"
          control={control}
          rules={{ required: 'La propuesta de valor es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Descripción de la propuesta de valor *
              </FieldLabel>
              <Textarea {...field} id={field.name} rows={6} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Portafolio de productos</FieldLabel>
          <div className="space-y-2">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <Controller
                  name={`portafolio.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} className="flex-1" />
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
            + Agregar producto
          </Button>
        </Field>

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
