import { api, authHeader } from '@/lib/https'

import type {
  CreateUserRoleDTO,
  Role,
  RolesResponse,
  UpdateUserRoleDTO,
  UserRoleAssignment,
  UserRolesResponse,
} from '../types/user-role.type'

export const userRoleService = {
  getRoles: (token: string) =>
    api.get<RolesResponse>('/catrol', {
      headers: authHeader(token),
    }),

  getAllAssignments: (token: string) =>
    api.get<UserRolesResponse>('/usuariorol', {
      headers: authHeader(token),
    }),

  getAssignmentById: (id: number, token: string) =>
    api.get<{
      msg: string
      data: UserRoleAssignment
    }>(`/usuariorol/${id}`, {
      headers: authHeader(token),
    }),

  createAssignment: (payload: CreateUserRoleDTO, token: string) =>
    api.post<{
      msg: string
      data: UserRoleAssignment
    }>('/usuariorol', {
      body: payload,
      headers: authHeader(token),
    }),

  updateAssignment: (id: number, payload: UpdateUserRoleDTO, token: string) =>
    api.put<{
      msg: string
      data: UserRoleAssignment
    }>(`/usuariorol/${id}`, {
      body: payload,
      headers: authHeader(token),
    }),

  deleteAssignment: (id: number, token: string) =>
    api.delete<{
      msg: string
      data?: UserRoleAssignment
    }>(`/usuariorol/${id}`, {
      headers: authHeader(token),
    }),

  findActiveAssignmentByUserId: async (
    userId: number,
    token: string
  ): Promise<UserRoleAssignment | null> => {
    const response = await api.get<UserRolesResponse>('/usuariorol', {
      headers: authHeader(token),
    })

    return (
      response.data.find(
        (assignment) =>
          assignment.id_usuario === userId && assignment.activo === 1
      ) ?? null
    )
  },

  findRoleById: async (roleId: number, token: string): Promise<Role | null> => {
    const response = await api.get<RolesResponse>('/catrol', {
      headers: authHeader(token),
    })

    return (
      response.data.find((role) => role.id === roleId && role.activo) ?? null
    )
  },
}
