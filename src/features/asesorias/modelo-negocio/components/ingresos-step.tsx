'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { IngresosForm } from '../types/canvas.type'
import { NumberInput } from '@/components/ui/number-input'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface IngresosStepProps {
  onNext: () => void
  onPrevious: () => void
}

function limpiarIngresos(data: IngresosForm): IngresosForm {
  return {
    ...data,
    productos: data.productos.filter(
      (item) => item.producto.trim() !== '' && Number(item.precio) > 0
    ),
  }
}

export const IngresosStep = forwardRef<StepHandle, IngresosStepProps>(
  function IngresosStep({ onNext, onPrevious }, ref) {
    const updateIngresos = useModeloNegocioWizardStore(
      (state) => state.updateIngresos
    )

    const ingresos = useModeloNegocioWizardStore(
      (state) => state.formData.ingresos
    )
    console.log({ ingresos })
    const { control, handleSubmit, getValues } = useForm<IngresosForm>({
      defaultValues: ingresos,
      values: ingresos,
    })
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'productos',
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateIngresos(limpiarIngresos(getValues())),
    }))

    function onSubmit(data: IngresosForm) {
      updateIngresos(limpiarIngresos(data))
      onNext()
    }

    function onSaveDraft() {
      updateIngresos(limpiarIngresos(getValues()))
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Fuentes de ingreso"
          subtitle="De dónde provienen los ingresos y los precios por producto."
        />

        <Controller
          name="ingresosTexto"
          control={control}
          rules={{
            required: 'La descripción de las fuentes de ingreso es obligatoria',
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Descripción de las fuentes de ingreso *
              </FieldLabel>
              <Textarea {...field} id={field.name} rows={5} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Productos y precios</FieldLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Producto</TableHead>
                <TableHead className="w-32">Precio</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Controller
                      name={`productos.${index}.producto`}
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`productos.${index}.precio`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      ×
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ producto: '', descripcion: '', precio: 0 })}
          >
            + Agregar producto
          </Button>
        </Field>

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)
