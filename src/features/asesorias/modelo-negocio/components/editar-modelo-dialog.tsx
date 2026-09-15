'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import type { ModeloNegocioDTO } from '@/features/modelo-negocio/types/modelo-negocio-api.types'
import {
  changeEstadoAction,
  updateModeloAction,
} from '@/features/modelo-negocio/actions/modelo-negocio.actions'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const ESTADO_LABELS: Record<number, string> = {
  1: 'BORRADOR',
  2: 'EN REVISIÓN',
  3: 'APROBADO',
  4: 'RECHAZADO',
}

interface EditarModeloValues {
  nTramite: string
  productoLinea: string
  analista: string
  observaciones: string
  idEstado: string
  motivo: string
}

function createInitialValues(
  modelo: ModeloNegocioDTO | null
): EditarModeloValues {
  return {
    nTramite: modelo?.n_tramite ?? '',
    productoLinea: modelo?.producto_linea ?? '',
    analista: modelo?.analista ?? '',
    observaciones: modelo?.observaciones ?? '',
    idEstado: modelo ? String(modelo.id_estado) : '',
    motivo: '',
  }
}

interface EditarModeloDialogProps {
  modelo: ModeloNegocioDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updated: ModeloNegocioDTO) => void
}

export function EditarModeloDialog({
  modelo,
  open,
  onOpenChange,
  onSaved,
}: EditarModeloDialogProps) {
  const [values, setValues] = useState<EditarModeloValues>(() =>
    createInitialValues(modelo)
  )
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function updateValue<K extends keyof EditarModeloValues>(
    field: K,
    value: EditarModeloValues[K]
  ) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (!modelo) return

    const nTramite = values.nTramite.trim()
    const productoLinea = values.productoLinea.trim()
    const analista = values.analista.trim()
    const idEstado = Number(values.idEstado)
    const motivo = values.motivo.trim()

    if (!nTramite) {
      setError('El número de trámite es obligatorio.')
      return
    }
    if (!productoLinea) {
      setError('El producto o línea es obligatorio.')
      return
    }
    if (!analista) {
      setError('El analista responsable es obligatorio.')
      return
    }
    if (!analista.includes(' ')) {
      setError('El analista debe incluir nombre y apellido.')
      return
    }
    if (!Number.isInteger(idEstado) || idEstado < 1 || idEstado > 4) {
      setError('Selecciona un estado válido.')
      return
    }
    if (idEstado === 4 && !motivo) {
      setError('El motivo es obligatorio para rechazar.')
      return
    }

    startTransition(async () => {
      try {
        if (idEstado !== modelo.id_estado) {
          await changeEstadoAction(modelo.id, idEstado, motivo || undefined)
        }
        await updateModeloAction(modelo.id, {
          n_tramite: nTramite,
          producto_linea: productoLinea,
          analista,
          observaciones: values.observaciones.trim(),
        })
        toast.success('Modelo actualizado correctamente')
        onSaved({
          ...modelo,
          n_tramite: nTramite,
          producto_linea: productoLinea,
          analista,
          observaciones: values.observaciones.trim() || null,
          id_estado: idEstado,
          fecha_actualizacion: new Date().toISOString(),
        })
        onOpenChange(false)
      } catch (err) {
        setError(getApiErrorMessage(err, 'No se pudo actualizar el modelo.'))
      }
    })
  }

  const estadoActual = modelo ? (ESTADO_LABELS[modelo.id_estado] ?? '') : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar modelo {modelo ? `MN-${modelo.id}` : ''}
          </DialogTitle>
          <DialogDescription>
            Modifica el estado y los datos de ficha. Estado actual:{' '}
            <Badge variant="outline">{estadoActual}</Badge>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="edit-estado">Estado</FieldLabel>
              <Select
                value={values.idEstado}
                onValueChange={(v) => updateValue('idEstado', v)}
              >
                <SelectTrigger id="edit-estado">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">BORRADOR</SelectItem>
                  <SelectItem value="2">EN REVISIÓN</SelectItem>
                  <SelectItem value="3">APROBADO</SelectItem>
                  <SelectItem value="4">RECHAZADO</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <FormField id="edit-ntramite" label="N.º de trámite *">
              <Input
                id="edit-ntramite"
                value={values.nTramite}
                onChange={(e) => updateValue('nTramite', e.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-producto" label="Producto / línea *">
              <Input
                id="edit-producto"
                value={values.productoLinea}
                onChange={(e) => updateValue('productoLinea', e.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-analista" label="Analista responsable *">
              <Input
                id="edit-analista"
                value={values.analista}
                onChange={(e) => updateValue('analista', e.target.value)}
                placeholder="Nombre y apellido"
                disabled={isPending}
                required
              />
            </FormField>
          </div>

          <FormField
            id="edit-motivo"
            label="Motivo (obligatorio si se rechaza)"
          >
            <Textarea
              id="edit-motivo"
              value={values.motivo}
              onChange={(e) => updateValue('motivo', e.target.value)}
              placeholder="Motivo del cambio de estado (opcional, obligatorio para rechazar)"
              disabled={isPending}
              rows={2}
            />
          </FormField>

          <FormField id="edit-observaciones" label="Observaciones">
            <Textarea
              id="edit-observaciones"
              value={values.observaciones}
              onChange={(e) => updateValue('observaciones', e.target.value)}
              placeholder="Notas internas del analista (opcional)"
              disabled={isPending}
              rows={2}
            />
          </FormField>

          {error ? <FieldError errors={[{ message: error }]} /> : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
