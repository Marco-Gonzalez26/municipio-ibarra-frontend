'use client'

import { FormEvent, useMemo, useState, useTransition } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateEmprendimientoAction } from '../actions/update-emprendimiento.action'
import { deleteEmprendimientoAction } from '../actions/delete-emprendimiento.action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'

const ESTADO_MAP: Record<
  number,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
  }
> = {
  1: { label: 'INGRESADO', variant: 'secondary' },
  2: { label: 'PENDIENTE', variant: 'outline' },
  3: {
    label: 'APROBADO',
    variant: 'default',
    className: 'bg-green-600 text-white hover:bg-green-600/80',
  },
  4: { label: 'RECHAZADO', variant: 'destructive' },
}

interface EmprendimientosTableProps {
  entrepreneurs: Emprendedor[]
  formularios: FormularioReferenciaGeneral[]
}

type EmprendimientoFormValues = {
  id_emprendedor: number
  nombre_emprendimiento: string
  id_tipo_oferta: number | null
  id_estado_emprendedor: number
  codigo_pago: string
  valor_pago_inicial: number | null
  notas_adicionales: string
}

const EMPTY_FORM: EmprendimientoFormValues = {
  id_emprendedor: 0,
  nombre_emprendimiento: '',
  id_tipo_oferta: null,
  id_estado_emprendedor: 1,
  codigo_pago: '',
  valor_pago_inicial: null,
  notas_adicionales: '',
}

