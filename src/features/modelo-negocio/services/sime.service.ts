import { api, authHeader } from '@/lib/https'
import type { CatalogoItem, CatalogoResponse } from '@/types/catalog.type'
import type {
  CatalogoEstadoModelo,
  CatalogoItemConCodigoOrden,
} from '../types/sime.type'

function normalizeActivo<T extends { activo: boolean | number }>(
  item: T
): T & { activo: boolean } {
  return { ...item, activo: Boolean(item.activo) }
}

function normalizeEsTerminal<T extends { es_terminal: boolean | number }>(
  item: T
): T & { es_terminal: boolean } {
  return { ...item, es_terminal: Boolean(item.es_terminal) }
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
      grupoSeccion,
      bloqueCanvas,
      cuadranteFoda,
      categoriaInsumo,
      unidadMedida,
      categoriaInversion,
      tipoServicioFijo,
      estadoModelo,
    ] = await Promise.all([
      api
        .get<
          CatalogoResponse<CatalogoItemConCodigoOrden>
        >('/sime/catgruposeccion', opts)
        .then(normalizeResponse),
      api
        .get<
          CatalogoResponse<CatalogoItemConCodigoOrden>
        >('/sime/catbloquecanvas', opts)
        .then(normalizeResponse),
      api
        .get<
          CatalogoResponse<CatalogoItemConCodigoOrden>
        >('/sime/catcuadrantefoda', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/sime/catcategoriainsumo', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/sime/catunidadmedida', opts)
        .then(normalizeResponse),
      api
        .get<
          CatalogoResponse<CatalogoItem>
        >('/sime/catcategoriainversion', opts)
        .then(normalizeResponse),
      api
        .get<CatalogoResponse<CatalogoItem>>('/sime/cattiposerviciofijo', opts)
        .then(normalizeResponse),
      api
        .get<
          CatalogoResponse<CatalogoEstadoModelo>
        >('/sime/catestadomodelo', opts)
        .then(normalizeResponse),
    ])

    return {
      simeCatalogs: {
        grupoSeccion,
        bloqueCanvas,
        cuadranteFoda,
        categoriaInsumo,
        unidadMedida,
        categoriaInversion,
        tipoServicioFijo,
        estadoModelo,
      },
    }
  },
  getGrupoSeccion: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItemConCodigoOrden>>(
      '/sime/catgruposeccion',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getBloqueCanvas: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItemConCodigoOrden>>(
      '/sime/catbloquecanvas',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getCuadranteFoda: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItemConCodigoOrden>>(
      '/sime/catcuadrantefoda',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getCategoriaInsumo: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/sime/catcategoriainsumo',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getUnidadMedida: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/sime/catunidadmedida',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getCategoriaInversion: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/sime/catcategoriainversion',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getTipoServicioFijo: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoItem>>(
      '/sime/cattiposerviciofijo',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },

  getEstadoModelo: async (token?: string) => {
    const res = await api.get<CatalogoResponse<CatalogoEstadoModelo>>(
      '/sime/catestadomodelo',
      { headers: authHeader(token) }
    )
    return normalizeResponse(res)
  },
}
