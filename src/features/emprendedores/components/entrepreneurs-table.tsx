'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, Check, X, Trash2, Building2 } from 'lucide-react'
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
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'
import { EntrepreneurDetailDialog } from './entrepreneur-detail-dialog'
import { DeleteEntrepreneurDialog } from './delete-entrepeneur-dialog'
import { ChangeEstadoDialog } from './change-estado-dialog'

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

interface EntrepreneursTableProps {
  entrepreneurs: Emprendedor[]
  formularios: FormularioReferenciaGeneral[]
}

export function EntrepreneursTable({
  entrepreneurs,
  formularios,
}: EntrepreneursTableProps) {
  const [selectedEntrepreneur, setSelectedEntrepreneur] =
    useState<Emprendedor | null>(null)
  const [selectedFormulario, setSelectedFormulario] =
    useState<FormularioReferenciaGeneral | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState<{
    id: number
    name: string
  } | null>(null)
  const [changeEstadoDialogOpen, setChangeEstadoDialogOpen] = useState(false)
  const [changeEstadoTarget, setChangeEstadoTarget] = useState<{
    formularioId: number
    tipo: 'aprobar' | 'rechazar'
  } | null>(null)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEntrepeneurs = entrepreneurs.filter((entrepeneur) => {
    const searchString =
      `${entrepeneur.nombres_apellidos} ${entrepeneur.cedula}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  function getFormularios(idEmprendedor: number) {
    return formularios.filter((f) => f.id_emprendedor === idEmprendedor)
  }

  function getFormulario(idEmprendedor: number) {
    return getFormularios(idEmprendedor)[0] ?? null
  }

  function handleView(entrepreneur: Emprendedor) {
    setSelectedEntrepreneur(entrepreneur)
    setSelectedFormulario(getFormulario(entrepreneur.id))
    setDialogOpen(true)
  }
  return (
    <>
      <input
        type="text"
        placeholder="Buscar por nombre, cédula..."
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
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">ID</TableHead>
              <TableHead className="text-primary-foreground">Nombre</TableHead>
              <TableHead className="text-primary-foreground">Cédula</TableHead>
              <TableHead className="text-primary-foreground">
                Emprendimiento
              </TableHead>
              <TableHead className="text-primary-foreground">Estado</TableHead>
              <TableHead className="text-primary-foreground">Fecha</TableHead>
              <TableHead className="text-primary-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntrepeneurs.map((entrepreneur) => {
              const formulario = getFormulario(entrepreneur.id)
              const formulariosDelEmprendedor = getFormularios(entrepreneur.id)
              const estadoId = formulario?.id_estado_emprendedor ?? 1
              const estado = ESTADO_MAP[estadoId]
              const isTerminal = estadoId === 3 || estadoId === 4
              const fecha = formulario
                ? new Date(formulario.fecha_formulario).toLocaleDateString(
                    'es-EC'
                  )
                : '-'

              return (
                <TableRow key={entrepreneur.id} className="text-center">
                  <TableCell className="font-medium text-primary">
                    EMP-{entrepreneur.id}
                  </TableCell>
                  <TableCell>{entrepreneur.nombres_apellidos}</TableCell>
                  <TableCell>{entrepreneur.cedula}</TableCell>
                  <TableCell>
                    {formulariosDelEmprendedor.length > 0
                      ? formulariosDelEmprendedor
                          .map(
                            (item) =>
                              item.nombre_emprendimiento ?? 'Sin nombre'
                          )
                          .join(', ')
                      : 'No especificado'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={estado.variant}>{estado.label}</Badge>
                  </TableCell>
                  <TableCell>{fecha}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Añadir emprendimiento"
                        aria-label={`Añadir emprendimiento a ${entrepreneur.nombres_apellidos}`}
                        onClick={() =>
                          router.push(
                            `/emprendedores/${entrepreneur.id}/emprendimiento/nuevo`
                          )
                        }
                      >
                        <Building2 className="size-4 text-primary" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleView(entrepreneur)}
                      >
                        <Eye className="size-4 text-blue-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          router.push(
                            `/emprendedores/${entrepreneur.id}/editar`
                          )
                        }
                      >
                        <Pencil className="size-4 text-yellow-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={!formulario || isTerminal}
                        onClick={() => {
                          if (!formulario) return
                          setChangeEstadoTarget({
                            formularioId: formulario.id,
                            tipo: 'aprobar',
                          })
                          setChangeEstadoDialogOpen(true)
                        }}
                      >
                        <Check className="size-4 text-green-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={!formulario || isTerminal}
                        onClick={() => {
                          if (!formulario) return
                          setChangeEstadoTarget({
                            formularioId: formulario.id,
                            tipo: 'rechazar',
                          })
                          setChangeEstadoDialogOpen(true)
                        }}
                      >
                        <X className="size-4 text-orange-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedForDelete({
                            id: entrepreneur.id,
                            name: entrepreneur.nombres_apellidos,
                          })
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <DeleteEntrepreneurDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entrepreneurId={selectedForDelete?.id ?? null}
        entrepreneurName={selectedForDelete?.name ?? null}
      />

      <EntrepreneurDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entrepreneur={selectedEntrepreneur}
        formulario={selectedFormulario}
      />

      <ChangeEstadoDialog
        tipo={changeEstadoTarget?.tipo ?? 'aprobar'}
        formularioId={changeEstadoTarget?.formularioId ?? 0}
        open={changeEstadoDialogOpen}
        onOpenChange={setChangeEstadoDialogOpen}
      />
    </>
  )
}
