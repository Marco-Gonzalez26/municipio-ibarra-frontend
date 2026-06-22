import { api } from '@/lib/https'
import type {
  CatalogoItem,
  CatalogoItemConOrden,
  CatalogoResponse,
  RangoEdadItem,
  TemaAsistenciaItem,
} from '@/types/catalog.type'

// Normaliza el campo activo que el backend devuelve como boolean o 0/1
// a un boolean puro, para que el resto de la app no se preocupe por eso

function normalizeActivo<T extends { activo: boolean | number }>(
  item: T
): T & { activo: boolean } {
  return { ...item, activo: Boolean(item.activo) }
}

function normalizeResponse<T extends { activo: boolean | number }>(
  response: CatalogoResponse<T>
): CatalogoResponse<T & { activo: boolean }> {
  return {
    total: response.total,
    data: response.data.map(normalizeActivo),
  }
}
export const catalogService = {
  getMaritalStatus: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>('/catestadocivil')
    return normalizeResponse(res)
  },

  getGender: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>('/catgenero')
    return normalizeResponse(res)
  },

  getOccupation: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>('/catocupacion')
    return normalizeResponse(res)
  },

  getAgeRange: async () => {
    const res = await api.get<CatalogoResponse<RangoEdadItem>>('/catrangoedad')
    return normalizeResponse(res)
  },

  getAssistanceArea: async () => {
    const res =
      await api.get<CatalogoResponse<CatalogoItemConOrden>>(
        '/catareaasistencia'
      )
    return normalizeResponse(res)
  },

  getIncomeLevel: async () => {
    const res =
      await api.get<CatalogoResponse<CatalogoItem>>('/catnivelingresos')
    return normalizeResponse(res)
  },

  getDisabilityType: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/cattipodiscapacidad'
    )
    return normalizeResponse(res)
  },

  getEthnicity: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>('/catetnia')
    return normalizeResponse(res)
  },

  getEducationLevel: async () => {
    const res =
      await api.get<CatalogoResponse<CatalogoItem>>('/catnivelestudios')
    return normalizeResponse(res)
  },

  getEntrepreneurSituation: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/catsituacionemprendedor'
    )
    return normalizeResponse(res)
  },

  getEnterpriseType: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>('/cattipooferta')
    return normalizeResponse(res)
  },

  getEnterpriseSector: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/catsectoremprendimiento'
    )
    return normalizeResponse(res)
  },

  getEnterpriseInfrastructure: async () => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/catinfraestructura'
    )
    return normalizeResponse(res)
  },
  getThemeAssistanceAreas: async () => {
    const res =
      await api.get<CatalogoResponse<TemaAsistenciaItem>>('/cattemaasistencia')
    return normalizeResponse(res)
  },
}
