'use server'

import { withSessionRedirect } from '@/features/auth/services/session.service'
import { modeloNegocioService } from '../services/modelo-negocio-crud.service'
import type { PaginationParams } from '../types/modelo-negocio-api.types'
import type { ModeloNegocioState } from '@/features/asesorias/modelo-negocio/types/wizard-form.type'

// ── Step → API endpoint mapping ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveFn = (idModelo: number, data: any, token: string) => Promise<unknown>

const STEP_API_MAP: Record<
  string,
  {
    load: (idModelo: number, token: string) => Promise<unknown>
    save: SaveFn
    extractKey: (data: ModeloNegocioState) => unknown
  }
> = {
  ficha: {
    load: () => Promise.resolve(null),
    save: () => Promise.resolve(null),
    extractKey: () => null,
  },
  introduccion: {
    load: (id, t) => modeloNegocioService.getIntroduccion(id, t),
    save: (id, data, t) => modeloNegocioService.saveIntroduccion(id, data, t),
    extractKey: (d) => ({
      introduccion: d.introduccion.introduccion,
      importancia: d.introduccion.importancia,
    }),
  },
  antecedentes: {
    load: (id, t) => modeloNegocioService.getContexto(id, t),
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  justificacion: {
    load: (id, t) => modeloNegocioService.getContexto(id, t),
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  objetivos: {
    load: (id, t) => modeloNegocioService.getContexto(id, t),
    save: (id, data, t) => modeloNegocioService.saveContexto(id, data, t),
    extractKey: (d) => ({
      antecedentes: d.antecedentes.antecedentes,
      justificacion: d.justificacion.justificacion,
      impacto: '',
      objetivo_general: d.objetivos.objetivoGeneral,
    }),
  },
  propuesta: {
    load: (id, t) => modeloNegocioService.getPropuestaValor(id, t),
    save: (id, data, t) => modeloNegocioService.savePropuestaValor(id, data, t),
    extractKey: (d) => ({
      propuesta_valor: d.propuesta.propuestaValor,
    }),
  },
  segmentos: {
    load: (id, t) => modeloNegocioService.getClientesCanales(id, t),
    save: (id, data, t) => modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  canales: {
    load: (id, t) => modeloNegocioService.getClientesCanales(id, t),
    save: (id, data, t) => modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  relacion: {
    load: (id, t) => modeloNegocioService.getClientesCanales(id, t),
    save: (id, data, t) => modeloNegocioService.saveClientesCanales(id, data, t),
    extractKey: (d) => ({
      segmentos: d.segmentos.segmentos,
      canales: d.canales.canales,
      relacion: d.relacion.relacion,
    }),
  },
  ingresos: {
    load: () => Promise.resolve(null),
    save: () => Promise.resolve(null),
    extractKey: () => null,
  },
  recursos: {
    load: (id, t) => modeloNegocioService.getRecursosActividades(id, t),
    save: (id, data, t) => modeloNegocioService.saveRecursosActividades(id, data, t),
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
    load: (id, t) => modeloNegocioService.getRecursosActividades(id, t),
    save: (id, data, t) => modeloNegocioService.saveRecursosActividades(id, data, t),
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
    load: (id, t) => modeloNegocioService.getRecursosActividades(id, t),
    save: (id, data, t) => modeloNegocioService.saveRecursosActividades(id, data, t),
    extractKey: (d) => ({
      recursos_financieros: d.recursos.recursosFinancieros,
      recursos_fisicos: d.recursos.recursosFisicos,
      mobiliario: d.recursos.mobiliario,
      local: d.recursos.local,
      actividades: d.actividades.actividades,
      socios: d.socios.socios,
    }),
  },
  costos: {
    load: () => Promise.resolve(null),
    save: () => Promise.resolve(null),
    extractKey: () => null,
  },
  conclusiones: {
    load: (id, t) => modeloNegocioService.getConclusiones(id, t),
    save: (id, data, t) => modeloNegocioService.saveConclusiones(id, data, t),
    extractKey: (d) => ({
      conclusiones: d.conclusiones.conclusiones,
    }),
  },
  anexos: {
    load: (id, t) => modeloNegocioService.getFoda(id, t),
    save: (id, data, t) => modeloNegocioService.saveFoda(id, data, t),
    extractKey: (d) => [
      { id_cuadrante: 1, contenido: d.anexos.fortalezas },
      { id_cuadrante: 2, contenido: d.anexos.oportunidades },
      { id_cuadrante: 3, contenido: d.anexos.debilidades },
      { id_cuadrante: 4, contenido: d.anexos.amenazas },
    ],
  },
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
    const session = await import('@/features/auth/services/session.service').then((m) =>
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

export async function saveStepAction(
  modeloId: number,
  stepKey: string,
  formData: ModeloNegocioState
) {
  const session = await import('@/features/auth/services/session.service').then((m) =>
    m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  const stepConfig = STEP_API_MAP[stepKey]
  if (!stepConfig) {
    throw new Error(`Paso desconocido: ${stepKey}`)
  }

  const dataToSave = stepConfig.extractKey(formData)
  if (dataToSave === null) {
    return { ok: true, msg: 'Paso sin datos para guardar en servidor' }
  }

  await stepConfig.save(modeloId, dataToSave, session.token)

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
      const progreso = await modeloNegocioService.getProgreso(modeloId, session.token)
      const pasos = Array.isArray(progreso.pasos) ? progreso.pasos : Array.isArray(progreso) ? progreso : []
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
  const session = await import('@/features/auth/services/session.service').then((m) =>
    m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  const [modeloRes, progreso] = await Promise.all([
    modeloNegocioService.getById(modeloId, session.token),
    modeloNegocioService.getProgreso(modeloId, session.token),
  ])

  const modelo = modeloRes.modelo

  // Load all sections in parallel
  const [introduccion, contexto, propuestaValor, clientesCanales, recursosActividades, conclusiones, foda] =
    await Promise.all([
      modeloNegocioService.getIntroduccion(modeloId, session.token).catch(() => null),
      modeloNegocioService.getContexto(modeloId, session.token).catch(() => null),
      modeloNegocioService.getPropuestaValor(modeloId, session.token).catch(() => null),
      modeloNegocioService.getClientesCanales(modeloId, session.token).catch(() => null),
      modeloNegocioService.getRecursosActividades(modeloId, session.token).catch(() => null),
      modeloNegocioService.getConclusiones(modeloId, session.token).catch(() => null),
      modeloNegocioService.getFoda(modeloId, session.token).catch(() => null),
    ])

  // Find first incomplete step
  const pasos = Array.isArray(progreso.pasos) ? progreso.pasos : Array.isArray(progreso) ? progreso : []
  const sortedPasos = [...pasos].sort((a, b) => a.paso_numero - b.paso_numero)
  const incompletePaso = sortedPasos.find((p) => !p.estado)
  const firstIncompleteStep = STEP_NUMBER_TO_KEY[incompletePaso?.paso_numero ?? 1] ?? 'ficha'

  return {
    modelo,
    progreso: progreso.pasos,
    firstIncompleteStep,
    sections: {
      introduccion: introduccion?.introduccion ?? null,
      contexto: contexto?.contexto ?? null,
      propuestaValor: propuestaValor?.propuesta_valor ?? null,
      clientesCanales: clientesCanales?.clientes_canales ?? null,
      recursosActividades: recursosActividades?.recursos_actividades ?? null,
      conclusiones: conclusiones?.conclusiones ?? null,
      foda: foda?.foda ?? null,
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
  const session = await import('@/features/auth/services/session.service').then((m) =>
    m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.list(params, session.token)
}

export async function deleteModeloAction(modeloId: number) {
  const session = await import('@/features/auth/services/session.service').then((m) =>
    m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.delete(modeloId, session.token)
}

export async function changeEstadoAction(
  modeloId: number,
  idEstado: number,
  motivo?: string
) {
  const session = await import('@/features/auth/services/session.service').then((m) =>
    m.getSession()
  )
  if (!session) throw new Error('Sesión no encontrada')

  return modeloNegocioService.changeEstado(modeloId, idEstado, motivo, session.token)
}
