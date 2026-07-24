import { api, authHeader } from '@/lib/https'

import type {
  FormularioReferenciaGeneralCreateDTO,
  FormularioRefSector,
  FormularioRefSectorCreateDTO,
  FormularioRefSectorListResponse,
  FormularioRefInfraestructura,
  FormularioRefInfraestructuraCreateDTO,
  FormularioAsistenciaTecnicaCreateDTO,
  FormularioAsistRequerimiento,
  FormularioAsistRequerimientoCreateDTO,
  FormularioReferenciaGeneralResponse,
  FormularioAsistenciaTecnicaResponse,
  FormularioReferenciaGeneralCreateResponse,
  FormularioReferenciaGeneralListResponse,
} from '@/types/form.type'

export const entrepeneurFormService = {
  // Formulario referencia general

  getAllReferenciaGeneral: (
    page = 1,
    limit = 15,
    token?: string,
    idEmprendedor?: number
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (idEmprendedor) params.set('id_emprendedor', String(idEmprendedor))

    return api.get<FormularioReferenciaGeneralListResponse>(
      `/formulariosreferenciageneral?${params.toString()}`,
      { headers: authHeader(token) }
    )
  },
  createReferenciaGeneral: (payload: FormularioReferenciaGeneralCreateDTO) =>
    api.post<FormularioReferenciaGeneralCreateResponse>(
      '/formulariosreferenciageneral',
      {
        body: payload,
      }
    ),

  // Sectores — uno por uno
  createRefSector: (payload: FormularioRefSectorCreateDTO) =>
    api.post<FormularioRefSector>('/formulariorefsector', { body: payload }),

  getRefSectorByFormulario: (idFormularioRef: number, token?: string) =>
    api.get<FormularioRefSectorListResponse>(
      `/formulariorefsector?id_formulario_ref=${idFormularioRef}`,
      { headers: authHeader(token) }
    ),

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
    api.post<FormularioAsistenciaTecnicaResponse>(
      '/formularioasistenciatecnica',
      {
        body: payload,
      }
    ),

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
