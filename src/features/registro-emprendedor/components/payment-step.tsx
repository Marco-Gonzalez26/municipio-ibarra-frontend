'use client'

import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWizardStore } from '../store/wizard.store'
import type { PagoForm } from '../types/wizard-form.type'

interface PaymentStepProps {
  onNext: () => void
}

export function PaymentStep({ onNext }: PaymentStepProps) {
  const pago = useWizardStore((state) => state.formData.pago)
  const updatePago = useWizardStore((state) => state.updatePayment)

  const { control, handleSubmit } = useForm<PagoForm>({
    defaultValues: pago,
  })

  function onSubmit(data: PagoForm) {
    updatePago(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Pago</h2>
        <p className="text-sm text-muted-foreground">
          Ingresa los datos del comprobante de pago para continuar con el
          registro
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="valor_pago_inicial"
          control={control}
          rules={{ required: 'El valor de pago es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Valor de Pago Inicial (USD) *
              </FieldLabel>
              <Input
                id={field.name}
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? null : Number(e.target.value)
                  )
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="codigo_pago"
          control={control}
          rules={{ required: 'El código de pago es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Código de Pago *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Número de referencia del comprobante"
                maxLength={25}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  )
}
