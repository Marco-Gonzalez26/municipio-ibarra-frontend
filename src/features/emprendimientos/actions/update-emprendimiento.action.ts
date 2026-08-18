'use server'

import { revalidatePath } from 'next/cache'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import type { FormularioReferenciaGeneralUpdateDTO } from '@/types/form.type'

export async function updateEmprendimientoAction(
  id: number,
  payload: FormularioReferenciaGeneralUpdateDTO
) {
  const session = await requireSession()
  await withSessionRedirect(() =>
    entrepeneurFormService.updateReferenciaGeneral(id, payload, session.token)
  )
  revalidatePath('/emprendimientos')
  revalidatePath('/emprendedores')
  revalidatePath('/formularios/referencia')
}
