'use server'

import { requireSession } from '@/features/auth/services/session.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import {
  mapWizardToEntrepreneurDTO,
  mapWizardToFormularioReferenciaDTO,
  mapWizardToFormularioAsistenciaDTO,
} from '@/features/registro-emprendedor/utils/wizard-form-mapper'
import type { RegistroEmprendedorState } from '@/features/registro-emprendedor/types/wizard-form.type'
import type { RangoEdadItem } from '@/types/catalog.type'

export async function createEntrepreneurAction(
  state: RegistroEmprendedorState,
  ageRanges: RangoEdadItem[]
) {
  const session = await requireSession()
  const token = session.token
  const today = new Date().toISOString().split('T')[0]

  // 1. Crear emprendedor
  const newEntrepreneur = await entrepreneurService.create(
    mapWizardToEntrepreneurDTO(state, ageRanges),
    token
  )

  // 2. Crear formulario referencia general
  const newFormRef = await entrepeneurFormService.createReferenciaGeneral(
    mapWizardToFormularioReferenciaDTO(
      state,
      newEntrepreneur.emprendedor.id,
      today
    ),
    token
  )

  // 3. Crear sectores e infraestructura en paralelo
  await Promise.all([
    entrepeneurFormService.createRefSectores(
      newFormRef.formulario_referencia_general.id,
      state.intenciones.sectores_interes,
      token
    ),
    entrepeneurFormService.createRefInfraestructuras(
      newFormRef.formulario_referencia_general.id,
      state.emprendimiento.recursos_disponibles,
      token
    ),
  ])

  // 4. Crear formulario asistencia técnica
  const newFormAsistencia =
    await entrepeneurFormService.createAsistenciaTecnica(
      mapWizardToFormularioAsistenciaDTO(
        state,
        newEntrepreneur.emprendedor.id,
        today
      ),
      token
    )

  // 5. Crear temas de asistencia
  await entrepeneurFormService.createAsistRequerimientos(
    newFormAsistencia.data.id,
    state.asistenciaTecnica.areas_asistencia,
    token
  )
}
