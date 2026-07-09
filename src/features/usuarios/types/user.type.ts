export interface Usuario {
  id: number
  nombres: string
  apellidos: string
  email: string
  rol: string
  activo: boolean
  fecha_registro: string
}

export interface UsuarioListResponse {
  ok: boolean
  total: number
  usuarios: Usuario[]
}

export type UsuarioCreateDTO = Omit<Usuario, 'id' | 'fecha_registro'>
