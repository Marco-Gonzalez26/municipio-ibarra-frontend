import { api, authHeader } from '@/lib/https'

import type {
  FormularioReferenciaGeneral,
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
  FormularioAsistenciaTecnicaListResponse,
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
      { token }
    )
  },
  createReferenciaGeneral: (
    payload: FormularioReferenciaGeneralCreateDTO,
    token?: string
  ) =>
    api.post<FormularioReferenciaGeneralCreateResponse>(
      '/formulariosreferenciageneral',
      { body: payload, token }
    ),

  updateReferenciaGeneral: (
    id: number,
    payload: Partial<
      Pick<FormularioReferenciaGeneral, 'id_estado_emprendedor'>
    >,
    token?: string
  ) =>
    api.put<{ ok: boolean; msg: string }>(
      `/formulariosreferenciageneral/${id}`,
      { body: payload, token }
    ),

  createRefSector: (payload: FormularioRefSectorCreateDTO, token?: string) =>
    api.post<FormularioRefSector>('/formulariorefsector', {
      body: payload,
      token,
    }),

  getRefSectorByFormulario: (idFormularioRef: number, token?: string) =>
    api.get<FormularioRefSectorListResponse>(
      `/formulariorefsector?id_formulario_ref=${idFormularioRef}`,
      { token }
    ),

  createRefSectores: (
    idFormulario: number,
    sectores: number[],
    token?: string
  ) =>
    Promise.all(
      sectores.map((id_sector) =>
        entrepeneurFormService.createRefSector(
          { id_formulario_ref: idFormulario, id_sector, sector_otro: null },
          token
        )
      )
    ),

  createRefInfraestructura: (
    payload: FormularioRefInfraestructuraCreateDTO,
    token?: string
  ) =>
    api.post<FormularioRefInfraestructura>('/formulariorefinfraestructura', {
      body: payload,
      token,
    }),

  createRefInfraestructuras: (
    idFormulario: number,
    infraestructuras: number[],
    token?: string
  ) =>
    Promise.all(
      infraestructuras.map((id_infraestructura) =>
        entrepeneurFormService.createRefInfraestructura(
          {
            id_formulario_ref: idFormulario,
            id_infraestructura,
            descripcion_otro: null,
          },
          token
        )
      )
    ),

  createAsistenciaTecnica: (
    payload: FormularioAsistenciaTecnicaCreateDTO,
    token?: string
  ) =>
    api.post<FormularioAsistenciaTecnicaResponse>(
      '/formularioasistenciatecnica',
      { body: payload, token }
    ),

  getAllAsistenciaTecnica: (page = 1, limit = 15, token?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    return api.get<FormularioAsistenciaTecnicaListResponse>(
      `/formularioasistenciatecnica?${params.toString()}`,
      { token }
    )
  },

  createAsistRequerimiento: (
    payload: FormularioAsistRequerimientoCreateDTO,
    token?: string
  ) =>
    api.post<FormularioAsistRequerimiento>('/formularioasistrequerimiento', {
      body: payload,
      token,
    }),

  createAsistRequerimientos: (
    idFormulario: number,
    temas: number[],
    token?: string
  ) =>
    Promise.all(
      temas.map((id_tema) =>
        entrepeneurFormService.createAsistRequerimiento(
          { id_formulario_asist: idFormulario, id_tema, requerimiento: null },
          token
        )
      )
    ),
}
