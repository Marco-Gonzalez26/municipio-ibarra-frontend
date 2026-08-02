'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
  updateUserWithRoleAction,
  type UpdateUserWithRoleInput,
} from '../actions/update-user.action'
import type { Role } from '../types/user-role.type'
import type { UsuarioConRol } from '../utils/merge-users-with-roles'

interface EditUserDialogProps {
  user: UsuarioConRol | null
  roles: Role[]
  onClose: () => void
}

interface EditUserValues {
  nombres: string
  apellidos: string
  cuenta: string
  correo: string
  idRol: string
  fechaExpiracion: string
  activo: boolean
}

const EMPTY_VALUES: EditUserValues = {
  nombres: '',
  apellidos: '',
  cuenta: '',
  correo: '',
  idRol: '',
  fechaExpiracion: '',
  activo: true,
}
function createInitialValues(user: UsuarioConRol | null): EditUserValues {
  if (!user) {
    return EMPTY_VALUES
  }

  return {
    nombres: user.nombres,
    apellidos: user.apellidos,
    cuenta: user.cuenta,
    correo: user.correo,
    idRol: user.rol ? String(user.rol.id) : '',
    fechaExpiracion: user.asignacionRol?.fecha_expiracion ?? '',
    activo: user.activo && user.id_estado === 1,
  }
}
export function EditUserDialog({ user, roles, onClose }: EditUserDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<EditUserValues>(() =>
    createInitialValues(user)
  )
  const [error, setError] = useState('')

  function updateValue<K extends keyof EditUserValues>(
    field: K,
    value: EditUserValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!user) {
      return
    }

    const nombres = values.nombres.trim()
    const apellidos = values.apellidos.trim()
    const cuenta = values.cuenta.trim()
    const correo = values.correo.trim().toLowerCase()

    if (!nombres) {
      setError('Ingresa los nombres.')
      return
    }

    if (!apellidos) {
      setError('Ingresa los apellidos.')
      return
    }

    if (!cuenta) {
      setError('Ingresa la cuenta.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    const idRol = Number(values.idRol)

    if (!Number.isInteger(idRol) || idRol <= 0) {
      setError('Selecciona un rol.')
      return
    }

    const payload: UpdateUserWithRoleInput = {
      id: user.id,
      nombres,
      apellidos,
      cuenta,
      correo,
      idRol,
      assignmentId: user.asignacionRol?.id ?? null,
      fechaAsignacion: user.asignacionRol?.fecha_asignacion ?? null,
      fechaExpiracion: values.fechaExpiracion || null,
      activo: values.activo,
    }

    startTransition(async () => {
      const result = await updateUserWithRoleAction(payload)

      if (!result.success) {
        setError(result.message)
        return
      }

      onClose()
      router.refresh()
    })
  }

  const activeRoles = roles.filter((role) => role.activo)

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>

          <DialogDescription>
            Actualiza los datos personales y el rol asignado.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="edit-nombres" label="Nombres">
              <Input
                id="edit-nombres"
                value={values.nombres}
                onChange={(event) => updateValue('nombres', event.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-apellidos" label="Apellidos">
              <Input
                id="edit-apellidos"
                value={values.apellidos}
                onChange={(event) =>
                  updateValue('apellidos', event.target.value)
                }
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-cuenta" label="Cuenta">
              <Input
                id="edit-cuenta"
                value={values.cuenta}
                onChange={(event) => updateValue('cuenta', event.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-correo" label="Correo electrónico">
              <Input
                id="edit-correo"
                type="email"
                value={values.correo}
                onChange={(event) => updateValue('correo', event.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="edit-rol" label="Rol">
              <select
                id="edit-rol"
                value={values.idRol}
                onChange={(event) => updateValue('idRol', event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                disabled={isPending}
                required
              >
                <option value="">Selecciona un rol</option>

                {activeRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombre}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="edit-activo" label="Estado de asignación">
              <select
                id="edit-activo"
                value={values.activo ? 'true' : 'false'}
                onChange={(event) =>
                  updateValue('activo', event.target.value === 'true')
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                disabled={isPending}
              >
                <option value="true">Activo</option>

                <option value="false">Inactivo</option>
              </select>
            </FormField>

            <FormField id="edit-fecha-expiracion" label="Expiración del rol">
              <Input
                id="edit-fecha-expiracion"
                type="date"
                value={values.fechaExpiracion}
                onChange={(event) =>
                  updateValue('fechaExpiracion', event.target.value)
                }
                disabled={isPending}
              />
            </FormField>
          </div>

          {error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
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
