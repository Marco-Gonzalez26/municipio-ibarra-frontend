import type { ModeloNegocioState } from '../types/wizard-form.type'

export type CanvasBlockId =
  | 'socios'
  | 'actividades'
  | 'recursos'
  | 'propuesta'
  | 'relacion'
  | 'canales'
  | 'segmentos'
  | 'costos'
  | 'ingresos'

export interface CanvasBloque {
  id: CanvasBlockId
  titulo: string
  contenido: string
}

const SIN_CONTENIDO = 'Sin completar todavía.'

function joinOrEmpty(partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join('\n\n') || SIN_CONTENIDO
}

function summarizePropuesta(
  propuesta: ModeloNegocioState['propuesta']
): string {
  const portafolio = propuesta.portafolio.filter(Boolean).join(', ')
  return joinOrEmpty([
    propuesta.propuestaValor,
    portafolio && `Portafolio: ${portafolio}`,
  ])
}

function summarizeIngresos(ingresos: ModeloNegocioState['ingresos']): string {
  const productos = ingresos.productos
    .filter((producto) => producto.producto)
    .map((producto) => `${producto.producto} ($${Number(producto.precio).toFixed(2)})`)
    .join(', ')
  return joinOrEmpty([
    ingresos.ingresosTexto,
    productos && `Productos: ${productos}`,
  ])
}

function summarizeRecursos(recursos: ModeloNegocioState['recursos']): string {
  return joinOrEmpty([
    recursos.recursosFinancieros &&
      `Financieros: ${recursos.recursosFinancieros}`,
    recursos.recursosFisicos && `Físicos: ${recursos.recursosFisicos}`,
    recursos.mobiliario && `Mobiliario: ${recursos.mobiliario}`,
    recursos.local && `Local: ${recursos.local}`,
  ])
}

function summarizeCostos(costos: ModeloNegocioState['costos']): string {
  const totalInsumos = costos.insumos.reduce(
    (total, insumo) => total + Number(insumo.cantidad) * Number(insumo.costoUnit),
    0
  )
  const totalFijos = costos.fijos.reduce((total, fijo) => total + Number(fijo.valor), 0)
  const totalInversion = costos.inversion.reduce(
    (total, item) => total + Number(item.costo),
    0
  )

  if (totalInsumos === 0 && totalFijos === 0 && totalInversion === 0) {
    return SIN_CONTENIDO
  }

  return [
    `Costos variables: $${totalInsumos.toFixed(2)}`,
    `Costos fijos mensuales: $${totalFijos.toFixed(2)}`,
    `Inversión inicial: $${totalInversion.toFixed(2)}`,
  ].join('\n')
}

/**
 * No hay campos propios para el Canvas: se arma siempre desde los pasos
 * 6-14, así nunca queda desactualizado si el usuario edita algo después
 * de haber llegado a Anexos.
 */
export function deriveCanvas(formData: ModeloNegocioState): CanvasBloque[] {
  const {
    propuesta,
    segmentos,
    canales,
    relacion,
    ingresos,
    recursos,
    actividades,
    socios,
    costos,
  } = formData

  return [
    {
      id: 'socios',
      titulo: 'Socios clave',
      contenido: socios.socios || SIN_CONTENIDO,
    },
    {
      id: 'actividades',
      titulo: 'Actividades clave',
      contenido: actividades.actividades || SIN_CONTENIDO,
    },
    {
      id: 'recursos',
      titulo: 'Recursos clave',
      contenido: summarizeRecursos(recursos),
    },
    {
      id: 'propuesta',
      titulo: 'Propuesta de valor',
      contenido: summarizePropuesta(propuesta),
    },
    {
      id: 'relacion',
      titulo: 'Relación con clientes',
      contenido: relacion.relacion || SIN_CONTENIDO,
    },
    {
      id: 'canales',
      titulo: 'Canales',
      contenido: canales.canales || SIN_CONTENIDO,
    },
    {
      id: 'segmentos',
      titulo: 'Segmentos de clientes',
      contenido: segmentos.segmentos || SIN_CONTENIDO,
    },
    {
      id: 'costos',
      titulo: 'Estructura de costos',
      contenido: summarizeCostos(costos),
    },
    {
      id: 'ingresos',
      titulo: 'Fuentes de ingreso',
      contenido: summarizeIngresos(ingresos),
    },
  ]
}