export function EmprendimientosTable({
  entrepreneurs,
  formularios,
}: EmprendimientosTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [, startTransition] = useTransition()
  const [selectedFormulario, setSelectedFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [editingFormulario, setEditingFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [deleteFormulario, setDeleteFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)

  const entrepreneursById = useMemo(
    () =>
      new Map(
        entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur])
      ),
    [entrepreneurs]
  )

  const filteredRows = formularios.filter((row) => {
    const searchString = `${row.nombre_emprendimiento}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  function getEntrepreneur(idEmprendedor: number) {
    return entrepreneursById.get(idEmprendedor) ?? null
  }

  function handleUpdate(id: number, values: EmprendimientoFormValues) {
    startTransition(async () => {
      try {
        await updateEmprendimientoAction(id, values)
        toast.success('Emprendimiento actualizado correctamente.')
        setEditingFormulario(null)
      } catch (error) {
        toast.error('No se pudo actualizar el emprendimiento', {
          description:
            error instanceof Error ? error.message : 'Intente nuevamente.',
        })
      }
    })
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      try {
        await deleteEmprendimientoAction(id)
        toast.success('Emprendimiento eliminado correctamente.')
      } catch (error) {
        toast.error('No se pudo eliminar el emprendimiento', {
          description:
            error instanceof Error ? error.message : 'Intente nuevamente.',
        })
      } finally {
        setDeleteFormulario(null)
      }
    })
  }

  return (
    <>
      <input
        type="text"
        placeholder="Buscar por emprendimiento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '8px',
          marginBottom: '20px',
          width: '400px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #d40924',
        }}
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table className="min-w-[52rem]">
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">ID</TableHead>
              <TableHead className="text-primary-foreground">
                Emprendimiento
              </TableHead>
              <TableHead className="text-primary-foreground">
                Emprendedor
              </TableHead>
              <TableHead className="text-primary-foreground">Cédula</TableHead>
              <TableHead className="text-primary-foreground">Tipo</TableHead>
              <TableHead className="text-primary-foreground">Estado</TableHead>
              <TableHead className="text-primary-foreground">Fecha</TableHead>
              <TableHead className="text-right text-primary-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRows.map((formulario) => {
              const emprendedor = getEntrepreneur(formulario.id_emprendedor)
              const estado =
                ESTADO_MAP[formulario.id_estado_emprendedor] ?? ESTADO_MAP[1]

              return (
                <TableRow key={formulario.id} className="text-center">
                  <TableCell className="font-medium text-primary">
                    EMPRE-{formulario.id}
                  </TableCell>
                  <TableCell>
                    {formulario.nombre_emprendimiento ?? 'Sin nombre'}
                  </TableCell>
                  <TableCell>
                    {emprendedor?.nombres_apellidos ?? 'No encontrado'}
                  </TableCell>
                  <TableCell>{emprendedor?.cedula ?? '-'}</TableCell>
                  <TableCell>
                    {getTipoOferta(formulario.id_tipo_oferta)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={estado.variant} className={estado.className}>
                      {estado.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(formulario.fecha_formulario)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedFormulario(formulario)}
                      >
                        <Eye className="size-4 text-blue-500" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingFormulario(formulario)}
                      >
                        <Pencil className="size-4 text-yellow-500" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteFormulario(formulario)}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {formularios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No existen emprendimientos registrados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <EmprendimientoDetailDialog
        formulario={selectedFormulario}
        entrepreneur={
          selectedFormulario
            ? getEntrepreneur(selectedFormulario.id_emprendedor)
            : null
        }
        onClose={() => setSelectedFormulario(null)}
      />

      <EmprendimientoFormDialog
        key={editingFormulario?.id ?? 'empty-emprendimiento'}
        open={Boolean(editingFormulario)}
        title="Editar emprendimiento"
        description="Actualiza visualmente los datos principales del emprendimiento."
        entrepreneurs={entrepreneurs}
        initialValues={toFormValues(editingFormulario)}
        onOpenChange={(open) => {
          if (!open) setEditingFormulario(null)
        }}
        onSubmit={(values) => {
          if (editingFormulario) handleUpdate(editingFormulario.id, values)
        }}
      />

      <DeleteEmprendimientoDialog
        formulario={deleteFormulario}
        onClose={() => setDeleteFormulario(null)}
        onConfirm={() => {
          if (deleteFormulario) handleDelete(deleteFormulario.id)
        }}
      />
    </>
  )
}

function EmprendimientoDetailDialog({
  formulario,
  entrepreneur,
  onClose,
}: {
  formulario: FormularioReferenciaGeneral | null
  entrepreneur: Emprendedor | null
  onClose: () => void
}) {
  return (
    <Dialog
      open={Boolean(formulario)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles del emprendimiento</DialogTitle>
          <DialogDescription>
            Información vinculada al formulario de referencia general.
          </DialogDescription>
        </DialogHeader>

        {formulario ? (
          <div className="grid gap-4 md:grid-cols-3">
            <InfoItem
              label="Nombre del emprendimiento"
              value={formulario.nombre_emprendimiento ?? 'Sin nombre'}
            />
            <InfoItem
              label="Emprendedor"
              value={entrepreneur?.nombres_apellidos ?? 'No encontrado'}
            />
            <InfoItem label="Cédula" value={entrepreneur?.cedula ?? '-'} />
            <InfoItem
              label="Tipo"
              value={getTipoOferta(formulario.id_tipo_oferta)}
            />
            <InfoItem
              label="Estado"
              value={
                ESTADO_MAP[formulario.id_estado_emprendedor]?.label ??
                'INGRESADO'
              }
            />
            <InfoItem
              label="Fecha"
              value={formatDate(formulario.fecha_formulario)}
            />
            <InfoItem
              label="Código de pago"
              value={formulario.codigo_pago || 'Sin código'}
            />
            <InfoItem
              label="Pago inicial"
              value={
                formulario.valor_pago_inicial
                  ? `$${formulario.valor_pago_inicial}`
                  : 'No registrado'
              }
            />
            <InfoItem
              label="Intención de mejorar"
              value={formulario.intencion_mejorar ? 'Sí' : 'No'}
            />
            <div className="md:col-span-3">
              <InfoItem
                label="Notas"
                value={formulario.notas_adicionales ?? 'Sin notas'}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function EmprendimientoFormDialog({
  open,
  title,
  description,
  entrepreneurs,
  initialValues,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  title: string
  description: string
  entrepreneurs: Emprendedor[]
  initialValues: EmprendimientoFormValues
  onOpenChange: (open: boolean) => void
  onSubmit: (values: EmprendimientoFormValues) => void
}) {
  const [values, setValues] = useState<EmprendimientoFormValues>(initialValues)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({
      ...values,
      id_emprendedor: Number(values.id_emprendedor),
      id_tipo_oferta: values.id_tipo_oferta
        ? Number(values.id_tipo_oferta)
        : null,
      id_estado_emprendedor: Number(values.id_estado_emprendedor),
      valor_pago_inicial:
        values.valor_pago_inicial === null ||
        values.valor_pago_inicial === undefined
          ? null
          : Number(values.valor_pago_inicial),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="id_emprendedor">Emprendedor</Label>
              <select
                id="id_emprendedor"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={values.id_emprendedor}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    id_emprendedor: Number(event.target.value),
                  }))
                }
                required
              >
                <option value={0}>Seleccione un emprendedor</option>
                {entrepreneurs.map((entrepreneur) => (
                  <option key={entrepreneur.id} value={entrepreneur.id}>
                    {entrepreneur.nombres_apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_emprendimiento">Nombre</Label>
              <Input
                id="nombre_emprendimiento"
                value={values.nombre_emprendimiento}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    nombre_emprendimiento: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_tipo_oferta">Tipo de oferta</Label>
              <select
                id="id_tipo_oferta"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={values.id_tipo_oferta ?? ''}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    id_tipo_oferta: event.target.value
                      ? Number(event.target.value)
                      : null,
                  }))
                }
              >
                <option value="">No especificado</option>
                <option value={1}>Productos</option>
                <option value={2}>Servicios</option>
                <option value={3}>Productos y servicios</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_estado_emprendedor">Estado</Label>
              <select
                id="id_estado_emprendedor"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={values.id_estado_emprendedor}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    id_estado_emprendedor: Number(event.target.value),
                  }))
                }
              >
                <option value={1}>Ingresado</option>
                <option value={2}>Pendiente</option>
                <option value={3}>Aprobado</option>
                <option value={4}>Rechazado</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_pago">Código de pago</Label>
              <Input
                id="codigo_pago"
                value={values.codigo_pago}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    codigo_pago: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_pago_inicial">Pago inicial</Label>
              <NumberInput
                id="valor_pago_inicial"
                value={values.valor_pago_inicial ?? 0}
                onChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    valor_pago_inicial: value || null,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas_adicionales">Notas</Label>
            <Textarea
              id="notas_adicionales"
              value={values.notas_adicionales}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notas_adicionales: event.target.value,
                }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteEmprendimientoDialog({
  formulario,
  onClose,
  onConfirm,
}: {
  formulario: FormularioReferenciaGeneral | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog
      open={Boolean(formulario)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Eliminar emprendimiento
          </DialogTitle>
          <DialogDescription>
            ¿Deseas eliminar el emprendimiento{' '}
            <span className="font-semibold text-foreground">
              {formulario?.nombre_emprendimiento ?? 'seleccionado'}
            </span>
            ? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function toFormValues(
  formulario: FormularioReferenciaGeneral | null
): EmprendimientoFormValues {
  if (!formulario) return EMPTY_FORM

  return {
    id_emprendedor: formulario.id_emprendedor,
    nombre_emprendimiento: formulario.nombre_emprendimiento ?? '',
    id_tipo_oferta: formulario.id_tipo_oferta,
    id_estado_emprendedor: formulario.id_estado_emprendedor,
    codigo_pago: formulario.codigo_pago ?? '',
    valor_pago_inicial: formulario.valor_pago_inicial,
    notas_adicionales: formulario.notas_adicionales ?? '',
  }
}

function getTipoOferta(id: number | null) {
  const map: Record<number, string> = {
    1: 'Productos',
    2: 'Servicios',
    3: 'Productos y servicios',
  }

  return id ? (map[id] ?? `Tipo ${id}`) : 'No especificado'
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-EC')
}
