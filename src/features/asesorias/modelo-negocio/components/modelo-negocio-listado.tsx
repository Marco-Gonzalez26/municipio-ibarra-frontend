'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from 'lucide-react'
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { EmprendimientoOpcion } from '../types/ficha.type'
import type {
  ModeloNegocioEstado,
  ModeloNegocioRegistro,
} from '../types/wizard-form.type'
import { SeleccionarEmprendimientoDialog } from './seleccionar-emprendimiento-dialog'

const ESTADO_MAP: Record<
  ModeloNegocioEstado,
  { label: string; variant: 'secondary' | 'default' }
> = {
  borrador: { label: 'BORRADOR', variant: 'secondary' },
  completado: { label: 'COMPLETADO', variant: 'default' },
}

type FiltroEstado = 'todos' | ModeloNegocioEstado
type CampoOrden = 'nombreEmprendimiento' | 'actualizadoEn'
type DireccionOrden = 'asc' | 'desc'

function formatFecha(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Fecha local en formato YYYY-MM-DD, para comparar contra los input[type=date].
function toLocalDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

interface ModeloNegocioListadoProps {
  emprendimientos: EmprendimientoOpcion[]
}

export function ModeloNegocioListado({
  emprendimientos,
}: ModeloNegocioListadoProps) {
  const registro = useModeloNegocioWizardStore((state) => state.registro)
  const eliminarModelo = useModeloNegocioWizardStore(
    (state) => state.eliminarModelo
  )

  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<FiltroEstado>('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [orden, setOrden] = useState<{
    campo: CampoOrden
    direccion: DireccionOrden
  }>({ campo: 'actualizadoEn', direccion: 'desc' })
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [modeloAEliminar, setModeloAEliminar] =
    useState<ModeloNegocioRegistro | null>(null)

  const modelos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    const filtrados = Object.values(registro).filter((modelo) => {
      if (estado !== 'todos' && modelo.estado !== estado) return false

      if (termino) {
        const texto = [modelo.nombreEmprendedor, modelo.nombreEmprendimiento]
          .join(' ')
          .toLowerCase()
        if (!texto.includes(termino)) return false
      }

      const fecha = toLocalDate(modelo.actualizadoEn)
      if (fechaDesde && fecha < fechaDesde) return false
      if (fechaHasta && fecha > fechaHasta) return false

      return true
    })

    const factor = orden.direccion === 'asc' ? 1 : -1
    return filtrados.sort((a, b) => {
      if (orden.campo === 'nombreEmprendimiento') {
        return (
          factor *
          (a.nombreEmprendimiento ?? '').localeCompare(
            b.nombreEmprendimiento ?? '',
            'es'
          )
        )
      }
      return (
        factor *
        (new Date(a.actualizadoEn).getTime() -
          new Date(b.actualizadoEn).getTime())
      )
    })
  }, [registro, busqueda, estado, fechaDesde, fechaHasta, orden])

  function alternarOrden(campo: CampoOrden) {
    setOrden((prev) =>
      prev.campo === campo
        ? {
            campo,
            direccion: prev.direccion === 'asc' ? 'desc' : 'asc',
          }
        : { campo, direccion: 'asc' }
    )
  }

  function confirmarEliminar() {
    if (modeloAEliminar) {
      eliminarModelo(modeloAEliminar.idEmprendedor)
    }
    setModeloAEliminar(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
          <Field label="Buscar">
            <Input
              placeholder="Emprendedor o emprendimiento..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              className="lg:w-56"
            />
          </Field>

          <Field label="Estado">
            <Select
              value={estado}
              onValueChange={(value) => setEstado(value as FiltroEstado)}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Desde">
            <Input
              type="date"
              value={fechaDesde}
              max={fechaHasta || undefined}
              onChange={(event) => setFechaDesde(event.target.value)}
              className="lg:w-40"
            />
          </Field>

          <Field label="Hasta">
            <Input
              type="date"
              value={fechaHasta}
              min={fechaDesde || undefined}
              onChange={(event) => setFechaHasta(event.target.value)}
              className="lg:w-40"
            />
          </Field>
        </div>

        <Button type="button" onClick={() => setDialogoAbierto(true)}>
          + Crear nuevo modelo
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">
                Emprendedor
              </TableHead>
              <TableHead className="text-primary-foreground">
                <OrdenarBoton
                  label="Emprendimiento"
                  activo={orden.campo === 'nombreEmprendimiento'}
                  direccion={orden.direccion}
                  onClick={() => alternarOrden('nombreEmprendimiento')}
                />
              </TableHead>
              <TableHead className="text-primary-foreground">Estado</TableHead>
              <TableHead className="text-primary-foreground">
                <OrdenarBoton
                  label="Última actualización"
                  activo={orden.campo === 'actualizadoEn'}
                  direccion={orden.direccion}
                  onClick={() => alternarOrden('actualizadoEn')}
                />
              </TableHead>
              <TableHead className="text-right text-primary-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelos.map((modelo) => {
              const estadoInfo = ESTADO_MAP[modelo.estado]
              const esBorrador = modelo.estado === 'borrador'
              return (
                <TableRow key={modelo.idEmprendedor} className="text-center">
                  <TableCell className="font-medium">
                    {modelo.nombreEmprendedor}
                  </TableCell>
                  <TableCell>
                    {modelo.nombreEmprendimiento ?? 'Sin nombre'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={estadoInfo.variant}>
                      {estadoInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFecha(modelo.actualizadoEn)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/asesorias/modelo-negocio?id=${modelo.idEmprendedor}`}
                        >
                          Continuar
                        </Link>
                      </Button>
                      {esBorrador && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Eliminar borrador"
                          onClick={() => setModeloAEliminar(modelo)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {modelos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {Object.keys(registro).length === 0
                    ? 'Aún no hay modelos de negocio guardados.'
                    : 'Ningún modelo coincide con los filtros.'}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <SeleccionarEmprendimientoDialog
        open={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        emprendimientos={emprendimientos}
        modelosGuardados={registro}
      />

      <EliminarBorradorDialog
        modelo={modeloAEliminar}
        onClose={() => setModeloAEliminar(null)}
        onConfirm={confirmarEliminar}
      />
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function OrdenarBoton({
  label,
  activo,
  direccion,
  onClick,
}: {
  label: string
  activo: boolean
  direccion: DireccionOrden
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex items-center gap-1.5 font-medium text-primary-foreground"
    >
      {label}
      {!activo ? (
        <ArrowUpDown className="size-3.5 opacity-70" />
      ) : direccion === 'asc' ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ArrowDown className="size-3.5" />
      )}
    </button>
  )
}

function EliminarBorradorDialog({
  modelo,
  onClose,
  onConfirm,
}: {
  modelo: ModeloNegocioRegistro | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={Boolean(modelo)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Eliminar borrador
          </DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar el borrador de{' '}
            <span className="font-semibold text-foreground">
              {modelo?.nombreEmprendimiento ?? 'este emprendimiento'}
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
