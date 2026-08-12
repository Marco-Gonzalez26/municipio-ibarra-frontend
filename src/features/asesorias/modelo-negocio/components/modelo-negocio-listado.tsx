'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Send,
  Check,
  X,
  Trash2,
} from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
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
import type { ModeloNegocioDTO } from '@/features/modelo-negocio/types/modelo-negocio-api.types'
import type { EmprendimientoOpcion } from '../types/ficha.type'
import { SeleccionarEmprendimientoDialog } from './seleccionar-emprendimiento-dialog'
import {
  deleteModeloAction,
  changeEstadoAction,
} from '@/features/modelo-negocio/actions/modelo-negocio.actions'

const ESTADO_MAP: Record<
  number,
  {
    label: string
    variant: 'secondary' | 'default' | 'destructive' | 'outline'
  }
> = {
  1: { label: 'BORRADOR', variant: 'secondary' },
  2: { label: 'EN REVISIÓN', variant: 'outline' },
  3: { label: 'APROBADO', variant: 'default' },
  4: { label: 'RECHAZADO', variant: 'destructive' },
}

type CampoOrden = 'nombre_emprendimiento' | 'fecha_actualizacion'
type DireccionOrden = 'asc' | 'desc'

function formatFecha(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function toLocalDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

interface ModeloNegocioListadoProps {
  modelosIniciales: ModeloNegocioDTO[]
  emprendimientos: EmprendimientoOpcion[]
}

export function ModeloNegocioListado({
  modelosIniciales,
  emprendimientos,
}: ModeloNegocioListadoProps) {
  const [modelos, setModelos] = useState(modelosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<string>('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [orden, setOrden] = useState<{
    campo: CampoOrden
    direccion: DireccionOrden
  }>({ campo: 'fecha_actualizacion', direccion: 'desc' })
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [modeloAEliminar, setModeloAEliminar] =
    useState<ModeloNegocioDTO | null>(null)
  const [modeloACambiarEstado, setModeloACambiarEstado] =
    useState<ModeloNegocioDTO | null>(null)
  const [nuevoEstadoId, setNuevoEstadoId] = useState<number>(0)
  const [motivo, setMotivo] = useState('')

  const modelosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    const filtrados = modelos.filter((modelo) => {
      if (estado !== 'todos' && modelo.id_estado !== Number(estado))
        return false

      if (termino) {
        const texto = [
          modelo.nombre_emprendimiento,
          modelo.n_tramite,
          modelo.analista,
        ]
          .join(' ')
          .toLowerCase()
        if (!texto.includes(termino)) return false
      }

      const fecha = toLocalDate(modelo.fecha_actualizacion)
      if (fechaDesde && fecha < fechaDesde) return false
      if (fechaHasta && fecha > fechaHasta) return false

      return true
    })

    const factor = orden.direccion === 'asc' ? 1 : -1
    return filtrados.sort((a, b) => {
      if (orden.campo === 'nombre_emprendimiento') {
        return (
          factor *
          (a.nombre_emprendimiento ?? '').localeCompare(
            b.nombre_emprendimiento ?? '',
            'es'
          )
        )
      }
      return (
        factor *
        (new Date(a.fecha_actualizacion).getTime() -
          new Date(b.fecha_actualizacion).getTime())
      )
    })
  }, [modelos, busqueda, estado, fechaDesde, fechaHasta, orden])

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

  async function confirmarEliminar() {
    if (modeloAEliminar) {
      try {
        await deleteModeloAction(modeloAEliminar.id)
        setModelos((prev) => prev.filter((m) => m.id !== modeloAEliminar.id))
      } catch (error) {
        console.error('Error deleting modelo:', error)
      }
    }
    setModeloAEliminar(null)
  }

  function abrirCambioEstado(modelo: ModeloNegocioDTO, nuevoId: number) {
    setModeloACambiarEstado(modelo)
    setNuevoEstadoId(nuevoId)
    setMotivo('')
  }

  async function confirmarCambioEstado() {
    if (!modeloACambiarEstado) return
    try {
      await changeEstadoAction(
        modeloACambiarEstado.id,
        nuevoEstadoId,
        motivo || undefined
      )
      setModelos((prev) =>
        prev.map((m) =>
          m.id === modeloACambiarEstado.id
            ? { ...m, id_estado: nuevoEstadoId }
            : m
        )
      )
    } catch (error) {
      console.error('Error changing state:', error)
    }
    setModeloACambiarEstado(null)
    setNuevoEstadoId(0)
    setMotivo('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
          <Field label="Buscar">
            <Input
              placeholder="Emprendimiento, trámite o analista..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              className="lg:w-56"
            />
          </Field>

          <Field label="Estado">
            <Select value={estado} onValueChange={(value) => setEstado(value)}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="1">Borrador</SelectItem>
                <SelectItem value="2">En Revisión</SelectItem>
                <SelectItem value="3">Aprobado</SelectItem>
                <SelectItem value="4">Rechazado</SelectItem>
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
                N.º Trámite
              </TableHead>
              <TableHead className="text-primary-foreground">
                <OrdenarBoton
                  label="Emprendimiento"
                  activo={orden.campo === 'nombre_emprendimiento'}
                  direccion={orden.direccion}
                  onClick={() => alternarOrden('nombre_emprendimiento')}
                />
              </TableHead>
              <TableHead className="text-primary-foreground">
                Analista
              </TableHead>
              <TableHead className="text-primary-foreground">Estado</TableHead>
              <TableHead className="text-primary-foreground">
                <OrdenarBoton
                  label="Última actualización"
                  activo={orden.campo === 'fecha_actualizacion'}
                  direccion={orden.direccion}
                  onClick={() => alternarOrden('fecha_actualizacion')}
                />
              </TableHead>
              <TableHead className="text-right text-primary-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelosFiltrados.map((modelo) => {
              const estadoInfo = ESTADO_MAP[modelo.id_estado] ?? ESTADO_MAP[1]
              const esBorrador = modelo.id_estado === 1
              const enRevision = modelo.id_estado === 2
              return (
                <TableRow key={modelo.id} className="text-center">
                  <TableCell className="font-medium">
                    {modelo.n_tramite}
                  </TableCell>
                  <TableCell>
                    {modelo.nombre_emprendimiento ?? 'Sin nombre'}
                  </TableCell>
                  <TableCell>{modelo.analista}</TableCell>
                  <TableCell>
                    <Badge variant={estadoInfo.variant}>
                      {estadoInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatFecha(modelo.fecha_actualizacion)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/asesorias/modelo-negocio?id=${modelo.id}`}
                        >
                          Continuar
                        </Link>
                      </Button>
                      {esBorrador && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirCambioEstado(modelo, 2)}
                          >
                            <Send className="mr-1 size-3.5" />
                            Enviar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Eliminar borrador"
                            onClick={() => setModeloAEliminar(modelo)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      {enRevision && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirCambioEstado(modelo, 3)}
                          >
                            <Check className="mr-1 size-3.5 text-green-600" />
                            Aprobar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirCambioEstado(modelo, 4)}
                          >
                            <X className="mr-1 size-3.5 text-destructive" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {modelosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {modelos.length === 0
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
      />

      <EliminarBorradorDialog
        modelo={modeloAEliminar}
        onClose={() => setModeloAEliminar(null)}
        onConfirm={confirmarEliminar}
      />

      <CambiarEstadoDialog
        modelo={modeloACambiarEstado}
        nuevoEstadoId={nuevoEstadoId}
        motivo={motivo}
        onMotivoChange={setMotivo}
        onClose={() => setModeloACambiarEstado(null)}
        onConfirm={confirmarCambioEstado}
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
  modelo: ModeloNegocioDTO | null
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
              {modelo?.nombre_emprendimiento ?? 'este emprendimiento'}
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

function CambiarEstadoDialog({
  modelo,
  nuevoEstadoId,
  motivo,
  onMotivoChange,
  onClose,
  onConfirm,
}: {
  modelo: ModeloNegocioDTO | null
  nuevoEstadoId: number
  motivo: string
  onMotivoChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const estadoDestino = ESTADO_MAP[nuevoEstadoId]
  const esRechazo = nuevoEstadoId === 4

  return (
    <Dialog open={Boolean(modelo)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {esRechazo ? (
              <X className="size-5 text-destructive" />
            ) : (
              <Check className="size-5 text-green-600" />
            )}
            {esRechazo ? 'Rechazar modelo' : 'Cambiar estado'}
          </DialogTitle>
          <DialogDescription>
            Se cambiará el estado de{' '}
            <span className="font-semibold text-foreground">
              {modelo?.nombre_emprendimiento ?? 'este emprendimiento'}
            </span>{' '}
            a{' '}
            <Badge variant={estadoDestino?.variant}>
              {estadoDestino?.label}
            </Badge>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="motivo-cambio">
            Motivo {esRechazo ? '(obligatorio)' : '(opcional)'}
          </Label>
          <Textarea
            id="motivo-cambio"
            value={motivo}
            onChange={(e) => onMotivoChange(e.target.value)}
            placeholder={
              esRechazo
                ? 'Ingrese el motivo del rechazo...'
                : 'Motivo del cambio (opcional)...'
            }
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={esRechazo ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={esRechazo && !motivo.trim()}
          >
            {esRechazo ? 'Rechazar' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
