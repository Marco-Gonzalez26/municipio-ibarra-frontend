export interface LoginCredentials {
  identificador: string
  contrasena: string
}

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

export interface AuthUser {
  id: number
  nombres: string
  requiere_cambio_pass: boolean
  rol: Role | null
}

export interface LoginResponse {
  msg: string
  token: string
  usuario: Omit<AuthUser, 'rol'>
}

export interface Session {
  token: string
  usuario: AuthUser
}
