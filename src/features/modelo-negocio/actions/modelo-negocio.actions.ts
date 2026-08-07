'use server'

import { withSessionRedirect } from '@/features/auth/services/session.service'
import { modeloNegocioService } from '../services/modelo-negocio-crud.service'
import type { PaginationParams } from '../types/modelo-negocio-api.types'
import type {
  ObjetivoEspecificoDTO,
  PortafolioProductoDTO,
  PropuestaProductoDTO,
  FuenteIngresoDTO,
  CostoVariableDTO,
  CostoFijoDTO,
  InversionInicialDTO,
} from '../types/modelo-negocio-api.types'
import type { ModeloNegocioState } from '@/features/asesorias/modelo-negocio/types/wizard-form.type'

// ── Simple upsert steps (1:1 tables) ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveFn = (idModelo: number, data: any, token: string) => Promise<unknown>

const SIMPLE_STEP_API_MAP: Record<
  string,
  {
    save: SaveFn
    extractKey: (data: ModeloNegocioState) => unknown
  }
> = {
  introduccion: {
    save: (id, data, t) => modeloNegocioService.saveIntroduccion(id, data, t),
    extractKey: (d) => ({
      introduccion: d.introduccion.introduccion,
      importancia: d.introduccion.importancia,
    }),
  },
  antecedentes: {
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  justificacion: {
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  objetivos: {
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  propuesta: {
    save: (id, data, t) => modeloNegocioService.savePropuestaValor(id, data, t),
    extractKey: (d) => ({
      propuesta_valor: d.propuesta.propuestaValor,
    }),
  },
  segmentos: {
    save: (id, data, t) =>
      modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  canales: {
    save: (id, data, t) =>
      modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  relacion: {
    save: (id, data, t) =>
      modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  recursos: {
    save: (id, data, t) =>
      modeloNegocioService.saveRecursosActividades(id, data, t),
    extractKey: (d) => ({
      recursos_financieros: d.recursos.recursosFinancieros,
      recursos_fisicos: d.recursos.recursosFisicos,
      mobiliario: d.recursos.mobiliario,
      local: d.recursos.local,
      actividades: d.actividades.actividades,
      socios: d.socios.socios,
    }),
  },
  actividades: {
    save: (id, data, t) =>
      modeloNegocioService.saveRecursosActividades(id, data, t),
    extractKey: (d) => ({
      recursos_financieros: d.recursos.recursosFinancieros,
      recursos_fisicos: d.recursos.recursosFisicos,
      mobiliario: d.recursos.mobiliario,
      local: d.recursos.local,
      actividades: d.actividades.actividades,
      socios: d.socios.socios,
    }),
  },
  socios: {
    save: (id, data, t) =>
      modeloNegocioService.saveRecursosActividades(id, data, t),
    extractKey: (d) => ({
      recursos_financieros: d.recursos.recursosFinancieros,
      recursos_fisicos: d.recursos.recursosFisicos,
      mobiliario: d.recursos.mobiliario,
      local: d.recursos.local,
      actividades: d.actividades.actividades,
      socios: d.socios.socios,
    }),
  },
  conclusiones: {
    save: (id, data, t) => modeloNegocioService.saveConclusiones(id, data, t),
    extractKey: (d) => ({
      conclusiones: d.conclusiones.conclusiones,
    }),
  },
  anexos: {
    save: (id, data, t) => modeloNegocioService.saveFoda(id, data, t),
    extractKey: (d) => [
      { id_cuadrante: 1, contenido: d.anexos.fortalezas },
      { id_cuadrante: 2, contenido: d.anexos.oportunidades },
      { id_cuadrante: 3, contenido: d.anexos.debilidades },
      { id_cuadrante: 4, contenido: d.anexos.amenazas },
    ],
  },
}

// ── Collection-based steps (1:many tables) ────────────────────────
// These need delete-all + recreate because the backend has no bulk upsert.

async function saveObjetivosEspecificos(
  modeloId: number,
  formData: ModeloNegocioState,
  token: string
) {
  const existing = await modeloNegocioService
    .getObjetivosEspecificos(modeloId, token)
    .catch(() => ({ ok: false, data: [] as ObjetivoEspecificoDTO[] }))
  const items = existing?.data ?? []
  for (const item of items) {
    await modeloNegocioService
      .deleteObjetivoEspecifico(item.id, token)
      .catch(() => {})
  }
  const specifices = formData.objetivos.objetivosEspecificos
  for (let i = 0; i < specifices.length; i++) {
    const desc = specifices[i]
    if (desc.trim()) {
      await modeloNegocioService.createObjetivoEspecifico(
        modeloId,
        { descripcion: desc, orden: i + 1 },
        token
      )
    }
  }
}

async function savePortafolio(
  modeloId: number,
  formData: ModeloNegocioState,
  token: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepResult: any
) {
  // Get existing products from mnpropuestaproducto (NOT mnportafolioproducto)
  const existing = await modeloNegocioService
    .getPropuestaProductos(modeloId, token)
    .catch(() => ({ ok: false, data: [] as PropuestaProductoDTO[] }))
  const items = existing?.data ?? []
  for (const item of items) {
    if (item.codigo_producto) {
      await modeloNegocioService
        .deletePropuestaProducto(item.codigo_producto, token)
        .catch(() => {})
    }
  }

  // Get propuesta valor ID: try stepResult first, then GET fallback
  let idPropuesta = stepResult?.propuesta_valor?.id ?? 0
  if (!idPropuesta) {
    const propuestaRes = await modeloNegocioService
      .getPropuestaValor(modeloId, token)
      .catch(() => null)
    idPropuesta = propuestaRes?.data?.id ?? 0
  }
  console.log('[savePortafolio] idPropuesta:', idPropuesta)

  const productos = formData.propuesta.portafolio
  for (let i = 0; i < productos.length; i++) {
    const nombre = productos[i]
    if (nombre.trim()) {
      await modeloNegocioService.createPropuestaProducto(
        {
          codigo_producto: `PROD-${modeloId}-${i + 1}`,
          id_propuesta: idPropuesta,
          id_modelo: modeloId,
          nombre_producto: nombre,
          descripcion: null,
        },
        token
      ).catch((err) => {
        console.error('[savePortafolio] createPropuestaProducto error:', err)
        throw err
      })
    }
  }
}

async function saveIngresos(
  modeloId: number,
  formData: ModeloNegocioState,
  token: string
) {
  const existing = await modeloNegocioService
    .getFuentesIngreso(modeloId, token)
    .catch(() => ({ ok: false, data: [] as FuenteIngresoDTO[] }))
  const fuentes = existing?.data ?? []
  for (const f of fuentes) {
    await modeloNegocioService.deleteFuenteIngreso(f.id, token).catch(() => {})
  }
  const existingPort = await modeloNegocioService
    .getPortafolioProductos(modeloId, token)
    .catch(() => ({ ok: false, data: [] as PortafolioProductoDTO[] }))
  const ports = existingPort?.data ?? []
  for (const p of ports) {
    await modeloNegocioService
      .deletePortafolioProducto(p.id, token)
      .catch(() => {})
  }

  let idFuente = 0
  if (formData.ingresos.ingresosTexto.trim()) {
    const result = await modeloNegocioService.createFuenteIngreso(
      {
        id_modelo: modeloId,
        descripcion: formData.ingresos.ingresosTexto,
        monto_estimado: null,
      },
      token
    )
    idFuente = result?.fuente_ingreso?.id ?? 0
  }

  for (const prod of formData.ingresos.productos) {
    if (prod.producto.trim()) {
      await modeloNegocioService.createPortafolioProducto(
        {
          id_fuente_ingreso: idFuente,
          codigo_producto: null,
          nombre_producto: prod.producto,
          descripcion: prod.descripcion || null,
          precio: prod.precio,
          peso: null,
        },
        token
      )
    }
  }
}

async function saveCostos(
  modeloId: number,
  formData: ModeloNegocioState,
  token: string
) {
  // Costos variables (insumos)
  const existingVars = await modeloNegocioService
    .getCostosVariables(modeloId, token)
    .catch(() => ({ ok: false, data: [] as CostoVariableDTO[] }))
  for (const item of existingVars?.data ?? []) {
    await modeloNegocioService
      .deleteCostoVariable(item.id, token)
      .catch(() => {})
  }
  for (const ins of formData.costos.insumos) {
    if (ins.categoria.trim() && ins.cantidad > 0 && ins.costoUnit > 0) {
      await modeloNegocioService.createCostoVariable(
        {
          id_modelo: modeloId,
          categoria: ins.categoria,
          descripcion: ins.descripcion,
          cantidad: ins.cantidad,
          unidad: ins.unidad,
          costo_unitario: ins.costoUnit,
        },
        token
      )
    }
  }

  // Costos fijos
  const existingFijos = await modeloNegocioService
    .getCostosFijos(modeloId, token)
    .catch(() => ({ ok: false, data: [] as CostoFijoDTO[] }))
  for (const item of existingFijos?.data ?? []) {
    await modeloNegocioService.deleteCostoFijo(item.id, token).catch(() => {})
  }
  for (const fijo of formData.costos.fijos) {
    if (fijo.detalle.trim() && fijo.valor > 0) {
      await modeloNegocioService.createCostoFijo(
        { id_modelo: modeloId, detalle: fijo.detalle, valor: fijo.valor },
        token
      )
    }
  }

  // Inversión inicial
  const existingInv = await modeloNegocioService
    .getInversionInicial(modeloId, token)
    .catch(() => ({ ok: false, data: [] as InversionInicialDTO[] }))
  for (const item of existingInv?.data ?? []) {
    await modeloNegocioService
      .deleteInversionInicial(item.id, token)
      .catch(() => {})
  }
  for (const inv of formData.costos.inversion) {
    if (inv.categoria.trim() && inv.costo > 0) {
      await modeloNegocioService.createInversionInicial(
        {
          id_modelo: modeloId,
          categoria: inv.categoria,
          descripcion: inv.descripcion,
          costo: inv.costo,
        },
        token
      )
    }
  }

  // Proyección supuestos
  const proj = formData.costos.proyeccion
  await modeloNegocioService.saveProyeccionSupuestos(
    modeloId,
    {
      precio: proj.precio,
      costos_fijos: proj.costosFijos,
      crecimiento: proj.growth,
      start_units: proj.startUnits,
      var_ratio: proj.varRatio,
      margen: proj.margen,
    },
    token
  )
}

// ── Special step save handlers ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CollectionHandler = (modeloId: number, formData: ModeloNegocioState, token: string, stepResult: any) => Promise<void>

const COLLECTION_STEP_HANDLERS: Record<string, CollectionHandler> = {
  objetivos: saveObjetivosEspecificos,
  propuesta: savePortafolio,
  ingresos: saveIngresos,
  costos: saveCostos,
}

// ── Public server actions ──────────────────────────────────────

export async function createModeloAction(
  nTramite: string,
  fechaIngreso: string,
  nombreEmprendimiento: string,
  idSector: number,
  productoLinea: string,
  analista: string,
  observaciones: string
) {
  return withSessionRedirect(async () => {
    const session =
      await import('@/features/auth/services/session.service').then((m) =>
        m.getSession()
      )
    if (!session) throw new Error('Sesión no encontrada')

    const result = await modeloNegocioService.create(
      {
        n_tramite: nTramite,
        fecha_ingreso: fechaIngreso,
        nombre_emprendimiento: nombreEmprendimiento,
        id_sector: idSector,
        producto_linea: productoLinea,
        analista,
        observaciones,
      },
      session.token
    )

    return result
  })
}

export async function updateModeloAction(
  modeloId: number,
  data: {
    n_tramite?: string
    producto_linea?: string
    analista?: string
    observaciones?: string
  }
) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.update(modeloId, data, session.token)
}

export async function saveStepAction(
  modeloId: number,
  stepKey: string,
  formData: ModeloNegocioState
) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  const token = session.token

  // Simple upsert steps (1:1 tables) — run first so collection handlers can use the result
  const stepConfig = SIMPLE_STEP_API_MAP[stepKey]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stepResult: any = null
  if (stepConfig) {
    const dataToSave = stepConfig.extractKey(formData)
    if (dataToSave !== null) {
      stepResult = await stepConfig.save(modeloId, dataToSave, token)
    }
  }

  // Collection-based steps (1:many tables) — delete all + recreate
  const collectionHandler = COLLECTION_STEP_HANDLERS[stepKey]
  if (collectionHandler) {
    await collectionHandler(modeloId, formData, token, stepResult)
  }

  if (!collectionHandler && !stepConfig) {
    throw new Error(`Paso desconocido: ${stepKey}`)
  }

  // Mark progress for steps that map to a DB progress row
  const STEP_NUMBER_MAP: Record<string, number> = {
    ficha: 1,
    introduccion: 2,
    antecedentes: 3,
    justificacion: 4,
    objetivos: 6,
    propuesta: 8,
    segmentos: 10,
    canales: 11,
    relacion: 12,
    ingresos: 13,
    recursos: 14,
    actividades: 15,
    costos: 16,
    conclusiones: 16,
    anexos: 16,
  }

  const pasoNumero = STEP_NUMBER_MAP[stepKey]
  if (pasoNumero) {
    try {
      const progreso = await modeloNegocioService.getProgreso(
        modeloId,
        session.token
      )
      const pasos = progreso.data ?? []
      const paso = pasos.find((p) => p.paso_numero === pasoNumero)
      if (paso && !paso.estado) {
        await modeloNegocioService.markPaso(paso.id, session.token)
      }
    } catch {
      // Progress marking is best-effort
    }
  }

  return { ok: true, msg: 'Guardado correctamente' }
}

export async function loadModeloAction(modeloId: number) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  const [modeloRes, progreso] = await Promise.all([
    modeloNegocioService.getById(modeloId, session.token),
    modeloNegocioService.getProgreso(modeloId, session.token),
  ])

  const modelo = modeloRes.modelo

  // Load all sections in parallel
  const [
    introduccion,
    contexto,
    propuestaValor,
    objetivosEspecificos,
    propuestaProductos,
    clientesCanales,
    recursosActividades,
    conclusiones,
    foda,
  ] = await Promise.all([
    modeloNegocioService
      .getIntroduccion(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService.getContexto(modeloId, session.token).catch(() => null),
    modeloNegocioService
      .getPropuestaValor(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getObjetivosEspecificos(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getPropuestaProductos(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getClientesCanales(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getRecursosActividades(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getConclusiones(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService.getFoda(modeloId, session.token).catch(() => null),
  ])
  console.log({
    introduccion,
    contexto,
    propuestaValor,
    clientesCanales,
    recursosActividades,
    conclusiones,
    foda,
  })
  // Find first incomplete step
  const pasos = progreso.data ?? []
  const sortedPasos = [...pasos].sort((a, b) => a.paso_numero - b.paso_numero)
  const incompletePaso = sortedPasos.find((p) => !p.estado)
  const firstIncompleteStep =
    STEP_NUMBER_TO_KEY[incompletePaso?.paso_numero ?? 1] ?? 'ficha'

  return {
    modelo,
    progreso: progreso.data,
    firstIncompleteStep,
    sections: {
      introduccion: introduccion?.data ?? null,
      contexto: contexto?.data ?? null,
      propuestaValor: propuestaValor?.data ?? null,
      objetivosEspecificos: objetivosEspecificos?.data ?? null,
      propuestaProductos: propuestaProductos?.data ?? null,
      clientesCanales: clientesCanales?.data ?? null,
      recursosActividades: recursosActividades?.data ?? null,
      conclusiones: conclusiones?.data ?? null,
      foda: foda?.data ?? null,
    },
  }
}

const STEP_NUMBER_TO_KEY: Record<number, string> = {
  1: 'ficha',
  2: 'introduccion',
  3: 'antecedentes',
  4: 'justificacion',
  5: 'objetivos',
  6: 'objetivos',
  7: 'propuesta',
  8: 'propuesta',
  9: 'propuesta',
  10: 'segmentos',
  11: 'canales',
  12: 'relacion',
  13: 'ingresos',
  14: 'recursos',
  15: 'actividades',
  16: 'conclusiones',
}

export async function listModelosAction(params: PaginationParams) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.list(params, session.token)
}

export async function deleteModeloAction(modeloId: number) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.delete(modeloId, session.token)
}

export async function changeEstadoAction(
  modeloId: number,
  idEstado: number,
  motivo?: string
) {
  const session = await import('@/features/auth/services/session.service').then(
    (m) => m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.changeEstado(
    modeloId,
    idEstado,
    motivo,
    session.token
  )
}
