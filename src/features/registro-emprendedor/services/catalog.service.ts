import { api, authHeader } from '@/lib/https'
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
  getAllCatalogs: async (token: string) => {
    const opts = { token }
    const [
      maritalStatus,
      genders,
      occupations,
      ageRanges,
      ethnicities,
      educationLevels,
      disabilityTypes,
      assistanceAreas,
      incomeLevels,
      entrepreneurSituations,
      enterpriseTypes,
      enterpriseSectors,
      enterpriseInfrastructures,
      themeAssistanceAreas,
    ] = await Promise.all([
      api
        .get<CatalogoResponse<CatalogoItem>>('/catestadocivil', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catgenero', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catocupacion', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<RangoEdadItem>>('/catrangoedad', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catetnia', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catnivelestudios', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/cattipodiscapacidad', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItemConOrden>>('/catareaasistencia', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catnivelingresos', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catsituacionemprendedor', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/cattipooferta', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catsectoremprendimiento', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/catinfraestructura', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<TemaAsistenciaItem>>('/cattemaasistencia', opts)
        .then(normalizeResponse),
    ])

    return {
      personalDataCatalogs: {
        maritalStatus,
        genders,
        occupations,
        ageRanges,
        ethnicities,
        educationLevels,
        disabilityTypes,
      },
      technicalAssistanceCatalogs: { assistanceAreas, themeAssistanceAreas },
      currentSituationCatalogs: {
        incomeLevels,
        entrepreneurSituations,
        entrepreneurOccupations: occupations,
      },
      enterpriseCatalogs: {
        enterpriseTypes,
        enterpriseSectors,
        enterpriseInfrastructures,
        assistanceAreas,
        themeAssistanceAreas,
      },
      intentionsCatalogs: { interestsSectors: enterpriseSectors },
    }
  },
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

  getEnterpriseSector: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/catsectoremprendimiento',
      { headers: authHeader(token) }
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
