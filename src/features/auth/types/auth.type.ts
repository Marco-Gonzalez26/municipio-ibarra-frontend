export interface LoginCredentials {
  identificador: string
  contrasena: string
}

export interface AuthUser {
  id: number
  nombres: string
  requiere_cambio_pass: boolean
}

export interface LoginResponse {
  msg: string
  token: string
  usuario: AuthUser
}

export interface Session {
  token: string
  usuario: AuthUser
}
