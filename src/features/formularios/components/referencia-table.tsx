'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
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
import type { FormularioReferenciaGeneral } from '@/types/form.type'
import type { Emprendedor } from '@/types/entrepreneur.type'
import { FormularioDetailDialog } from './formulario-detail-dialog'
import { DeleteFormularioDialog } from './delete-formulario-dialog'

const ESTADO_MAP: Record<
  number,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  1: { label: 'INGRESADO', variant: 'secondary' },
  2: { label: 'PENDIENTE', variant: 'outline' },
  3: { label: 'APROBADO', variant: 'default' },
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

  const emprendedorMap = new Map(
    emprendedores.map((e) => [e.id, e])
  )

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
                <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                    <TableCell>{emprendedor?.nombres_apellidos ?? 'No encontrado'}</TableCell>
                    <TableCell>
                      {new Date(f.fecha_formulario).toLocaleDateString('es-EC')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={estado.variant}>{estado.label}</Badge>
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
        emprendedor={selectedFormulario ? emprendedorMap.get(selectedFormulario.id_emprendedor) ?? null : null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <DeleteFormularioDialog
        tipo="referencia"
        formularioId={deleteFormulario?.id ?? 0}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
