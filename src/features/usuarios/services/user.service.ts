import { api, authHeader, ApiError } from '@/lib/https'
import { mockUsers } from '../data/mock-users'
import type {
  Usuario,
  UsuarioCreateDTO,
  UsuarioListResponse,
} from '../types/user.type'

type UserResponseShape = {
  ok?: boolean
  total?: number
  usuarios?: Usuario[]
  users?: Usuario[]
  data?: Usuario[] | { usuarios?: Usuario[]; users?: Usuario[] }
}

type RawUsersResponse = Usuario[] | UserResponseShape

// Acepta varias respuestas del backend sin romper la tabla.
function normalizeUsersResponse(
  response: RawUsersResponse
): UsuarioListResponse {
  if (Array.isArray(response)) {
    return {
      ok: true,
      total: response.length,
      usuarios: response,
    }
  }

  const payload: UserResponseShape = response

  if (Array.isArray(payload.usuarios)) {
    return {
      ok: payload.ok ?? true,
      total: payload.total ?? payload.usuarios.length,
      usuarios: payload.usuarios,
    }
  }

  if (Array.isArray(payload.users)) {
    return {
      ok: payload.ok ?? true,
      total: payload.total ?? payload.users.length,
      usuarios: payload.users,
    }
  }

  if (Array.isArray(payload.data)) {
    return {
      ok: payload.ok ?? true,
      total: payload.total ?? payload.data.length,
      usuarios: payload.data,
    }
  }

  if (payload.data && !Array.isArray(payload.data)) {
    const data = payload.data

    if (Array.isArray(data.usuarios)) {
      return {
        ok: payload.ok ?? true,
        total: payload.total ?? data.usuarios.length,
        usuarios: data.usuarios,
      }
    }

    if (Array.isArray(data.users)) {
      return {
        ok: payload.ok ?? true,
        total: payload.total ?? data.users.length,
        usuarios: data.users,
      }
    }
  }

  return {
    ok: true,
    total: mockUsers.length,
    usuarios: mockUsers,
  }
}

export const userService = {
  async getAll(
    page = 1,
    limit = 15,
    token?: string
  ): Promise<UsuarioListResponse> {
    try {
      const response = await api.get<RawUsersResponse>(
        `/usuarios?page=${page}&limit=${limit}`,
        { headers: authHeader(token) }
      )

      return normalizeUsersResponse(response)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) throw error

      console.warn('No se pudo cargar /usuarios. Usando datos mock.', error)
      return {
        ok: true,
        total: mockUsers.length,
        usuarios: mockUsers,
      }
    }
  },

  getById: (id: number) => api.get<Usuario>(`/usuarios/${id}`),

  create: (payload: UsuarioCreateDTO) =>
    api.post<{ ok: boolean; usuario: Usuario }>('/usuarios', {
      body: payload,
    }),

  update: (id: number, payload: UsuarioCreateDTO) =>
    api.put<{ ok: boolean; usuario: Usuario }>(`/usuarios/${id}`, {
      body: payload,
    }),

  remove: (id: number) =>
    api.delete<{ ok: boolean; msg: string }>(`/usuarios/${id}`),
}
