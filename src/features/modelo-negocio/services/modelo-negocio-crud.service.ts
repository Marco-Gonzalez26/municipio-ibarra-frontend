import { api } from '@/lib/https'
import type {
  ModeloNegocioDTO,
  ModeloNegocioCreateDTO,
  ModeloNegocioListResponse,
  IntroduccionDTO,
  ContextoDTO,
  ObjetivoEspecificoDTO,
  PropuestaValorDTO,
  PropuestaProductoDTO,
  ClientesCanalesDTO,
  FuenteIngresoDTO,
  PortafolioProductoDTO,
  RecursosActividadesDTO,
  CostoVariableDTO,
  CostoFijoDTO,
  InversionInicialDTO,
  ProyeccionSupuestosDTO,
  ConclusionesDTO,
  FodaDTO,
  CanvasDTO,
  ProgresoModeloDTO,
  PaginationParams,
} from '../types/modelo-negocio-api.types'

export const modeloNegocioService = {
  list: (params: PaginationParams, token?: string) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)
    if (params.id_estado)
      searchParams.set('id_estado', String(params.id_estado))
    const query = searchParams.toString()
    return api.get<ModeloNegocioListResponse>(
      `/sime/modelonegocio${query ? `?${query}` : ''}`,
      { token }
    )
  },

  getById: (id: number, token?: string) =>
    api.get<{ ok: boolean; modelo: ModeloNegocioDTO }>(
      `/sime/modelonegocio/${id}`,
      {
        token,
        silent: true,
      }
    ),

  create: (payload: ModeloNegocioCreateDTO, token?: string) =>
    api.post<{ ok: boolean; modelo: ModeloNegocioDTO }>('/sime/modelonegocio', {
      body: payload,
      token,
    }),

  update: (
    id: number,
    payload: Partial<ModeloNegocioCreateDTO>,
    token?: string
  ) =>
    api.put<{ msg: string }>(`/sime/modelonegocio/${id}`, {
      body: payload,
      token,
    }),

  delete: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/modelonegocio/${id}`, { token }),

  changeEstado: (
    id: number,
    idEstado: number,
    motivo?: string,
    token?: string
  ) =>
    api.put<{ msg: string }>(`/sime/modelonegocio/${id}/estado`, {
      body: { id_estado: idEstado, motivo },
      token,
    }),

  // ── 1:1 sections (upsert by id_modelo) ──────────────────────────

  getIntroduccion: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: IntroduccionDTO }>(
      `/sime/mnintroduccion/${idModelo}`,
      { token }
    ),

  saveIntroduccion: (
    idModelo: number,
    data: Omit<IntroduccionDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mnintroduccion/${idModelo}`, {
      body: data,
      token,
    }),

  getContexto: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ContextoDTO }>(
      `/sime/mncontexto/${idModelo}`,
      {
        token,
      }
    ),

  saveContexto: (
    idModelo: number,
    data: Omit<ContextoDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mncontexto/${idModelo}`, {
      body: data,
      token,
    }),

  getPropuestaValor: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: PropuestaValorDTO }>(
      `/sime/mnpropuestavalor/${idModelo}`,
      { token }
    ),

  savePropuestaValor: (
    idModelo: number,
    data: Omit<PropuestaValorDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; propuesta_valor?: PropuestaValorDTO }>(
      `/sime/mnpropuestavalor/${idModelo}`,
      {
        body: data,
        token,
      }
    ),

  getClientesCanales: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ClientesCanalesDTO }>(
      `/sime/mnclientescanales/${idModelo}`,
      { token }
    ),

  saveClientesCanales: (
    idModelo: number,
    data: Omit<ClientesCanalesDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mnclientescanales/${idModelo}`, {
      body: data,
      token,
    }),

  getRecursosActividades: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: RecursosActividadesDTO }>(
      `/sime/mnrecursosactividades/${idModelo}`,
      { token }
    ),

  saveRecursosActividades: (
    idModelo: number,
    data: Omit<RecursosActividadesDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mnrecursosactividades/${idModelo}`, {
      body: data,
      token,
    }),

  getProyeccionSupuestos: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ProyeccionSupuestosDTO }>(
      `/sime/mnproyeccionsupuestos/${idModelo}`,
      { token }
    ),

  saveProyeccionSupuestos: (
    idModelo: number,
    data: Omit<ProyeccionSupuestosDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mnproyeccionsupuestos/${idModelo}`, {
      body: data,
      token,
    }),

  getConclusiones: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ConclusionesDTO }>(
      `/sime/mnconclusiones/${idModelo}`,
      { token }
    ),

  saveConclusiones: (
    idModelo: number,
    data: Omit<ConclusionesDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mnconclusiones/${idModelo}`, {
      body: data,
      token,
    }),

  // ── 1:many sections (individual CRUD) ──────────────────────────

  getObjetivosEspecificos: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ObjetivoEspecificoDTO[] }>(
      `/sime/mnobjetivoespecifico/modelo/${idModelo}`,
      { token }
    ),

  createObjetivoEspecifico: (
    idModelo: number,
    data: Omit<ObjetivoEspecificoDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; objetivo_especifico: ObjetivoEspecificoDTO }>(
      `/sime/mnobjetivoespecifico/modelo/${idModelo}`,
      { body: data, token }
    ),

  deleteObjetivoEspecifico: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mnobjetivoespecifico/${id}`, { token }),

  getPropuestaProductos: (idPropuesta: number, token?: string) =>
    api.get<{ ok: boolean; data: PropuestaProductoDTO[] }>(
      `/sime/mnpropuestaproducto/propuesta/${idPropuesta}`,
      { token }
    ),

  createPropuestaProducto: (
    data: Omit<PropuestaProductoDTO, 'id'>,
    token?: string
  ) =>
    api.post<{ msg: string; propuesta_producto: PropuestaProductoDTO }>(
      '/sime/mnpropuestaproducto',
      { body: data, token }
    ),

  deletePropuestaProducto: (codigo: string, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mnpropuestaproducto/${codigo}`, {
      token,
    }),

  getFuentesIngreso: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: FuenteIngresoDTO[] }>(
      `/sime/mnfuenteingreso/modelo/${idModelo}`,
      { token }
    ),

  createFuenteIngreso: (
    idModelo: number,
    data: Omit<FuenteIngresoDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; fuente_ingreso: FuenteIngresoDTO }>(
      `/sime/mnfuenteingreso/modelo/${idModelo}`,
      { body: data, token }
    ),

  deleteFuenteIngreso: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mnfuenteingreso/${id}`, { token }),

  getPortafolioProductos: (idFuenteIngreso: number, token?: string) =>
    api.get<{ ok: boolean; data: PortafolioProductoDTO[] }>(
      `/sime/mnportafolioproducto/fuente/${idFuenteIngreso}`,
      { token }
    ),

  createPortafolioProducto: (
    idFuenteIngreso: number,
    data: Omit<PortafolioProductoDTO, 'id' | 'id_fuente_ingreso'>,
    token?: string
  ) =>
    api.post<{ msg: string; portafolio_producto: PortafolioProductoDTO }>(
      `/sime/mnportafolioproducto/fuente/${idFuenteIngreso}`,
      { body: data, token }
    ),

  deletePortafolioProducto: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mnportafolioproducto/${id}`, { token }),

  getCostosVariables: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: CostoVariableDTO[] }>(
      `/sime/mncostovariable/modelo/${idModelo}`,
      { token }
    ),

  createCostoVariable: (
    idModelo: number,
    data: Omit<CostoVariableDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; costo_variable: CostoVariableDTO }>(
      `/sime/mncostovariable/modelo/${idModelo}`,
      { body: data, token }
    ),

  deleteCostoVariable: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mncostovariable/${id}`, { token }),

  getCostosFijos: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: CostoFijoDTO[] }>(
      `/sime/mncostofijo/modelo/${idModelo}`,
      { token }
    ),

  createCostoFijo: (
    idModelo: number,
    data: Omit<CostoFijoDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; costo_fijo: CostoFijoDTO }>(
      `/sime/mncostofijo/modelo/${idModelo}`,
      { body: data, token }
    ),

  deleteCostoFijo: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mncostofijo/${id}`, { token }),

  getInversionInicial: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: InversionInicialDTO[] }>(
      `/sime/mninversioninicial/modelo/${idModelo}`,
      { token }
    ),

  createInversionInicial: (
    idModelo: number,
    data: Omit<InversionInicialDTO, 'id' | 'id_modelo'>,
    token?: string
  ) =>
    api.post<{ msg: string; inversion_inicial: InversionInicialDTO }>(
      `/sime/mninversioninicial/modelo/${idModelo}`,
      { body: data, token }
    ),

  deleteInversionInicial: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mninversioninicial/${id}`, { token }),

  getFoda: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; total: number; data: FodaDTO[] }>(
      `/sime/mnfoda/modelo/${idModelo}`,
      {
        token,
      }
    ),

  saveFoda: (
    idModelo: number,
    data: { id_cuadrante: number; contenido: string },
    token?: string
  ) =>
    api.post<{ msg: string; data: FodaDTO }>(
      `/sime/mnfoda/modelo/${idModelo}`,
      {
        body: data,
        token,
      }
    ),

  deleteFoda: (id: number, token?: string) =>
    api.delete<{ msg: string }>(`/sime/mnfoda/${id}`, { token }),

  getCanvas: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; total: number; data: CanvasDTO[] }>(
      `/sime/mncanvas/modelo/${idModelo}`,
      {
        token,
      }
    ),

  saveCanvas: (
    idModelo: number,
    data: Omit<CanvasDTO, 'id'>[],
    token?: string
  ) =>
    api.post<{ msg: string }>(`/sime/mncanvas/${idModelo}`, {
      body: { canvas: data },
      token,
    }),

  // ── Progress ──────────────────────────────────────────────────

  getProgreso: (idModelo: number, token?: string) =>
    api.get<{ ok: boolean; data: ProgresoModeloDTO[] }>(
      `/sime/mnprogresomodelo/modelo/${idModelo}`,
      { token }
    ),

  markPaso: (id: number, token?: string) =>
    api.put<{ msg: string }>(`/sime/mnprogresomodelo/${id}`, {
      body: { estado: 1 },
      token,
    }),
}
