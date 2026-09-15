'use client'

import { useState, useTransition } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type {
  FormularioReferenciaGeneral,
  FormularioReferenciaGeneralUpdateDTO,
} from '@/types/form.type'
import type { Emprendedor } from '@/types/entrepreneur.type'
import { FormularioDetailDialog } from './formulario-detail-dialog'
import { DeleteFormularioDialog } from './delete-formulario-dialog'
import { updateReferenciaAction } from '../actions/update-referencia.action'
import { formatDate } from '@/lib/date'

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

interface ReferenciaTableProps {
  formularios: FormularioReferenciaGeneral[]
  emprendedores: Emprendedor[]
}

export function ReferenciaTable({
  formularios,
  emprendedores,
}: ReferenciaTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormulario, setSelectedFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteFormulario, setDeleteFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingFormulario, setEditingFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [isPending, startTransition] = useTransition()

  const emprendedorMap = new Map(emprendedores.map((e) => [e.id, e]))

  const filtered = formularios.filter((f) => {
    const emprendedor = emprendedorMap.get(f.id_emprendedor)
    const name = emprendedor?.nombres_apellidos ?? ''
    const cedula = emprendedor?.cedula ?? ''
    return `${name} ${cedula}`.toLowerCase().includes(searchTerm.toLowerCase())
  })

  function handleView(formulario: FormularioReferenciaGeneral) {
    setSelectedFormulario(formulario)
    setDetailOpen(true)
  }

  function handleDelete(formulario: FormularioReferenciaGeneral) {
    setDeleteFormulario(formulario)
    setDeleteOpen(true)
  }

  function handleEdit(formulario: FormularioReferenciaGeneral) {
    setEditingFormulario(formulario)
  }

  function handleUpdate(
    id: number,
    values: FormularioReferenciaGeneralUpdateDTO
  ) {
    startTransition(async () => {
      try {
        await updateReferenciaAction(id, values)
        toast.success('Formulario actualizado correctamente')
        setEditingFormulario(null)
      } catch (error) {
        toast.error('No se pudo actualizar', {
          description:
            error instanceof Error ? error.message : 'Intente nuevamente',
        })
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por nombre o cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Emprendedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Emprendimiento</TableHead>
              <TableHead>Intención</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No se encontraron formularios
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f) => {
                const emprendedor = emprendedorMap.get(f.id_emprendedor)
                const estado = ESTADO_MAP[f.id_estado_emprendedor] ?? {
                  label: 'DESCONOCIDO',
                  variant: 'outline' as const,
                }
                return (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">FRG-{f.id}</TableCell>
                    <TableCell>
                      {emprendedor?.nombres_apellidos ?? 'No encontrado'}
                    </TableCell>
                    <TableCell>{formatDate(f.fecha_formulario)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={estado.variant}
                        className={estado.className}
                      >
                        {estado.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {f.tiene_emprendimiento ? 'Sí' : 'No'}
                    </TableCell>
                    <TableCell>
                      {f.intencion_emprender === null
                        ? 'Sin especificar'
                        : f.intencion_emprender
                          ? 'Sí'
                          : 'No'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleView(f)}
                        >
                          <Eye className="size-4 text-blue-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(f)}
                        >
                          <Pencil className="size-4 text-yellow-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(f)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <FormularioDetailDialog
        tipo="referencia"
        formulario={selectedFormulario}
        emprendedor={
          selectedFormulario
            ? (emprendedorMap.get(selectedFormulario.id_emprendedor) ?? null)
            : null
        }
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <DeleteFormularioDialog
        tipo="referencia"
        formularioId={deleteFormulario?.id ?? 0}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

      <EditReferenciaDialog
        key={editingFormulario?.id ?? 'empty'}
        formulario={editingFormulario}
        emprendedores={emprendedores}
        open={Boolean(editingFormulario)}
        onOpenChange={(open) => {
          if (!open) setEditingFormulario(null)
        }}
        onSubmit={(values) => {
          if (editingFormulario) handleUpdate(editingFormulario.id, values)
        }}
        isPending={isPending}
      />
    </>
  )
}

function EditReferenciaDialog({
  formulario,
  emprendedores,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  formulario: FormularioReferenciaGeneral | null
  emprendedores: Emprendedor[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormularioReferenciaGeneralUpdateDTO) => void
  isPending: boolean
}) {
  const [idEmprendedor, setIdEmprendedor] = useState<number>(
    formulario?.id_emprendedor ?? 0
  )
  const [nombre, setNombre] = useState(formulario?.nombre_emprendimiento ?? '')
  const [idTipoOferta, setIdTipoOferta] = useState<number | null>(
    formulario?.id_tipo_oferta ?? null
  )
  const [idEstado, setIdEstado] = useState<number>(
    formulario?.id_estado_emprendedor ?? 1
  )
  const [codigoPago, setCodigoPago] = useState(formulario?.codigo_pago ?? '')
  const [valorPago, setValorPago] = useState<number | null>(
    formulario?.valor_pago_inicial ?? null
  )
  const [notas, setNotas] = useState(formulario?.notas_adicionales ?? '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={formulario?.id ?? 'empty'}
        className="max-h-[90vh] max-w-lg overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Editar formulario FRG-{formulario?.id}</DialogTitle>
          <DialogDescription>
            Modifique los datos del formulario
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!idEmprendedor) {
              toast.error('Debe seleccionar un emprendedor')
              return
            }
            onSubmit({
              id_emprendedor: idEmprendedor,
              nombre_emprendimiento: nombre || null,
              id_tipo_oferta: idTipoOferta,
              id_estado_emprendedor: idEstado,
              codigo_pago: codigoPago,
              valor_pago_inicial: valorPago,
              notas_adicionales: notas || null,
            })
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-id-emprendedor">Emprendedor *</Label>
            <select
              id="edit-id-emprendedor"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={idEmprendedor}
              onChange={(e) => setIdEmprendedor(Number(e.target.value))}
              required
            >
              <option value={0}>Seleccione un emprendedor</option>
              {emprendedores.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombres_apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nombre">Emprendimiento</Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-id-tipo-oferta">Tipo de oferta</Label>
            <select
              id="edit-id-tipo-oferta"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={idTipoOferta ?? ''}
              onChange={(e) =>
                setIdTipoOferta(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">No especificado</option>
              <option value={1}>Productos</option>
              <option value={2}>Servicios</option>
              <option value={3}>Productos y servicios</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-id-estado">Estado</Label>
            <select
              id="edit-id-estado"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={idEstado}
              onChange={(e) => setIdEstado(Number(e.target.value))}
            >
              <option value={1}>Ingresado</option>
              <option value={2}>Pendiente</option>
              <option value={3}>Aprobado</option>
              <option value={4}>Rechazado</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-codigo-pago">Código de pago</Label>
            <Input
              id="edit-codigo-pago"
              value={codigoPago}
              onChange={(e) => setCodigoPago(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-valor-pago">Pago inicial</Label>
            <NumberInput
              id="edit-valor-pago"
              value={valorPago ?? 0}
              onChange={(v) => setValorPago(v || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notas">Notas</Label>
            <Textarea
              id="edit-notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
