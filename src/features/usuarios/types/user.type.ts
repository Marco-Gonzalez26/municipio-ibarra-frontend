export interface Usuario {
  id: number
  cuenta: string
  correo: string
  id_estado: number
  fecha_vigencia_desde: string
  fecha_vigencia_hasta: string | null
  nombres: string
  apellidos: string
  intentos_fallidos: number
  fecha_ultimo_acceso: string | null
  requiere_cambio_pass: boolean
  activo: boolean
  fecha_registro: string
  fecha_actualizacion: string
}

export interface UsuarioListResponse {
  total: number
  pages: number
  currentPage: number
  usuarios: Usuario[]
}

export interface UsuarioCreateDTO {
  cuenta: string
  correo: string
  contrasena: string
  id_estado: number
  fecha_vigencia_desde: string
  fecha_vigencia_hasta: string | null
  nombres: string
  apellidos: string
  intentos_fallidos: number
  requiere_cambio_pass: boolean
  activo: boolean
}

export interface UsuarioUpdateDTO {
  cuenta: string
  correo: string
  nombres: string
  apellidos: string
}
