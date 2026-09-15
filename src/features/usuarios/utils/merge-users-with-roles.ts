import type { Usuario } from '../types/user.type'
import type { Role, UserRoleAssignment } from '../types/user-role.type'
import type { PerfilUsuario } from '../services/perfil.service'

export interface UsuarioConRol extends Usuario {
  rol: Role | null
  asignacionRol: UserRoleAssignment | null
  perfil: PerfilUsuario | null
}

export function mergeUsersWithRoles(
  users: Usuario[],
  roles: Role[],
  assignments: UserRoleAssignment[],
  perfiles: PerfilUsuario[] = []
): UsuarioConRol[] {
  return users.map((user) => {
    const assignment =
      assignments.find(
        (item) => item.id_usuario === user.id && item.activo === 1
      ) ?? null

    const role = assignment
      ? (roles.find((item) => item.id === assignment.id_rol) ?? null)
      : null

    const perfil = perfiles.find((item) => item.id_usuario === user.id) ?? null

    return {
      ...user,
      rol: role,
      asignacionRol: assignment,
      perfil,
    }
  })
}
