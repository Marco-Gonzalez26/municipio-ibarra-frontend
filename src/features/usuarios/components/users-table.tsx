'use client'

import { FormEvent, useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Usuario } from '../types/user.type'

interface UsersTableProps {
  users: Usuario[]
}

type UserFormValues = {
  nombres: string
  apellidos: string
  email: string
  rol: string
  activo: boolean
}

const EMPTY_USER: UserFormValues = {
  nombres: '',
  apellidos: '',
  email: '',
  rol: 'Consulta',
  activo: true,
}

export function UsersTable({ users }: UsersTableProps) {
  // Edición visual hasta confirmar endpoints de usuarios.
  const [rows, setRows] = useState<Usuario[]>(Array.isArray(users) ? users : [])
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [deleteUser, setDeleteUser] = useState<Usuario | null>(null)

  function handleUpdate(id: number, values: UserFormValues) {
    setRows((current) =>
      current.map((user) => (user.id === id ? { ...user, ...values } : user))
    )
    setEditingUser(null)
  }

  function handleDelete(id: number) {
    setRows((current) => current.filter((user) => user.id !== id))
    setDeleteUser(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">ID</TableHead>
              <TableHead className="text-primary-foreground">Nombre</TableHead>
              <TableHead className="text-primary-foreground">Correo</TableHead>
              <TableHead className="text-primary-foreground">Rol</TableHead>
              <TableHead className="text-primary-foreground">Estado</TableHead>
              <TableHead className="text-primary-foreground">Fecha</TableHead>
              <TableHead className="text-right text-primary-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((user) => (
              <TableRow key={user.id} className="text-center">
                <TableCell className="font-medium text-primary">
                  USR-{user.id}
                </TableCell>
                <TableCell>
                  {user.nombres} {user.apellidos}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>
                  <Badge variant={user.activo ? 'default' : 'secondary'}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.fecha_registro)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="size-4 text-blue-500" />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingUser(user)}
                    >
                      <Pencil className="size-4 text-yellow-500" />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteUser(user)}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No existen usuarios registrados.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <UserDetailDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <UserFormDialog
        key={editingUser?.id ?? 'empty-user'}
        open={Boolean(editingUser)}
        title="Editar usuario"
        description="Actualiza visualmente la información del usuario seleccionado."
        initialValues={toFormValues(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
        onSubmit={(values) => {
          if (editingUser) handleUpdate(editingUser.id, values)
        }}
      />

      <DeleteUserDialog
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => {
          if (deleteUser) handleDelete(deleteUser.id)
        }}
      />
    </>
  )
}

function UserDetailDialog({
  user,
  onClose,
}: {
  user: Usuario | null
  onClose: () => void
}) {
  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle del usuario</DialogTitle>
          <DialogDescription>
            Información administrativa del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="grid gap-4 md:grid-cols-3">
            <InfoItem label="Nombres" value={user.nombres} />
            <InfoItem label="Apellidos" value={user.apellidos} />
            <InfoItem label="Correo" value={user.email} />
            <InfoItem label="Rol" value={user.rol} />
            <InfoItem
              label="Estado"
              value={user.activo ? 'Activo' : 'Inactivo'}
            />
            <InfoItem label="Fecha" value={formatDate(user.fecha_registro)} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function UserFormDialog({
  open,
  title,
  description,
  initialValues,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  title: string
  description: string
  initialValues: UserFormValues
  onOpenChange: (open: boolean) => void
  onSubmit: (values: UserFormValues) => void
}) {
  const [values, setValues] = useState<UserFormValues>(initialValues)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                value={values.nombres}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    nombres: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                value={values.apellidos}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    apellidos: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={values.rol}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    rol: event.target.value,
                  }))
                }
              >
                <option value="Administrador">Administrador</option>
                <option value="Técnico Municipal">Técnico Municipal</option>
                <option value="Consulta">Consulta</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <select
                id="activo"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                value={values.activo ? 'true' : 'false'}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    activo: event.target.value === 'true',
                  }))
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteUserDialog({
  user,
  onClose,
  onConfirm,
}: {
  user: Usuario | null
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Eliminar usuario
          </DialogTitle>
          <DialogDescription>
            ¿Deseas retirar de la vista al usuario{' '}
            <span className="font-semibold text-foreground">
              {user ? `${user.nombres} ${user.apellidos}` : 'seleccionado'}
            </span>
            ? Esta acción es visual dentro del prototipo local.
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function toFormValues(user: Usuario | null): UserFormValues {
  if (!user) return EMPTY_USER

  return {
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  }
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-EC')
}
