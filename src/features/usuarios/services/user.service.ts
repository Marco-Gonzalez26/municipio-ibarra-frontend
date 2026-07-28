import { api, authHeader } from '@/lib/https'
import type {
  Usuario,
  UsuarioCreateDTO,
  UsuarioListResponse,
  UsuarioUpdateDTO,
} from '../types/user.type'

interface UsersApiResponse {
  total: number
  pages: number
  currentPage: number
  data: Usuario[]
}

export const userService = {
  async getAll(
    page = 1,
    limit = 15,
    token: string,
    search = ''
  ): Promise<UsuarioListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    if (search.trim()) {
      params.set('busqueda', search.trim())
    }

    const response = await api.get<UsersApiResponse>(
      `/usuarios?${params.toString()}`,
      {
        headers: authHeader(token),
      }
    )

    return {
      total: response.total,
      pages: response.pages,
      currentPage: response.currentPage,
      usuarios: response.data,
    }
  },

  getById: (id: number, token: string) =>
    api.get<Usuario>(`/usuarios/${id}`, {
      headers: authHeader(token),
    }),

  create: (payload: UsuarioCreateDTO, token: string) =>
    api.post<{ msg: string; data?: Usuario }>('/usuarios', {
      body: payload,
      headers: authHeader(token),
    }),

  update: (id: number, payload: UsuarioUpdateDTO, token: string) =>
    api.put<{ msg: string; data?: Usuario }>(`/usuarios/${id}`, {
      body: payload,
      headers: authHeader(token),
    }),

  remove: (id: number, token: string) =>
    api.delete<{ msg: string }>(`/usuarios/${id}`, {
      headers: authHeader(token),
    }),

  changeStatus: (id: number, idEstado: number, token: string) =>
    api.patch<{ msg: string }>(`/usuarios/${id}`, {
      body: {
        id_estado: idEstado,
      },
      headers: authHeader(token),
    }),

  resetAttempts: (id: number, token: string) =>
    api.patch<{ msg: string }>(`/usuarios/intentos/${id}`, {
      headers: authHeader(token),
    }),
}
