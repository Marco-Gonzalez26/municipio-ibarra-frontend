'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Separator } from '@/components/ui/separator'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'
import {
  getCategoriasInsumo,
  getUnidadesMedida,
  getCategoriasInversion,
} from '../actions/catalogs.actions'
import type { CatalogoItem } from '@/types/catalog.type'

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
        item.categoriaId !== null &&
        Number(item.cantidad) > 0 &&
        Number(item.costoUnit) > 0
    ),
    fijos: data.fijos.filter(
      (item) => item.detalle.trim() !== '' && Number(item.valor) > 0
    ),
    inversion: data.inversion.filter(
      (item) => item.categoriaId !== null && Number(item.costo) > 0
    ),
  }
}

export const CostosStep = forwardRef<StepHandle, CostosStepProps>(
  function CostosStep({ onNext, onPrevious }, ref) {
    const updateCostos = useModeloNegocioWizardStore(
      (state) => state.updateCostos
    )

    const costos = useModeloNegocioWizardStore(
      (state) => state.formData.costos
    )

    const { control, handleSubmit, getValues, setValue } = useForm<CostosForm>({
      defaultValues: costos,
      values: costos,
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

function useCatalogs() {
  const [categoriasInsumo, setCategoriasInsumo] = useState<CatalogoItem[]>([])
  const [unidadesMedida, setUnidadesMedida] = useState<CatalogoItem[]>([])
  const [categoriasInversion, setCategoriasInversion] = useState<CatalogoItem[]>([])

  useEffect(() => {
    getCategoriasInsumo().then(setCategoriasInsumo)
    getUnidadesMedida().then(setUnidadesMedida)
    getCategoriasInversion().then(setCategoriasInversion)
  }, [])

  return { categoriasInsumo, unidadesMedida, categoriasInversion }
}

function InsumosTable({ control }: { control: Control<CostosForm> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'insumos',
  })
  const rows = useWatch({ control, name: 'insumos' }) ?? []
  const { categoriasInsumo, unidadesMedida } = useCatalogs()

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
                    name={`insumos.${index}.categoriaId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ''}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriasInsumo.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                    name={`insumos.${index}.unidadId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ''}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidadesMedida.map((u) => (
                            <SelectItem key={u.id} value={u.id.toString()}>
                              {u.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
            categoriaId: null,
            descripcion: '',
            cantidad: 0,
            unidadId: null,
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
  const { categoriasInversion } = useCatalogs()
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
                  name={`inversion.${index}.categoriaId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasInversion.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.descripcion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
        onClick={() => append({ categoriaId: null, descripcion: '', costo: 0 })}
      >
        + Agregar ítem de inversión
      </Button>
    </Field>
  )
}

function ProyeccionSection({
  control,
  setValue,
}: {
  control: Control<CostosForm>
  setValue: UseFormSetValue<CostosForm>
}) {
  const precio = useWatch({ control, name: 'proyeccion.precio' }) ?? 0
  const startUnits = useWatch({ control, name: 'proyeccion.startUnits' }) ?? 0
  const growth = useWatch({ control, name: 'proyeccion.growth' }) ?? 0
  const annualFixedCostIncrease = useWatch({ control, name: 'proyeccion.annualFixedCostIncrease' }) ?? 0
  const margen = useWatch({ control, name: 'proyeccion.margen' }) ?? 0

  const fijos = useWatch({ control, name: 'fijos' }) ?? []
  const insumos = useWatch({ control, name: 'insumos' }) ?? []
  const productos = useModeloNegocioWizardStore(
    (state) => state.formData.ingresos.productos
  )

  const costosFijosMensual =
    fijos.reduce((sum, row) => sum + (Number(row?.valor) || 0), 0)
  const costosFijosTrimestral = costosFijosMensual * 3

  const costoVariableUnitario = insumos.reduce(
    (sum, row) => sum + (Number(row?.costoUnit) || 0),
    0
  )

  useEffect(() => {
    setValue('proyeccion.costosFijos', Number(costosFijosTrimestral.toFixed(2)))
  }, [costosFijosTrimestral, setValue])

  useEffect(() => {
    setValue('proyeccion.costoVariableUnitario', Number(costoVariableUnitario.toFixed(2)))
  }, [costoVariableUnitario, setValue])

  const preciosValidos = productos
    .map((producto) => Number(producto.precio) || 0)
    .filter((p) => p > 0)
  const precioSugerido = preciosValidos.length
    ? Number(
        (
          preciosValidos.reduce((sum, p) => sum + p, 0) /
          preciosValidos.length
        ).toFixed(2)
      )
    : 0

  useEffect(() => {
    if (Number(precio) === 0 && precioSugerido > 0) {
      setValue('proyeccion.precio', precioSugerido)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioSugerido])

  const { filas, ingresosPorAnio } = calculateFinancialProjection({
    precio: Number(precio) || 0,
    startUnits: Number(startUnits) || 0,
    growth: Number(growth) || 0,
    annualFixedCostIncrease: Number(annualFixedCostIncrease) || 0,
    costosFijos: costosFijosTrimestral,
    costoVariableUnitario,
    margen: Number(margen) || 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel>Supuestos de proyección</FieldLabel>
        <p className="text-xs text-muted-foreground">
          Ingrese los valores para generar la proyección financiera a 5 años.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Controller
          name="proyeccion.precio"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Precio de venta unitario</FieldLabel>
              <NumberInput
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </Field>
          )}
        />

        <Controller
          name="proyeccion.startUnits"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Unidades iniciales / trimestre</FieldLabel>
              <NumberInput
                id={field.name}
                value={field.value}
                onChange={field.onChange}
                allowDecimals={false}
              />
            </Field>
          )}
        />

        <Controller
          name="proyeccion.growth"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Crecimiento trimestral (%)</FieldLabel>
              <NumberInput
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </Field>
          )}
        />

        <Controller
          name="proyeccion.annualFixedCostIncrease"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Aumento anual C. fijos (%)</FieldLabel>
              <NumberInput
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </Field>
          )}
        />

        <Controller
          name="proyeccion.margen"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Margen objetivo (%)</FieldLabel>
              <NumberInput
                id={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            </Field>
          )}
        />
      </div>

      <Separator />

      <div>
        <FieldLabel>Resultados calculados</FieldLabel>
        <p className="text-xs text-muted-foreground">
          Los costos fijos y variables se calculan automáticamente de las tablas anteriores.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Costos fijos (trim.)</p>
          <p className="mt-1 text-sm font-semibold">${costosFijosTrimestral.toFixed(2)}</p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Costo variable unitario</p>
          <p className="mt-1 text-sm font-semibold">${costoVariableUnitario.toFixed(2)}</p>
        </div>
      </div>

      <Separator />

      <FieldLabel>Proyección a 5 años (20 trimestres)</FieldLabel>

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
                Margen %
              </TableHead>
              <TableHead className="sticky top-0 bg-muted text-right">
                Ing. mensual
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
                <TableCell
                  className={
                    fila.margen < 0
                      ? 'text-right text-destructive'
                      : 'text-right'
                  }
                >
                  {fila.margen.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {money(fila.ingresoMensualPromedio)}
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
    </div>
  )
}
