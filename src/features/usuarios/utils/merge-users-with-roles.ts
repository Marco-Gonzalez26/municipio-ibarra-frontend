import type { Usuario } from '../types/user.type'
import type { Role, UserRoleAssignment } from '../types/user-role.type'

export interface UsuarioConRol extends Usuario {
  rol: Role | null
  asignacionRol: UserRoleAssignment | null
}

export function mergeUsersWithRoles(
  users: Usuario[],
  roles: Role[],
  assignments: UserRoleAssignment[]
): UsuarioConRol[] {
  return users.map((user) => {
    const assignment =
      assignments.find(
        (item) => item.id_usuario === user.id && item.activo === 1
      ) ?? null

    const role = assignment
      ? (roles.find((item) => item.id === assignment.id_rol) ?? null)
      : null

    return {
      ...user,
      rol: role,
      asignacionRol: assignment,
    }
  })
}
