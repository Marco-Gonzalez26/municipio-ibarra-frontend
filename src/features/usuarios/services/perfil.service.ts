import { api, authHeader } from '@/lib/https'

export interface PerfilUsuario {
  id: number
  id_usuario: number
  dependencia: string | null
  cargo: string | null
  telefono_ext: string | null
  avatar_url: string | null
  idioma: string | null
  zona_horaria: string | null
  celular_contacto: string | null
  fecha_actualizacion: string
}

export interface PerfilUsuarioCreateDTO {
  id_usuario: number
  dependencia?: string | null
  cargo?: string | null
  telefono_ext?: string | null
  avatar_url?: string | null
  idioma?: string | null
  zona_horaria?: string | null
  celular_contacto?: string | null
}

interface PerfilListResponse {
  total: number
  data: PerfilUsuario[]
}

export const perfilService = {
  getAll: (page = 1, limit = 100, token: string) =>
    api.get<PerfilListResponse>(`/perfilusuario?limit=${limit}&page=${page}`, {
      headers: authHeader(token),
    }),

  create: (payload: PerfilUsuarioCreateDTO, token: string) =>
    api.post<{ ok: boolean; msg?: string; data?: PerfilUsuario }>(
      '/perfilusuario',
      { body: payload, headers: authHeader(token) }
    ),

  update: (
    id: number,
    payload: Partial<PerfilUsuarioCreateDTO>,
    token: string
  ) =>
    api.put<{ ok: boolean; msg?: string }>(`/perfiles/${id}`, {
      body: payload,
      headers: authHeader(token),
    }),
}
