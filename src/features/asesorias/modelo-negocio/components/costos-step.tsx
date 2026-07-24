'use client'

import { forwardRef, useEffect, useImperativeHandle } from 'react'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { CostosForm } from '../types/canvas.type'
import { calculateFinancialProjection } from '../utils/financial-projection'
import { NumberInput } from '@/components/ui/number-input'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface CostosStepProps {
  onNext: () => void
  onPrevious: () => void
}

function money(value: number) {
  return `$${value.toFixed(2)}`
}

function limpiarCostos(data: CostosForm): CostosForm {
  return {
    ...data,
    insumos: data.insumos.filter(
      (item) =>
        item.categoria.trim() !== '' &&
        Number(item.cantidad) > 0 &&
        Number(item.costoUnit) > 0
    ),
    fijos: data.fijos.filter(
      (item) => item.detalle.trim() !== '' && Number(item.valor) > 0
    ),
    inversion: data.inversion.filter(
      (item) => item.categoria.trim() !== '' && Number(item.costo) > 0
    ),
  }
}

export const CostosStep = forwardRef<StepHandle, CostosStepProps>(
  function CostosStep({ onNext, onPrevious }, ref) {
    const updateCostos = useModeloNegocioWizardStore(
      (state) => state.updateCostos
    )

    const { control, handleSubmit, getValues, setValue } = useForm<CostosForm>({
      defaultValues: useModeloNegocioWizardStore.getState().formData.costos,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateCostos(limpiarCostos(getValues())),
    }))

    function onSubmit(data: CostosForm) {
      updateCostos(limpiarCostos(data))
      onNext()
    }

    function onSaveDraft() {
      updateCostos(limpiarCostos(getValues()))
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Estructura de costos"
          subtitle="Costos variables, fijos, inversión inicial y proyección financiera."
        />

        <InsumosTable control={control} />
        <FijosTable control={control} />
        <InversionTable control={control} />
        <ProyeccionSection control={control} setValue={setValue} />

        <StepFooter onPrevious={onPrevious} onSaveDraft={onSaveDraft} />
      </form>
    )
  }
)

function InsumosTable({ control }: { control: Control<CostosForm> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'insumos',
  })
  const rows = useWatch({ control, name: 'insumos' }) ?? []
  const total = rows.reduce(
    (sum, row) =>
      sum + (Number(row?.cantidad) || 0) * (Number(row?.costoUnit) || 0),
    0
  )

  return (
    <Field>
      <FieldLabel>Costos variables — insumos y materiales</FieldLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="w-20">Cant.</TableHead>
            <TableHead className="w-24">Unidad</TableHead>
            <TableHead className="w-28">C. unitario</TableHead>
            <TableHead className="w-28 text-right">C. total</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => {
            const row = rows[index]
            const rowTotal =
              (Number(row?.cantidad) || 0) * (Number(row?.costoUnit) || 0)
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Controller
                    name={`insumos.${index}.categoria`}
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`insumos.${index}.descripcion`}
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`insumos.${index}.cantidad`}
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        allowDecimals={false}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`insumos.${index}.unidad`}
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    name={`insumos.${index}.costoUnit`}
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {money(rowTotal)}
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
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right font-semibold">
              {money(total)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            categoria: '',
            descripcion: '',
            cantidad: 0,
            unidad: '',
            costoUnit: 0,
          })
        }
      >
        + Agregar insumo
      </Button>
    </Field>
  )
}

function FijosTable({ control }: { control: Control<CostosForm> }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'fijos' })
  const rows = useWatch({ control, name: 'fijos' }) ?? []
  const total = rows.reduce((sum, row) => sum + (Number(row?.valor) || 0), 0)

  return (
    <Field>
      <FieldLabel>Costos fijos mensuales</FieldLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Detalle</TableHead>
            <TableHead className="w-40 text-right">Valor mensual</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                <Controller
                  name={`fijos.${index}.detalle`}
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`fijos.${index}.valor`}
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
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right font-semibold">
              {money(total)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ detalle: '', valor: 0 })}
      >
        + Agregar costo fijo
      </Button>
    </Field>
  )
}

function InversionTable({ control }: { control: Control<CostosForm> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inversion',
  })
  const rows = useWatch({ control, name: 'inversion' }) ?? []
  const total = rows.reduce((sum, row) => sum + (Number(row?.costo) || 0), 0)

  return (
    <Field>
      <FieldLabel>Inversión inicial</FieldLabel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="w-36 text-right">Costo estimado</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                <Controller
                  name={`inversion.${index}.categoria`}
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`inversion.${index}.descripcion`}
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </TableCell>
              <TableCell>
                <Controller
                  name={`inversion.${index}.costo`}
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right font-semibold">
              {money(total)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ categoria: '', descripcion: '', costo: 0 })}
      >
        + Agregar ítem de inversión
      </Button>
    </Field>
  )
}

