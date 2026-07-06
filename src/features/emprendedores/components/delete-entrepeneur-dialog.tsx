'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteEntrepreneurAction } from '../actions/delete-entrepeneur.action'
import { toast } from 'sonner'

interface DeleteEntrepreneurDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entrepreneurId: number | null
  entrepreneurName: string | null
}

export function DeleteEntrepreneurDialog({
  open,
  onOpenChange,
  entrepreneurId,
  entrepreneurName,
}: DeleteEntrepreneurDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!entrepreneurId) return

    setIsDeleting(true)
    try {
      await deleteEntrepreneurAction(entrepreneurId)
      toast.success('Emprendedor desactivado correctamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('No se pudo desactivar el emprendedor', {
        description: (error as { msg?: string }).msg ?? 'Intente nuevamente.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Desactivar Emprendedor
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas desactivar a{' '}
            <span className="font-semibold text-foreground">
              {entrepreneurName}
            </span>
            ? Esta acción puede revertirse posteriormente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Desactivando...' : 'Desactivar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
