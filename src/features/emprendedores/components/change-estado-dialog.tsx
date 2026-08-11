'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { changeFormularioEstadoAction } from '../actions/change-formulario-estado.action'
import { toast } from 'sonner'

interface ChangeEstadoDialogProps {
  tipo: 'aprobar' | 'rechazar'
  formularioId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeEstadoDialog({
  tipo,
  formularioId,
  open,
  onOpenChange,
}: ChangeEstadoDialogProps) {
  const [loading, setLoading] = useState(false)

  const isAprobar = tipo === 'aprobar'
  const estadoId = isAprobar ? 3 : 4

  async function handleChange() {
    if (!formularioId) return

    setLoading(true)
    try {
      await changeFormularioEstadoAction(formularioId, estadoId)
      toast.success(
        isAprobar ? 'Formulario aprobado correctamente' : 'Formulario rechazado'
      )
      onOpenChange(false)
    } catch (error) {
      toast.error(
        isAprobar
          ? 'No se pudo aprobar el formulario'
          : 'No se pudo rechazar el formulario',
        {
          description: (error as { msg?: string }).msg ?? 'Intente nuevamente.',
        }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAprobar ? (
              <Check className="size-5 text-green-500" />
            ) : (
              <X className="size-5 text-destructive" />
            )}
            {isAprobar ? 'Aprobar formulario' : 'Rechazar formulario'}
          </DialogTitle>
          <DialogDescription>
            {isAprobar
              ? '¿Estás seguro de que deseas aprobar este formulario? El emprendedor podrá iniciar un modelo de negocio.'
              : '¿Estás seguro de que deseas rechazar este formulario? Esta acción no se puede deshacer.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant={isAprobar ? 'default' : 'destructive'}
            onClick={handleChange}
            disabled={loading}
          >
            {loading
              ? isAprobar
                ? 'Aprobando...'
                : 'Rechazando...'
              : isAprobar
                ? 'Aprobar'
                : 'Rechazar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
