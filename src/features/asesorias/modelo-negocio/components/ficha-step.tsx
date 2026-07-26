'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { FichaContexto, FichaForm } from '../types/ficha.type'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface FichaStepProps {
  contexto: FichaContexto
  onNext: () => void
}

export const FichaStep = forwardRef<StepHandle, FichaStepProps>(
  function FichaStep({ contexto, onNext }, ref) {
    const updateFicha = useModeloNegocioWizardStore(
      (state) => state.updateFicha
    )

    const { control, handleSubmit, getValues } = useForm<FichaForm>({
      defaultValues: useModeloNegocioWizardStore.getState().formData.ficha,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateFicha(getValues()),
    }))

    function onSubmit(data: FichaForm) {
      updateFicha(data)
      onNext()
    }

    function onSaveDraft() {
      updateFicha(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Ficha del emprendimiento"
          subtitle="Datos generales del emprendedor y del trámite. Los campos resaltados provienen del registro previo."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoItem
            label="Nombre del emprendedor"
            value={contexto.nombreEmprendedor}
          />
          <InfoItem label="Cédula" value={contexto.cedula} />
          <InfoItem label="Contacto" value={contexto.contacto} />
          <InfoItem label="Correo electrónico" value={contexto.correo} />
          <InfoItem label="Fecha de ingreso" value={contexto.fechaIngreso} />
          <InfoItem
            label="Nombre del emprendimiento"
            value={contexto.nombreEmprendimiento ?? 'Sin nombre registrado'}
          />
          <InfoItem
            label="Sector"
            value={contexto.sector ?? 'Sin sector asignado'}
          />
          <InfoItem
            label="Dirección"
            value={contexto.direccion ?? 'Sin dirección registrada'}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="numeroTramite"
            control={control}
            rules={{ required: 'El número de trámite es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>N.º de trámite *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="ATPE-00071-2025"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="productoLinea"
            control={control}
            rules={{ required: 'El producto o línea es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Producto / línea *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Elaboración de bolos"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="analista"
            control={control}
            rules={{ required: 'El analista responsable es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Analista responsable *
                </FieldLabel>
                <Input {...field} id={field.name} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="observaciones"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                rows={3}
                placeholder="Notas internas del analista (opcional)."
              />
            </Field>
          )}
        />

        <StepFooter onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}
