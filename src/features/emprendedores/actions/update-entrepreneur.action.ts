'use server'

import { revalidatePath } from 'next/cache'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import type { EmprendedorCreateDTO } from '@/types/entrepreneur.type'

export async function updateEntrepreneurAction(
  id: number,
  payload: EmprendedorCreateDTO
) {
  const session = await requireSession()
  await withSessionRedirect(() =>
    entrepreneurService.update(id, payload, session.token)
  )
  revalidatePath('/emprendedores')
  revalidatePath(`/emprendedores/${id}/editar`)
}
