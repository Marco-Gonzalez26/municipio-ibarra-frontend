import { api } from '@/lib/https'
import type { EmprendedorCreateDTO } from '@/types/entrepreneur.type'
import { EmprendedorResponse } from '@/types/form.type'

export const entrepreneurService = {
  create: (payload: EmprendedorCreateDTO) =>
    api.post<EmprendedorResponse>('/emprendedor', { body: payload }),
}
