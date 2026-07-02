import { api } from '@/lib/https'
import type {
  Emprendedor,
  EmprendedorCreateDTO,
} from '@/types/entrepreneur.type'
import { EmprendedoresResponse, EmprendedorResponse } from '@/types/form.type'

export const entrepreneurService = {
  getAll: () => api.get<EmprendedoresResponse>('/emprendedor?limit=50&page=1'),

  create: (payload: EmprendedorCreateDTO) =>
    api.post<EmprendedorResponse>('/emprendedor', { body: payload }),
}
