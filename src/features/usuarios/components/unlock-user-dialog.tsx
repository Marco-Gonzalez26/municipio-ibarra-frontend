'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Unlock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { unlockUserAction } from '../actions/unlock-user.action'
import type { UsuarioConRol } from '../utils/merge-users-with-roles'

interface UnlockUserDialogProps {
  user: UsuarioConRol | null
  onClose: () => void
}

export function UnlockUserDialog({ user, onClose }: UnlockUserDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleConfirm() {
    if (!user) return

    setError('')

    startTransition(async () => {
      const result = await unlockUserAction(user.id)

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
            <Unlock className="size-5 text-green-600" />
            Desbloquear usuario
          </DialogTitle>

          <DialogDescription>
            Se reiniciarán los intentos fallidos del usuario{' '}
            <span className="font-semibold text-foreground">
              {user ? `${user.nombres} ${user.apellidos}` : 'seleccionado'}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
          Intentos fallidos actuales:{' '}
          <span className="font-semibold">{user?.intentos_fallidos ?? 0}</span>.
          Este usuario reseteará sus intentos fallidos a{' '}
          <span className="font-semibold">0</span> y podrá iniciar sesión
          nuevamente.
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

          <Button type="button" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Desbloqueando
              </>
            ) : (
              <>
                <Unlock className="mr-2 size-4" />
                Desbloquear
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
