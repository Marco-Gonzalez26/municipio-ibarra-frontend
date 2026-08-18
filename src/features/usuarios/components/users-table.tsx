'use client'

import { useState } from 'react'
import { Eye, Pencil, Plus, Trash2, Unlock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateUserDialog } from './create-user-dialog'
import { DeactivateUserDialog } from './deactivate-user-dialog'
import { EditUserDialog } from './edit-user-dialog'
import { UnlockUserDialog } from './unlock-user-dialog'

import type { Role } from '../types/user-role.type'
import type { UsuarioConRol } from '../utils/merge-users-with-roles'

interface UsersTableProps {
  users: UsuarioConRol[]
  roles: Role[]
}

export function UsersTable({ users, roles }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UsuarioConRol | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UsuarioConRol | null>(null)
  const [deactivatingUser, setDeactivatingUser] =
    useState<UsuarioConRol | null>(null)
  const [unlockingUser, setUnlockingUser] = useState<UsuarioConRol | null>(null)
  const filteredUsers = users.filter((user) => {
    const searchString = `
      ${user.nombres}
      ${user.apellidos}
      ${user.cuenta}
      ${user.correo}
      ${user.rol?.nombre ?? ''}
    `.toLowerCase()

    return searchString.includes(searchTerm.toLowerCase())
  })

  return (
    <>
      <div className="flex items-start justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre, cuenta o correo..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{
            padding: '8px',
            marginBottom: '20px',
            width: '400px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #d40924',
          }}
        />

        <Button type="button" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table className="min-w-[52rem]">
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">ID</TableHead>

              <TableHead className="text-primary-foreground">Nombre</TableHead>

              <TableHead className="text-primary-foreground">Cuenta</TableHead>

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
            {filteredUsers.map((user) => {
              const isActive = user.activo && user.id_estado === 1

              const isBlocked = user.intentos_fallidos >= 5

              return (
                <TableRow key={user.id} className="text-center">
                  <TableCell className="font-medium text-primary">
                    USR-{user.id}
                  </TableCell>

                  <TableCell>
                    {user.nombres} {user.apellidos}
                  </TableCell>

                  <TableCell>{user.cuenta}</TableCell>

                  <TableCell>{user.correo}</TableCell>

                  <TableCell>{user.rol?.nombre ?? 'Sin rol'}</TableCell>

                  <TableCell>
                    {isBlocked ? (
                      <Badge variant="destructive">BLOQUEADO</Badge>
                    ) : isActive ? (
                      <Badge variant="default">ACTIVO</Badge>
                    ) : (
                      <Badge variant="secondary">INACTIVO</Badge>
                    )}
                  </TableCell>

                  <TableCell>{formatDate(user.fecha_registro)}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Ver detalle"
                        aria-label={`Ver usuario ${user.nombres}`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="size-4 text-blue-500" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="Editar usuario"
                        aria-label={`Editar usuario ${user.nombres}`}
                        onClick={() => setEditingUser(user)}
                        disabled={!isActive}
                      >
                        <Pencil className="size-4 text-yellow-500" />
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeactivatingUser(user)}
                        disabled={!isActive}
                        title={
                          isActive ? 'Desactivar usuario' : 'Usuario inactivo'
                        }
                        aria-label={`Desactivar usuario ${user.nombres}`}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setUnlockingUser(user)}
                        disabled={!isBlocked || !isActive}
                        title={
                          isBlocked && isActive
                            ? 'Desbloquear usuario'
                            : 'El usuario no está bloqueado'
                        }
                        aria-label={`Desbloquear usuario ${user.nombres}`}
                      >
                        <Unlock
                          className={
                            isBlocked && isActive
                              ? 'size-4 text-green-600'
                              : 'size-4 text-muted-foreground'
                          }
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No existen usuarios que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <UserDetailDialog
        user={selectedUser}
        roles={roles}
        onClose={() => setSelectedUser(null)}
      />

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        roles={roles}
      />

      <EditUserDialog
        key={editingUser?.id ?? 'edit-user-closed'}
        user={editingUser}
        roles={roles}
        onClose={() => setEditingUser(null)}
      />

      <DeactivateUserDialog
        user={deactivatingUser}
        onClose={() => setDeactivatingUser(null)}
      />

      <UnlockUserDialog
        user={unlockingUser}
        onClose={() => setUnlockingUser(null)}
      />
    </>
  )
}

function UserDetailDialog({
  user,
  roles,
  onClose,
}: {
  user: UsuarioConRol | null
  roles: Role[]
  onClose: () => void
}) {
  const isActive = Boolean(user?.activo) && user?.id_estado === 1

  const isBlocked = (user?.intentos_fallidos ?? 0) >= 5

  function getUserStatus() {
    if (isBlocked) {
      return 'Bloqueado'
    }

    if (isActive) {
      return 'Activo'
    }

    return 'Inactivo'
  }

  return (
    <Dialog
      open={Boolean(user)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del usuario</DialogTitle>

          <DialogDescription>
            Información administrativa del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Identificador" value={`USR-${user.id}`} />

            <InfoItem label="Nombres" value={user.nombres} />

            <InfoItem label="Apellidos" value={user.apellidos} />

            <InfoItem label="Cuenta" value={user.cuenta} />

            <InfoItem label="Correo" value={user.correo} />

            <InfoItem
              label="Rol"
              value={user.rol?.nombre ?? 'Sin rol asignado'}
            />

            <InfoItem label="Estado" value={getUserStatus()} />

            <InfoItem
              label="Intentos fallidos"
              value={String(user.intentos_fallidos)}
            />

            <InfoItem
              label="Vigencia desde"
              value={formatDate(user.fecha_vigencia_desde)}
            />

            <InfoItem
              label="Vigencia hasta"
              value={formatDate(user.fecha_vigencia_hasta)}
            />

            <InfoItem
              label="Fecha de registro"
              value={formatDateTime(user.fecha_registro)}
            />

            <InfoItem
              label="Último acceso"
              value={formatDateTime(user.fecha_ultimo_acceso)}
            />

            <InfoItem label="Roles disponibles" value={String(roles.length)} />

            <InfoItem
              label="Asignación de rol"
              value={
                user.asignacionRol
                  ? `ASG-${user.asignacionRol.id}`
                  : 'Sin asignación'
              }
            />

            <InfoItem
              label="Cambio de contraseña requerido"
              value={user.requiere_cambio_pass ? 'Sí' : 'No'}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString('es-EC')
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
