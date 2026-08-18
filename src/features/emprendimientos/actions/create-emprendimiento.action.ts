'use server'

import { requireSession } from '@/features/auth/services/session.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import {
  mapWizardToFormularioAsistenciaDTO,
  mapWizardToFormularioReferenciaDTO,
} from '@/features/registro-emprendedor/utils/wizard-form-mapper'
import type { RegistroEmprendedorState } from '@/features/registro-emprendedor/types/wizard-form.type'

export async function createEmprendimientoAction(
  idEmprendedor: number,
  state: RegistroEmprendedorState
) {
  const session = await requireSession()
  const token = session.token
  const today = new Date().toISOString().split('T')[0]

  const newFormRef = await entrepeneurFormService.createReferenciaGeneral(
    mapWizardToFormularioReferenciaDTO(state, idEmprendedor, today),
    token
  )

  const idFormularioRef = newFormRef.formulario_referencia_general.id
  const sectores =
    state.intenciones.sectores_interes.length > 0
      ? state.intenciones.sectores_interes
      : state.emprendimiento.id_sector
        ? [state.emprendimiento.id_sector]
        : []

  await Promise.all([
    entrepeneurFormService.createRefSectores(
      idFormularioRef,
      sectores,
      token
    ),
    entrepeneurFormService.createRefInfraestructuras(
      idFormularioRef,
      state.emprendimiento.recursos_disponibles,
      token
    ),
  ])

  const newFormAsistencia =
    await entrepeneurFormService.createAsistenciaTecnica(
      mapWizardToFormularioAsistenciaDTO(state, idEmprendedor, today),
      token
    )

  await entrepeneurFormService.createAsistRequerimientos(
    newFormAsistencia.data.id,
    state.asistenciaTecnica.areas_asistencia,
    token
  )

  return {
    formularioReferencia: newFormRef.formulario_referencia_general,
    formularioAsistencia: newFormAsistencia.data,
  }
}
