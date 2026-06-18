import { api } from '@/lib/https'
import type {
  Emprendedor,
  EmprendedorCreateDTO,
} from '@/types/entrepreneur.type'

export const entrepreneurService = {
  create: (payload: EmprendedorCreateDTO) =>
    api.post<Emprendedor>('/emprendedor', { body: payload }),
}
