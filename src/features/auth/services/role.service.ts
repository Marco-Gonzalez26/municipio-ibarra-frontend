import { api, authHeader } from '@/lib/https'
import type { Role, UserRoleAssignment } from '../types/auth.type'

interface RolesResponse {
  total: number
  data: Role[]
}

interface UserRolesResponse {
  msg: string
  data: UserRoleAssignment[]
}

export const roleService = {
  getRoles: (token: string) =>
    api.get<RolesResponse>('/catrol', {
      headers: authHeader(token),
    }),

  getUserRoles: (token: string) =>
    api.get<UserRolesResponse>('/usuariorol', {
      headers: authHeader(token),
    }),
}