const SUPUESTOS: {
  id: keyof Omit<CostosForm['proyeccion'], 'costosFijos'>
  label: string
  prefix?: string
  suffix?: string
}[] = [
  { id: 'precio', label: 'Precio de venta', prefix: '$' },
  { id: 'growth', label: 'Crecimiento / trim.', suffix: '%' },
  { id: 'startUnits', label: 'Unidades T1' },
  { id: 'varRatio', label: 'Costos variables', suffix: '% ing.' },
  { id: 'margen', label: 'Margen de ganancia', suffix: '%' },
]

function ProyeccionSection({
  control,
  setValue,
}: {
  control: Control<CostosForm>
  setValue: UseFormSetValue<CostosForm>
}) {
  const supuestos = useWatch({ control, name: 'proyeccion' })
  const fijos = useWatch({ control, name: 'fijos' }) ?? []
  const productos = useModeloNegocioWizardStore(
    (state) => state.formData.ingresos.productos
  )

  const costosFijosTrimestral =
    fijos.reduce((sum, row) => sum + (Number(row?.valor) || 0), 0) * 3

  const preciosValidos = productos
    .map((producto) => Number(producto.precio) || 0)
    .filter((precio) => precio > 0)
  const precioSugerido = preciosValidos.length
    ? Number(
        (
          preciosValidos.reduce((sum, precio) => sum + precio, 0) /
          preciosValidos.length
        ).toFixed(2)
      )
    : 0

  useEffect(() => {
    setValue('proyeccion.costosFijos', Number(costosFijosTrimestral.toFixed(2)))
  }, [costosFijosTrimestral, setValue])

  useEffect(() => {
    if ((supuestos.precio ?? 0) === 0 && precioSugerido > 0) {
      setValue('proyeccion.precio', precioSugerido)
    }
    // Solo se autocompleta mientras el analista no haya escrito un precio propio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioSugerido])

  const { filas, ingresosPorAnio } = calculateFinancialProjection({
    ...supuestos,
    costosFijos: costosFijosTrimestral,
  })

  return (
    <Field>
      <FieldLabel>Proyección financiera (5 años · 20 trimestres)</FieldLabel>
      <p className="text-xs text-muted-foreground">
        Los valores se calculan automáticamente a partir de los supuestos.
        &quot;Costos fijos (trim.)&quot; se toma de la tabla de costos fijos
        mensuales de arriba y &quot;Precio de venta&quot; se sugiere a partir
        del precio promedio de tus productos.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <div className="rounded-lg border bg-muted/40 p-2.5">
          <p className="mb-1 text-[11px] text-muted-foreground">
            Costos fijos (trim.)
          </p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-muted-foreground">
              $
            </span>
            <span className="text-sm font-semibold text-foreground">
              {costosFijosTrimestral.toFixed(2)}
            </span>
          </div>
        </div>

        {SUPUESTOS.map((supuesto) => (
          <Controller
            key={supuesto.id}
            name={`proyeccion.${supuesto.id}`}
            control={control}
            render={({ field }) => (
              <div className="rounded-lg border bg-muted/40 p-2.5">
                <p className="mb-1 text-[11px] text-muted-foreground">
                  {supuesto.label}
                </p>
                <div className="flex items-center gap-1">
                  {supuesto.prefix && (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {supuesto.prefix}
                    </span>
                  )}
                  <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    className="h-auto rounded-none border-0 bg-transparent p-0 text-sm font-semibold text-foreground shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0"
                  />
                  {supuesto.suffix && (
                    <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                      {supuesto.suffix}
                    </span>
                  )}
                </div>
              </div>
            )}
          />
        ))}
      </div>

      <div className="max-h-80 overflow-y-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-muted">Año</TableHead>
              <TableHead className="sticky top-0 bg-muted">Trim.</TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                Unidades
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                Ingreso
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                C. fijos
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                C. variables
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                Utilidad neta
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                Beneficio mensual
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((fila, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{fila.anio}</TableCell>
                <TableCell className="text-muted-foreground">
                  T{fila.trimestre}
                </TableCell>
                <TableCell className="text-right">{fila.unidades}</TableCell>
                <TableCell className="text-right font-medium">
                  {money(fila.ingreso)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {money(fila.costosFijos)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {money(fila.costosVariables)}
                </TableCell>
                <TableCell
                  className={
                    fila.utilidadNeta < 0
                      ? 'text-right font-semibold text-destructive'
                      : 'text-right font-semibold'
                  }
                >
                  {money(fila.utilidadNeta)}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {money(fila.beneficioMensual)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {ingresosPorAnio.map((anual) => (
          <div key={anual.anio} className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Año {anual.anio}</p>
            <p className="mt-1 text-sm font-semibold text-primary">
              {money(anual.ingreso)}
            </p>
          </div>
        ))}
      </div>
    </Field>
  )
}
