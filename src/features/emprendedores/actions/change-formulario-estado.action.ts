'use server'

import { revalidatePath } from 'next/cache'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { requireSession } from '@/features/auth/services/session.service'

export async function changeFormularioEstadoAction(
  formularioId: number,
  idEstadoEmprendedor: number
) {
  const session = await requireSession()
  await entrepeneurFormService.updateReferenciaGeneral(
    formularioId,
    { id_estado_emprendedor: idEstadoEmprendedor },
    session.token
  )
  revalidatePath('/emprendedores')
}
