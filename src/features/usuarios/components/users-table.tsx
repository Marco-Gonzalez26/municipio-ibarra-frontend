'use client'

import { useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { CreateUserDialog } from './create-user-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EditUserDialog } from './edit-user-dialog'
import { DeactivateUserDialog } from './deactivate-user-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary *:text-center">
              <TableHead className="text-primary-foreground">ID</TableHead>

              <TableHead className="text-primary-foreground">Nombre</TableHead>

              <TableHead className="text-primary-foreground">Cuenta</TableHead>

              <TableHead className="text-primary-foreground">Correo</TableHead>

              <TableHead className="text-primary-foreground">Rol</TableHead>

              <TableHead className="text-primary-foreground">Estado</TableHead>

              <TableHead className="text-primary-foreground">Fecha</TableHead>

              <TableHead className="text-primary-foreground text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.map((user) => {
              const isActive = user.activo && user.id_estado === 1

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
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                      {isActive ? 'ACTIVO' : 'INACTIVO'}
                    </Badge>
                  </TableCell>

                  <TableCell>{formatDate(user.fecha_registro)}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
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
                        onClick={() => setDeactivatingUser(user)}
                        disabled={!isActive}
                        title={
                          isActive ? 'Desactivar usuario' : 'Usuario inactivo'
                        }
                      >
                        <Trash2 className="size-4 text-red-500" />
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
        user={editingUser}
        roles={roles}
        onClose={() => setEditingUser(null)}
      />
      <DeactivateUserDialog
        user={deactivatingUser}
        onClose={() => setDeactivatingUser(null)}
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

            <InfoItem
              label="Estado"
              value={user.activo ? 'Activo' : 'Inactivo'}
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
