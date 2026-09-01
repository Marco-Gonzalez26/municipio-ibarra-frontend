'use server'

import { revalidatePath } from 'next/cache'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import type { FormularioAsistenciaTecnicaUpdateDTO } from '@/types/form.type'

export async function updateAsistenciaAction(
  id: number,
  payload: FormularioAsistenciaTecnicaUpdateDTO
) {
  const session = await requireSession()
  await withSessionRedirect(() =>
    entrepeneurFormService.updateAsistenciaTecnica(id, payload, session.token)
  )
  revalidatePath('/formularios/asistencia')
  revalidatePath('/formularios/referencia')
}
