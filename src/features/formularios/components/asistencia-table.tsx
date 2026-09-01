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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { FormularioAsistenciaTecnica } from '@/types/form.type'
import type { Emprendedor } from '@/types/entrepreneur.type'
import { FormularioDetailDialog } from './formulario-detail-dialog'
import { DeleteFormularioDialog } from './delete-formulario-dialog'
import { updateAsistenciaAction } from '../actions/update-asistencia.action'

interface AsistenciaTableProps {
  formularios: FormularioAsistenciaTecnica[]
  emprendedores: Emprendedor[]
}

export function AsistenciaTable({
  formularios,
  emprendedores,
}: AsistenciaTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormulario, setSelectedFormulario] =
    useState<FormularioAsistenciaTecnica | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteFormulario, setDeleteFormulario] =
    useState<FormularioAsistenciaTecnica | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingFormulario, setEditingFormulario] =
    useState<FormularioAsistenciaTecnica | null>(null)
  const [isPending, startTransition] = useTransition()

  const emprendedorMap = new Map(emprendedores.map((e) => [e.id, e]))

  const filtered = formularios.filter((f) => {
    const emprendedor = emprendedorMap.get(f.id_emprendedor)
    const name = emprendedor?.nombres_apellidos ?? ''
    const cedula = emprendedor?.cedula ?? ''
    return `${name} ${cedula}`.toLowerCase().includes(searchTerm.toLowerCase())
  })

  function handleView(formulario: FormularioAsistenciaTecnica) {
    setSelectedFormulario(formulario)
    setDetailOpen(true)
  }

  function handleDelete(formulario: FormularioAsistenciaTecnica) {
    setDeleteFormulario(formulario)
    setDeleteOpen(true)
  }

  function handleEdit(formulario: FormularioAsistenciaTecnica) {
    setEditingFormulario(formulario)
  }

  function handleUpdate(values: {
    nombre_emprendimiento: string | null
    tasa_cancelada: boolean
    notas: string | null
  }) {
    if (!editingFormulario) return
    startTransition(async () => {
      try {
        await updateAsistenciaAction(editingFormulario.id, values)
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
              <TableHead>Emprendimiento</TableHead>
              <TableHead>Tasa cancelada</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No se encontraron formularios
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f) => {
                const emprendedor = emprendedorMap.get(f.id_emprendedor)
                return (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">FAT-{f.id}</TableCell>
                    <TableCell>
                      {emprendedor?.nombres_apellidos ?? 'No encontrado'}
                    </TableCell>
                    <TableCell>
                      {new Date(f.fecha_formulario).toLocaleDateString('es-EC')}
                    </TableCell>
                    <TableCell>{f.nombre_emprendimiento ?? '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          Boolean(f.tasa_cancelada) ? 'default' : 'secondary'
                        }
                      >
                        {Boolean(f.tasa_cancelada) ? 'Sí' : 'No'}
                      </Badge>
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
        tipo="asistencia"
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
        tipo="asistencia"
        formularioId={deleteFormulario?.id ?? 0}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

      <EditAsistenciaDialog
        key={editingFormulario?.id ?? 'empty'}
        formulario={editingFormulario}
        open={Boolean(editingFormulario)}
        onOpenChange={(open) => !open && setEditingFormulario(null)}
        onSubmit={handleUpdate}
        isPending={isPending}
      />
    </>
  )
}

function EditAsistenciaDialog({
  formulario,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  formulario: FormularioAsistenciaTecnica | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: {
    nombre_emprendimiento: string | null
    tasa_cancelada: boolean
    notas: string | null
  }) => void
  isPending: boolean
}) {
  const [nombre, setNombre] = useState(formulario?.nombre_emprendimiento ?? '')
  const [tasa, setTasa] = useState(
    String(Boolean(formulario?.tasa_cancelada ?? ''))
  )
  const [notas, setNotas] = useState(formulario?.notas ?? '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={formulario?.id ?? 'empty'} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar asistencia FAT-{formulario?.id}</DialogTitle>
          <DialogDescription>
            Modifique los datos del formulario
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (tasa === '') {
              toast.error('Debe indicar si la tasa fue cancelada')
              return
            }
            onSubmit({
              nombre_emprendimiento: nombre || null,
              tasa_cancelada: tasa === 'true',
              notas: notas || null,
            })
          }}
          className="space-y-4"
        >
          <Field>
            <FieldLabel htmlFor="edit-nombre">Emprendimiento</FieldLabel>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Tasa cancelada *</FieldLabel>
            <RadioGroup
              value={tasa}
              onValueChange={setTasa}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id="edit-tasa-si" />
                <Label htmlFor="edit-tasa-si">Sí</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id="edit-tasa-no" />
                <Label htmlFor="edit-tasa-no">No</Label>
              </div>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-notas">Notas</FieldLabel>
            <Textarea
              id="edit-notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas adicionales"
            />
          </Field>
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
