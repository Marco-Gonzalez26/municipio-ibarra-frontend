export type RoleCode = 'ADMIN' | 'SUPERVISOR' | 'PASANTE' | 'LECTOR'

export interface Role {
  id: number
  codigo: RoleCode
  nombre: string
  descripcion: string
  url_ruta: string | null
  es_admin: boolean
  activo: boolean
}

export interface UserRoleAssignment {
  id: number
  id_usuario: number
  id_rol: number
  fecha_asignacion: string
  fecha_expiracion: string | null
  asignado_por: number | null
  activo: number
  observacion: string | null
}

export interface RolesResponse {
  total: number
  data: Role[]
}

export interface UserRolesResponse {
  msg: string
  data: UserRoleAssignment[]
}

export interface CreateUserRoleDTO {
  id_usuario: number
  id_rol: number
  fecha_asignacion: string
  fecha_expiracion: string | null
  asignado_por: number
  activo: number
  observacion: string | null
}

export interface UpdateUserRoleDTO {
  id_usuario: number
  id_rol: number
  fecha_asignacion: string
  fecha_expiracion: string | null
  asignado_por: number | null
  activo: number
  observacion: string | null
}
