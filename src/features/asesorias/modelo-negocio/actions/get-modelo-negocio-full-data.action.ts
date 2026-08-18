'use server'

import { requireSession } from '@/features/auth/services/session.service'
import { modeloNegocioService } from '@/features/modelo-negocio/services/modelo-negocio-crud.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { calculateFinancialProjection } from '@/features/asesorias/modelo-negocio/utils/financial-projection'
import {
  getCategoriasInsumo,
  getUnidadesMedida,
  getCategoriasInversion,
} from './catalogs.actions'
import type { ModeloNegocioFullData } from '@/types/modelo-negocio-full.type'

const LIMIT = 500

async function fetchSafe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    console.error('[getModeloNegocioFullDataAction] fetch failed:', error)
    return null
  }
}

export async function getModeloNegocioFullDataAction(
  id: number
): Promise<ModeloNegocioFullData> {
  const session = await requireSession()
  const token = session.token

  const modeloRes = await modeloNegocioService.getById(id, token)
  const modelo = modeloRes.modelo

  // Build ficha context by matching nombre_emprendimiento (same as page.tsx)
  let nombreEmprendedor = ''
  let cedula = ''
  let contacto = ''
  let correo = ''
  let fechaIngreso = ''
  const sector: string | null = null
  let direccion: string | null = null

  try {
    const [entrepreneursRes, formulariosRes] = await Promise.all([
      entrepreneurService.getAll(1, LIMIT, token),
      entrepeneurFormService.getAllReferenciaGeneral(1, LIMIT, token),
    ])

    const entrepreneursById = new Map(
      entrepreneursRes.emprendedores.map((e) => [e.id, e])
    )

    const matchingFormulario =
      formulariosRes.formularios_referencia_general.find(
        (f) =>
          f.tiene_emprendimiento &&
          f.nombre_emprendimiento?.trim().toLowerCase() ===
            modelo.nombre_emprendimiento?.trim().toLowerCase()
      )

    let emprendedor = matchingFormulario
      ? entrepreneursById.get(matchingFormulario.id_emprendedor)
      : undefined

    // Fallback: if no formulario matched, try to find the emprendedor whose
    // emprendimiento name appears in any formulario (still best-effort).
    if (!emprendedor) {
      const anyFormulario = formulariosRes.formularios_referencia_general.find(
        (f) =>
          f.tiene_emprendimiento &&
          f.nombre_emprendimiento?.trim().toLowerCase() ===
            modelo.nombre_emprendimiento?.trim().toLowerCase()
      )
      if (anyFormulario) {
        emprendedor = entrepreneursById.get(anyFormulario.id_emprendedor)
      }
    }

    if (emprendedor) {
      nombreEmprendedor = emprendedor.nombres_apellidos
      cedula = emprendedor.cedula
      contacto = emprendedor.celular
      correo = emprendedor.email
      fechaIngreso =
        matchingFormulario?.fecha_formulario ?? emprendedor.fecha_registro
      direccion =
        emprendedor.parroquia ||
        emprendedor.barrio_comunidad ||
        [emprendedor.calle_numero, emprendedor.calle_secundaria]
          .filter(Boolean)
          .join(', ') ||
        null
    }
  } catch {
    // ficha context is best-effort
  }

  // Level 1 — all independent endpoints in parallel
  const [
    introduccionRes,
    contextoRes,
    objetivosRes,
    conclusionesRes,
    clientesCanalesRes,
    fodaRes,
    propuestaValorRes,
    fuentesIngresoRes,
    recursosActividadesRes,
    costosVariablesRes,
    costosFijosRes,
    inversionInicialRes,
    proyeccionRes,
    categoriasInsumo,
    unidadesMedida,
    categoriasInversion,
  ] = await Promise.all([
    fetchSafe(() => modeloNegocioService.getIntroduccion(id, token)),
    fetchSafe(() => modeloNegocioService.getContexto(id, token)),
    fetchSafe(() => modeloNegocioService.getObjetivosEspecificos(id, token)),
    fetchSafe(() => modeloNegocioService.getConclusiones(id, token)),
    fetchSafe(() => modeloNegocioService.getClientesCanales(id, token)),
    fetchSafe(() => modeloNegocioService.getFoda(id, token)),
    fetchSafe(() => modeloNegocioService.getPropuestaValor(id, token)),
    fetchSafe(() => modeloNegocioService.getFuentesIngreso(id, token)),
    fetchSafe(() => modeloNegocioService.getRecursosActividades(id, token)),
    fetchSafe(() => modeloNegocioService.getCostosVariables(id, token)),
    fetchSafe(() => modeloNegocioService.getCostosFijos(id, token)),
    fetchSafe(() => modeloNegocioService.getInversionInicial(id, token)),
    fetchSafe(() => modeloNegocioService.getProyeccionSupuestos(id, token)),
    fetchSafe(() => getCategoriasInsumo()),
    fetchSafe(() => getUnidadesMedida()),
    fetchSafe(() => getCategoriasInversion()),
  ])

  // Extract IDs for chained fetches
  const idPropuesta = propuestaValorRes?.data?.id ?? null
  const fuentesIngreso = fuentesIngresoRes?.data ?? []
  const idFuenteIngreso =
    fuentesIngreso.length > 0 ? fuentesIngreso[0].id : null

  // Level 2 — chained fetches (depend on Level 1 results)
  const [propuestaProductosRes, portafolioProductosRes] = await Promise.all([
    idPropuesta
      ? fetchSafe(() =>
          modeloNegocioService.getPropuestaProductos(idPropuesta, token)
        )
      : Promise.resolve(null),
    idFuenteIngreso
      ? fetchSafe(() =>
          modeloNegocioService.getPortafolioProductos(idFuenteIngreso, token)
        )
      : Promise.resolve(null),
  ])

  // Map FODA array to object
  const fodaArray = fodaRes?.data ?? []
  const foda =
    fodaArray.length > 0
      ? {
          fortalezas:
            fodaArray.find((f) => f.id_cuadrante === 1)?.contenido ?? '',
          oportunidades:
            fodaArray.find((f) => f.id_cuadrante === 2)?.contenido ?? '',
          debilidades:
            fodaArray.find((f) => f.id_cuadrante === 3)?.contenido ?? '',
          amenazas:
            fodaArray.find((f) => f.id_cuadrante === 4)?.contenido ?? '',
        }
      : null

  // Map Canvas array to object
  const canvas = clientesCanalesRes?.data
    ? {
        segmentos: clientesCanalesRes.data.segmentos ?? '',
        canales: clientesCanalesRes.data.canales ?? '',
        relacion_clientes: clientesCanalesRes.data.relacion ?? '',
      }
    : null

  // Catalog lookups for costos names
  const lookupCat = (id: number | null) =>
    (categoriasInsumo ?? []).find((c) => c.id === id)?.descripcion ??
    String(id ?? '')
  const lookupUnidad = (id: number | null) =>
    (unidadesMedida ?? []).find((u) => u.id === id)?.descripcion ??
    String(id ?? '')
  const lookupInversion = (id: number | null) =>
    (categoriasInversion ?? []).find((c) => c.id === id)?.descripcion ??
    String(id ?? '')

  // Map costos variables with catalog names
  const costosVariablesRaw = costosVariablesRes?.data ?? []
  const costosVariables =
    costosVariablesRaw.length > 0
      ? costosVariablesRaw.map((cv) => ({
          categoria: lookupCat(cv.id_categoria),
          descripcion: cv.descripcion,
          cantidad: cv.cantidad,
          unidad: lookupUnidad(cv.id_unidad),
          costoUnitario: cv.costo_unitario,
        }))
      : null

  // Map costos fijos
  const costosFijosRaw = costosFijosRes?.data ?? []
  const costosFijos =
    costosFijosRaw.length > 0
      ? costosFijosRaw.map((cf) => ({
          detalle: cf.detalle,
          valor: cf.valor,
        }))
      : null

  // Map inversión inicial
  const inversionRaw = inversionInicialRes?.data ?? []
  const inversionInicial =
    inversionRaw.length > 0
      ? inversionRaw.map((inv) => ({
          categoria: lookupInversion(inv.id_categoria),
          descripcion: inv.descripcion,
          costo: inv.costo,
        }))
      : null

  // Calculate financial projection server-side
  const proyeccionSupuestos = proyeccionRes?.data ?? null

  let precioProyeccion = proyeccionSupuestos?.precio ?? 0
  if (
    precioProyeccion === 0 &&
    proyeccionSupuestos &&
    proyeccionSupuestos.margen > 0 &&
    proyeccionSupuestos.margen < 100 &&
    proyeccionSupuestos.var_ratio > 0
  ) {
    precioProyeccion = Number(
      (
        proyeccionSupuestos.var_ratio /
        (1 - proyeccionSupuestos.margen / 100)
      ).toFixed(2)
    )
  }

  const proyeccion = proyeccionSupuestos
    ? calculateFinancialProjection({
        precio: precioProyeccion,
        costosFijos: proyeccionSupuestos.costos_fijos,
        growth: proyeccionSupuestos.crecimiento,
        startUnits: proyeccionSupuestos.start_units,
        costoVariableUnitario: proyeccionSupuestos.var_ratio,
        margen: proyeccionSupuestos.margen,
        annualFixedCostIncrease: proyeccionSupuestos.aumento_anual_cfijos ?? 0,
      })
    : null

  return {
    ficha: {
      n_tramite: modelo.n_tramite,
      nombre_emprendimiento: modelo.nombre_emprendimiento,
      analista: modelo.analista,
      producto_linea: modelo.producto_linea ?? '',
      observaciones: modelo.observaciones ?? '',
      nombreEmprendedor,
      cedula,
      contacto,
      correo,
      fechaIngreso,
      sector,
      direccion,
    },
    introduccion: introduccionRes?.data
      ? {
          texto: introduccionRes.data.introduccion,
          importancia: introduccionRes.data.importancia,
        }
      : null,
    contexto: contextoRes?.data
      ? {
          antecedentes: contextoRes.data.antecedentes,
          justificacion: contextoRes.data.justificacion,
          objetivo_general: contextoRes.data.objetivo_general,
        }
      : null,
    objetivosEspecificos: objetivosRes?.data?.map((o) => o.descripcion) ?? null,
    conclusiones: conclusionesRes?.data?.conclusiones ?? null,
    canvas,
    foda,
    propuestaValor: propuestaValorRes?.data?.propuesta_valor ?? null,
    propuestaProductos:
      propuestaProductosRes?.data?.map((p) => ({
        producto: p.nombre,
        descripcion: p.codigo_producto ?? '',
        precio: 0,
      })) ?? null,
    fuenteIngreso: fuentesIngreso[0]?.fuente_ingreso ?? null,
    portafolioProductos:
      portafolioProductosRes?.data?.map((p) => ({
        producto: p.codigo_producto ?? '',
        precio: p.precio,
        peso: p.peso,
      })) ?? null,
    recursosActividades: recursosActividadesRes?.data
      ? {
          recursosFinancieros: recursosActividadesRes.data.recursos_financieros,
          recursosFisicos: recursosActividadesRes.data.recursos_fisicos,
          mobiliario: recursosActividadesRes.data.mobiliario,
          local: recursosActividadesRes.data.local,
          actividades: recursosActividadesRes.data.actividades,
          socios: recursosActividadesRes.data.socios,
        }
      : null,
    costosVariables,
    costosFijos,
    inversionInicial,
    proyeccion,
  }
}
