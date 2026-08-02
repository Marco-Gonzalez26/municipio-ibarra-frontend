'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { deactivateUserAction } from '../actions/deactivate-user.action'
import type { UsuarioConRol } from '../utils/merge-users-with-roles'

interface DeactivateUserDialogProps {
  user: UsuarioConRol | null
  onClose: () => void
}

export function DeactivateUserDialog({
  user,
  onClose,
}: DeactivateUserDialogProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleConfirm() {
    if (!user) {
      return
    }

    setError('')

    startTransition(async () => {
      const result = await deactivateUserAction({
        userId: user.id,
        assignmentId: user.asignacionRol?.id ?? null,
        idRol: user.asignacionRol?.id_rol ?? user.rol?.id ?? null,
        fechaAsignacion: user.asignacionRol?.fecha_asignacion ?? null,
        fechaExpiracion: user.asignacionRol?.fecha_expiracion ?? null,
      })

      if (!result.success) {
        setError(result.message)
        return
      }

      onClose()
      router.refresh()
    })
  }

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          setError('')
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Desactivar usuario
          </DialogTitle>

          <DialogDescription>
            ¿Deseas desactivar al usuario{' '}
            <span className="font-semibold text-foreground">
              {user ? `${user.nombres} ${user.apellidos}` : 'seleccionado'}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          El usuario quedará desactivado y no podrá utilizar el sistema.
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Desactivando
              </>
            ) : (
              'Desactivar usuario'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
