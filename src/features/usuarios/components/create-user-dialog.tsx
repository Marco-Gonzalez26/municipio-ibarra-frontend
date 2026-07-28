'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

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
  createUserWithRoleAction,
  type CreateUserWithRoleInput,
} from '../actions/create-user.action'
import type { Role } from '../types/user-role.type'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: Role[]
}

interface UserFormValues {
  nombres: string
  apellidos: string
  cuenta: string
  correo: string
  contrasena: string
  confirmarContrasena: string
  idRol: string
  fechaVigenciaDesde: string
  fechaVigenciaHasta: string
  activo: boolean
}

function createInitialValues(): UserFormValues {
  return {
    nombres: '',
    apellidos: '',
    cuenta: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    idRol: '',
    fechaVigenciaDesde: getCurrentDate(),
    fechaVigenciaHasta: '',
    activo: true,
  }
}

export function CreateUserDialog({
  open,
  onOpenChange,
  roles,
}: CreateUserDialogProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<UserFormValues>(createInitialValues)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const activeRoles = roles.filter((role) => role.activo)

  useEffect(() => {
    if (!open) {
      setValues(createInitialValues())
      setError('')
      setShowPassword(false)
    }
  }, [open])

  function updateValue<K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const nombres = values.nombres.trim()
    const apellidos = values.apellidos.trim()
    const cuenta = values.cuenta.trim()
    const correo = values.correo.trim().toLowerCase()
    const contrasena = values.contrasena
    const confirmarContrasena = values.confirmarContrasena

    if (!nombres) {
      setError('Ingresa los nombres.')
      return
    }

    if (!apellidos) {
      setError('Ingresa los apellidos.')
      return
    }

    if (!cuenta) {
      setError('Ingresa la cuenta del usuario.')
      return
    }

    if (!correo) {
      setError('Ingresa el correo electrónico.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    if (!contrasena) {
      setError('Ingresa una contraseña.')
      return
    }

    if (!confirmarContrasena) {
      setError('Confirma la contraseña.')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    if (!passwordPattern.test(contrasena)) {
      setError(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      )
      return
    }

    const idRol = Number(values.idRol)

    if (!Number.isInteger(idRol) || idRol <= 0) {
      setError('Selecciona un rol.')
      return
    }

    if (!values.fechaVigenciaDesde) {
      setError('Selecciona la fecha de vigencia inicial.')
      return
    }

    if (
      values.fechaVigenciaHasta &&
      values.fechaVigenciaHasta < values.fechaVigenciaDesde
    ) {
      setError(
        'La fecha de vigencia hasta no puede ser anterior a la fecha inicial.'
      )
      return
    }

    const payload: CreateUserWithRoleInput = {
      nombres,
      apellidos,
      cuenta,
      correo,
      contrasena,
      idRol,
      fechaVigenciaDesde: values.fechaVigenciaDesde,
      fechaVigenciaHasta: values.fechaVigenciaHasta || null,
      activo: values.activo,
    }

    startTransition(async () => {
      const result = await createUserWithRoleAction(payload)

      if (!result.success) {
        setError(result.message)
        return
      }

      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>

          <DialogDescription>
            Registra un usuario y asigna su rol dentro del sistema.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="nombres" label="Nombres">
              <Input
                id="nombres"
                value={values.nombres}
                onChange={(event) => updateValue('nombres', event.target.value)}
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="apellidos" label="Apellidos">
              <Input
                id="apellidos"
                value={values.apellidos}
                onChange={(event) =>
                  updateValue('apellidos', event.target.value)
                }
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="cuenta" label="Cuenta">
              <Input
                id="cuenta"
                value={values.cuenta}
                onChange={(event) => updateValue('cuenta', event.target.value)}
                placeholder="Ej. analista.04"
                autoComplete="username"
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="correo" label="Correo electrónico">
              <Input
                id="correo"
                type="email"
                value={values.correo}
                onChange={(event) => updateValue('correo', event.target.value)}
                placeholder="usuario@ibarra.gob.ec"
                autoComplete="email"
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="contrasena" label="Contraseña">
              <div className="relative">
                <Input
                  id="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  value={values.contrasena}
                  onChange={(event) =>
                    updateValue('contrasena', event.target.value)
                  }
                  className="pr-10"
                  placeholder="Ej. Usuario01@"
                  autoComplete="new-password"
                  disabled={isPending}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FormField>

            <FormField id="confirmarContrasena" label="Confirmar contraseña">
              <Input
                id="confirmarContrasena"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmarContrasena}
                onChange={(event) =>
                  updateValue('confirmarContrasena', event.target.value)
                }
                autoComplete="new-password"
                disabled={isPending}
                minLength={8}
                required
              />
            </FormField>

            <FormField id="idRol" label="Rol">
              <select
                id="idRol"
                value={values.idRol}
                onChange={(event) => updateValue('idRol', event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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

            <FormField id="activo" label="Estado">
              <select
                id="activo"
                value={values.activo ? 'true' : 'false'}
                onChange={(event) =>
                  updateValue('activo', event.target.value === 'true')
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                disabled={isPending}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </FormField>

            <FormField id="fechaVigenciaDesde" label="Vigencia desde">
              <Input
                id="fechaVigenciaDesde"
                type="date"
                value={values.fechaVigenciaDesde}
                onChange={(event) =>
                  updateValue('fechaVigenciaDesde', event.target.value)
                }
                disabled={isPending}
                required
              />
            </FormField>

            <FormField id="fechaVigenciaHasta" label="Vigencia hasta">
              <Input
                id="fechaVigenciaHasta"
                type="date"
                value={values.fechaVigenciaHasta}
                min={values.fechaVigenciaDesde}
                onChange={(event) =>
                  updateValue('fechaVigenciaHasta', event.target.value)
                }
                disabled={isPending}
              />
            </FormField>
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
                'Guardar usuario'
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

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
