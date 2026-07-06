'use server'

import { revalidatePath } from 'next/cache'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import type { EmprendedorCreateDTO } from '@/types/entrepreneur.type'

export async function updateEntrepreneurAction(
  id: number,
  payload: EmprendedorCreateDTO
) {
  await entrepreneurService.update(id, payload)
  revalidatePath('/emprendedores')
  revalidatePath(`/emprendedores/${id}/editar`)
}
