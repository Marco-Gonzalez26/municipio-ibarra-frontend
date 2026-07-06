import { api } from '@/lib/https'
import type {
  Emprendedor,
  EmprendedorCreateDTO,
  EmprendedorListResponse,
} from '@/types/entrepreneur.type'
import type { EmprendedorResponse } from '@/types/form.type'

export const entrepreneurService = {
  getAll: (page = 1, limit = 15) => {
    return api.get<EmprendedorListResponse>(
      `/emprendedor?limit=${limit}&page=${page}`
    )
  },

  getById: async (id: number) => {
    const res = await api.get<EmprendedorResponse>(`/emprendedor/${id}`)
    return res.emprendedor
  },

  create: (payload: EmprendedorCreateDTO) =>
    api.post<EmprendedorResponse>('/emprendedor', { body: payload }),

  update: (id: number, payload: EmprendedorCreateDTO) =>
    api.put<{ ok: boolean; msg: string }>(`/emprendedor/${id}`, {
      body: payload,
    }),

  remove: (id: number) =>
    api.delete<{ ok: boolean; msg: string }>(`/emprendedor/${id}`),
}
