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
  FodaDTO,
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
  stepResult: StepResult | null
) {
  // Get propuesta valor ID: try stepResult first, then GET fallback
  let idPropuesta = stepResult?.propuesta_valor?.id ?? 0
  if (!idPropuesta) {
    const propuestaRes = await modeloNegocioService
      .getPropuestaValor(modeloId, token)
      .catch(() => null)
    idPropuesta = propuestaRes?.data?.id ?? 0
  }
  console.log('[savePortafolio] idPropuesta:', idPropuesta)

  // Delete existing products by propuesta ID
  if (idPropuesta) {
    const existing = await modeloNegocioService
      .getPropuestaProductos(idPropuesta, token)
      .catch(() => ({ ok: false, data: [] as PropuestaProductoDTO[] }))
    const items = existing?.data ?? []
    for (const item of items) {
      if (item.codigo_producto) {
        await modeloNegocioService
          .deletePropuestaProducto(item.codigo_producto, token)
          .catch(() => {})
      }
    }
  }

  // Create new products
  const productos = formData.propuesta.portafolio
  for (let i = 0; i < productos.length; i++) {
    const nombre = productos[i]
    if (nombre.trim()) {
      await modeloNegocioService
        .createPropuestaProducto(
          {
            codigo_producto: `PROD-${modeloId}-${i + 1}`,
            id_propuesta: idPropuesta,
            nombre: nombre,
            imagen: null,
          },
          token
        )
        .catch((err) => {
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
  // Delete existing portafolio products for each fuente, then delete fuentes
  const existing = await modeloNegocioService
    .getFuentesIngreso(modeloId, token)
    .catch(() => ({ ok: false, data: [] as FuenteIngresoDTO[] }))
  const fuentes = existing?.data ?? []
  for (const f of fuentes) {
    const existingPort = await modeloNegocioService
      .getPortafolioProductos(f.id, token)
      .catch(() => ({ ok: false, data: [] as PortafolioProductoDTO[] }))
    for (const p of existingPort?.data ?? []) {
      await modeloNegocioService
        .deletePortafolioProducto(p.id, token)
        .catch(() => {})
    }
    await modeloNegocioService.deleteFuenteIngreso(f.id, token).catch(() => {})
  }

  // Create fuente de ingreso
  let idFuente = 0
  if (formData.ingresos.ingresosTexto.trim()) {
    const result = await modeloNegocioService.createFuenteIngreso(
      modeloId,
      {
        fuente_ingreso: formData.ingresos.ingresosTexto,
        monto_estimado: null,
      },
      token
    )
    idFuente = result?.fuente_ingreso?.id ?? 0
  }

  // Create portafolio products
  for (let i = 0; i < formData.ingresos.productos.length; i++) {
    const prod = formData.ingresos.productos[i]
    if (prod.producto.trim() && idFuente) {
      await modeloNegocioService.createPortafolioProducto(
        idFuente,
        {
          codigo_producto: prod.producto,
          orden: i + 1,
          precio: prod.precio,
          peso: 0,
        },
        token
      )
    }
  }
}

async function saveAnexos(
  modeloId: number,
  formData: ModeloNegocioState,
  token: string
) {
  const existing = await modeloNegocioService
    .getFoda(modeloId, token)
    .catch(() => ({ ok: false, data: [] as FodaDTO[] }))
  for (const item of existing?.data ?? []) {
    await modeloNegocioService.deleteFoda(item.id, token).catch(() => {})
  }

  const cuadrantes = [
    { id_cuadrante: 1, contenido: formData.anexos.fortalezas },
    { id_cuadrante: 2, contenido: formData.anexos.oportunidades },
    { id_cuadrante: 3, contenido: formData.anexos.debilidades },
    { id_cuadrante: 4, contenido: formData.anexos.amenazas },
  ]
  for (const c of cuadrantes) {
    if (c.contenido.trim()) {
      await modeloNegocioService.saveFoda(modeloId, c, token)
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
    if (ins.categoriaId && ins.cantidad > 0 && ins.costoUnit > 0) {
      await modeloNegocioService.createCostoVariable(
        modeloId,
        {
          id_categoria: ins.categoriaId,
          descripcion: ins.descripcion,
          cantidad: ins.cantidad,
          id_unidad: ins.unidadId,
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
        modeloId,
        { detalle: fijo.detalle, valor: fijo.valor },
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
    if (inv.categoriaId && inv.costo > 0) {
      await modeloNegocioService.createInversionInicial(
        modeloId,
        {
          id_categoria: inv.categoriaId,
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
      var_ratio: proj.costoVariableUnitario,
      margen: proj.margen,
    },
    token
  )
}

// ── Special step save handlers ──────────────────────────────────

interface StepResult {
  propuesta_valor?: { id?: number }
  [key: string]: unknown
}

type CollectionHandler = (
  modeloId: number,
  formData: ModeloNegocioState,
  token: string,
  stepResult: StepResult | null
) => Promise<void>

const COLLECTION_STEP_HANDLERS: Record<string, CollectionHandler> = {
  objetivos: saveObjetivosEspecificos,
  propuesta: savePortafolio,
  ingresos: saveIngresos,
  costos: saveCostos,
  anexos: saveAnexos,
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
  let stepResult: StepResult | null = null
  if (stepConfig) {
    const dataToSave = stepConfig.extractKey(formData)
    if (dataToSave !== null) {
      stepResult = (await stepConfig.save(
        modeloId,
        dataToSave,
        token
      )) as StepResult
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

  // Load all sections in parallel (except propuestaProductos and portafolioProductos which need foreign keys)
  const [
    introduccion,
    contexto,
    propuestaValor,
    objetivosEspecificos,
    clientesCanales,
    recursosActividades,
    conclusiones,
    foda,
    costosVariables,
    costosFijos,
    inversionInicial,
    proyeccionSupuestos,
    fuentesIngreso,
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
      .getClientesCanales(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getRecursosActividades(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getConclusiones(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService.getFoda(modeloId, session.token).catch(() => null),
    modeloNegocioService
      .getCostosVariables(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getCostosFijos(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getInversionInicial(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getProyeccionSupuestos(modeloId, session.token)
      .catch(() => null),
    modeloNegocioService
      .getFuentesIngreso(modeloId, session.token)
      .catch(() => null),
  ])

  // Fetch propuestaProductos using idPropuesta (can't run in parallel)
  const idPropuesta = propuestaValor?.data?.id ?? 0
  const propuestaProductos = idPropuesta
    ? await modeloNegocioService
        .getPropuestaProductos(idPropuesta, session.token)
        .catch(() => null)
    : null

  // Fetch portafolioProductos for each fuente de ingreso
  const fuentes = fuentesIngreso?.data ?? []
  const portafolioByFuente = await Promise.all(
    fuentes.map((f) =>
      modeloNegocioService
        .getPortafolioProductos(f.id, session.token)
        .catch(() => ({ ok: false, data: [] as PortafolioProductoDTO[] }))
    )
  )
  const allPortafolioProductos = portafolioByFuente.flatMap(
    (r) => r?.data ?? []
  )

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
      costosVariables: costosVariables?.data ?? null,
      costosFijos: costosFijos?.data ?? null,
      inversionInicial: inversionInicial?.data ?? null,
      proyeccionSupuestos: proyeccionSupuestos?.data ?? null,
      fuentesIngreso: fuentesIngreso?.data ?? null,
      portafolioProductos: allPortafolioProductos,
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
