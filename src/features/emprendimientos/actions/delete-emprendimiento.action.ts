'use server'

import { revalidatePath } from 'next/cache'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import { ApiError } from '@/lib/https'

function isNotFound(error: unknown) {
  return error instanceof ApiError && error.status === 404
}

export async function deleteEmprendimientoAction(id: number) {
  const session = await requireSession()

  await withSessionRedirect(async () => {
    const sectores = await entrepeneurFormService
      .getRefSectorByFormulario(id, session.token)
      .catch(() => null)

    for (const sector of sectores?.formularios_ref_sector ?? []) {
      await entrepeneurFormService
        .deleteRefSector(sector.id, session.token)
        .catch((error) => {
          if (!isNotFound(error)) throw error
        })
    }

    const infraestructuras = await entrepeneurFormService
      .getRefInfraestructuraByFormulario(id, session.token)
      .catch(() => null)

    for (const infraestructura of infraestructuras?.formularios_ref_infraestructura ??
      []) {
      await entrepeneurFormService
        .deleteRefInfraestructura(infraestructura.id, session.token)
        .catch((error) => {
          if (!isNotFound(error)) throw error
        })
    }

    await entrepeneurFormService.deleteReferenciaGeneral(id, session.token)
  })

  revalidatePath('/emprendimientos')
  revalidatePath('/emprendedores')
  revalidatePath('/formularios/referencia')
}
