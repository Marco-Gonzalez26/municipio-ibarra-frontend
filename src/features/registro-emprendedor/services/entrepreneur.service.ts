import { api, authHeader } from '@/lib/https'
import type {
  Emprendedor,
  EmprendedorCreateDTO,
  EmprendedorListResponse,
} from '@/types/entrepreneur.type'
import type { EmprendedorResponse } from '@/types/form.type'

export const entrepreneurService = {
  getAll: (page = 1, limit = 15, token?: string) => {
    return api.get<EmprendedorListResponse>(
      `/emprendedor?limit=${limit}&page=${page}`,
      { headers: authHeader(token) }
    )
  },

  getById: async (id: number, token?: string) => {
    const res = await api.get<EmprendedorResponse>(`/emprendedor/${id}`, {
      headers: authHeader(token),
    })
    return res.emprendedor
  },

  create: (payload: EmprendedorCreateDTO) =>
    api.post<EmprendedorResponse>('/emprendedor', { body: payload }),

  update: (id: number, payload: EmprendedorCreateDTO, token?: string) =>
    api.put<{ ok: boolean; msg: string }>(`/emprendedor/${id}`, {
      body: payload,
      headers: authHeader(token),
    }),

  remove: (id: number, token?: string) =>
    api.delete<{ ok: boolean; msg: string }>(`/emprendedor/${id}`, {
      headers: authHeader(token),
    }),
}
