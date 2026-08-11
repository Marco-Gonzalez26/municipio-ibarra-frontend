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
import type { FormularioAsistenciaTecnica } from '@/types/form.type'
import type { Emprendedor } from '@/types/entrepreneur.type'
import { FormularioDetailDialog } from './formulario-detail-dialog'
import { DeleteFormularioDialog } from './delete-formulario-dialog'

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

  const emprendedorMap = new Map(
    emprendedores.map((e) => [e.id, e])
  )

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
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No se encontraron formularios
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f) => {
                const emprendedor = emprendedorMap.get(f.id_emprendedor)
                return (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">FAT-{f.id}</TableCell>
                    <TableCell>{emprendedor?.nombres_apellidos ?? 'No encontrado'}</TableCell>
                    <TableCell>
                      {new Date(f.fecha_formulario).toLocaleDateString('es-EC')}
                    </TableCell>
                    <TableCell>{f.nombre_emprendimiento ?? '-'}</TableCell>
                    <TableCell>
                      <Badge variant={f.tasa_cancelada ? 'default' : 'secondary'}>
                        {f.tasa_cancelada ? 'Sí' : 'No'}
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
        emprendedor={selectedFormulario ? emprendedorMap.get(selectedFormulario.id_emprendedor) ?? null : null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <DeleteFormularioDialog
        tipo="asistencia"
        formularioId={deleteFormulario?.id ?? 0}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
