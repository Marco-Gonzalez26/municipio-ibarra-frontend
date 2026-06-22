import { api } from '@/lib/https'
import type {
  FormularioReferenciaGeneral,
  FormularioReferenciaGeneralCreateDTO,
  FormularioRefSector,
  FormularioRefSectorCreateDTO,
  FormularioRefInfraestructura,
  FormularioRefInfraestructuraCreateDTO,
  FormularioAsistenciaTecnica,
  FormularioAsistenciaTecnicaCreateDTO,
  FormularioAsistRequerimiento,
  FormularioAsistRequerimientoCreateDTO,
} from '@/types/form.type'

export const entrepeneurFormService = {
  // Formulario referencia general
  createReferenciaGeneral: (payload: FormularioReferenciaGeneralCreateDTO) =>
    api.post<FormularioReferenciaGeneral>('/formulariosreferenciageneral', {
      body: payload,
    }),

  // Sectores — uno por uno
  createRefSector: (payload: FormularioRefSectorCreateDTO) =>
    api.post<FormularioRefSector>('/formulariorefsector', { body: payload }),

  // Bulk de sectores — itera y hace N POSTs
  createRefSectores: (idFormulario: number, sectores: number[]) =>
    Promise.all(
      sectores.map((id_sector) =>
        entrepeneurFormService.createRefSector({
          id_formulario_ref: idFormulario,
          id_sector,
          sector_otro: null,
        })
      )
    ),

  // Infraestructura — uno por uno
  createRefInfraestructura: (payload: FormularioRefInfraestructuraCreateDTO) =>
    api.post<FormularioRefInfraestructura>('/formulariorefinfraestructura', {
      body: payload,
    }),

  // Bulk de infraestructura
  createRefInfraestructuras: (
    idFormulario: number,
    infraestructuras: number[]
  ) =>
    Promise.all(
      infraestructuras.map((id_infraestructura) =>
        entrepeneurFormService.createRefInfraestructura({
          id_formulario_ref: idFormulario,
          id_infraestructura,
          descripcion_otro: null,
        })
      )
    ),

  // Formulario asistencia técnica
  createAsistenciaTecnica: (payload: FormularioAsistenciaTecnicaCreateDTO) =>
    api.post<FormularioAsistenciaTecnica>('/formularioasistenciatecnica', {
      body: payload,
    }),

  // Requerimientos asistencia — uno por uno
  createAsistRequerimiento: (payload: FormularioAsistRequerimientoCreateDTO) =>
    api.post<FormularioAsistRequerimiento>('/formularioasistrequerimiento', {
      body: payload,
    }),

  // Bulk de requerimientos
  createAsistRequerimientos: (idFormulario: number, temas: number[]) =>
    Promise.all(
      temas.map((id_tema) =>
        entrepeneurFormService.createAsistRequerimiento({
          id_formulario_asist: idFormulario,
          id_tema,
          requerimiento: null,
        })
      )
    ),
}
