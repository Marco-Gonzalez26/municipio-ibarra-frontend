'use server'

import { revalidatePath } from 'next/cache'
import { requireSession, withSessionRedirect } from '@/features/auth/services/session.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'

export async function deleteAsistenciaAction(id: number) {
  const session = await requireSession()
  await withSessionRedirect(() => entrepeneurFormService.deleteAsistenciaTecnica(id, session.token))
  revalidatePath('/formularios/asistencia')
}
