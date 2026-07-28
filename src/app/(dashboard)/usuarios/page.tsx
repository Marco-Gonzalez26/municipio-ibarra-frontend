import { unstable_rethrow } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UsersTable } from '@/features/usuarios/components/users-table'
import { TablePagination } from '@/features/emprendedores/components/table-pagination'
import { userService } from '@/features/usuarios/services/user.service'
import { userRoleService } from '@/features/usuarios/services/user-role.service'
import { mergeUsersWithRoles } from '@/features/usuarios/utils/merge-users-with-roles'
import {
  requireAdmin,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import type { Role } from '@/features/usuarios/types/user-role.type'
import type { UsuarioConRol } from '@/features/usuarios/utils/merge-users-with-roles'

const LIMIT = 15

interface UsuariosPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function UsuariosPage({
  searchParams,
}: UsuariosPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)

  const session = await requireAdmin()

  let users: UsuarioConRol[] = []
  let roles: Role[] = []
  let total = 0

  try {
    const [usersRes, rolesRes, assignmentsRes] = await withSessionRedirect(() =>
      Promise.all([
        userService.getAll(page, LIMIT, session.token),
        userRoleService.getRoles(session.token),
        userRoleService.getAllAssignments(session.token),
      ])
    )

    const usersBase = Array.isArray(usersRes.usuarios) ? usersRes.usuarios : []

    roles = Array.isArray(rolesRes.data) ? rolesRes.data : []

    const assignments = Array.isArray(assignmentsRes.data)
      ? assignmentsRes.data
      : []

    users = mergeUsersWithRoles(usersBase, roles, assignments)

    total = usersRes.total ?? users.length
  } catch (error) {
    unstable_rethrow(error)

    console.error('No se pudieron cargar los usuarios', error)
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />

        <h1 className="text-sm font-medium">Usuarios</h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 pb-6">
        <UsersTable users={users} roles={roles} />

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          total={total}
          itemLabel="usuario"
        />
      </main>
    </>
  )
}
