'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, Check, X, Trash2 } from 'lucide-react'
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
  const router = useRouter()

  function getFormulario(idEmprendedor: number) {
    return formularios.find((f) => f.id_emprendedor === idEmprendedor) ?? null
  }

  function handleView(entrepreneur: Emprendedor) {
    setSelectedEntrepreneur(entrepreneur)
    setSelectedFormulario(getFormulario(entrepreneur.id))
    setDialogOpen(true)
  }
  function handleDelete(entrepreneur: Emprendedor) {
    setSelectedForDelete({
      id: entrepreneur.id,
      name: entrepreneur.nombres_apellidos,
    })
    setDeleteDialogOpen(true)
  }
  return (
    <>
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
            {entrepreneurs.map((entrepreneur) => {
              const formulario = getFormulario(entrepreneur.id)
              const estado = ESTADO_MAP[formulario?.id_estado_emprendedor ?? 1]
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
                    {formulario?.nombre_emprendimiento ?? 'No especificado'}
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
                      <Button size="icon" variant="ghost">
                        <Check className="size-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost">
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
    </>
  )
}
