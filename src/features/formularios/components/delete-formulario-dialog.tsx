'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteFormularioDialogProps {
  tipo: 'referencia' | 'asistencia'
  formularioId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteFormularioDialog({
  tipo,
  formularioId,
  open,
  onOpenChange,
}: DeleteFormularioDialogProps) {
  const [loading, setLoading] = useState(false)

  const label = tipo === 'referencia' ? 'FRG' : 'FAT'

  async function handleDelete() {
    setLoading(true)
    try {
      if (tipo === 'asistencia') {
        const { deleteAsistenciaAction } = await import('../actions/delete-asistencia.action')
        await deleteAsistenciaAction(formularioId)
      }
      toast.success(`Formulario ${label}-${formularioId} eliminado`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al eliminar el formulario', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Eliminar formulario
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el formulario{' '}
            <span className="font-semibold text-foreground">
              {label}-{formularioId}
            </span>
            ? Esta acción no se puede deshacer.
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
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
