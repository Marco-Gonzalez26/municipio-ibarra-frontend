import type { SupuestosProyeccion } from '../types/canvas.type'

const TRIMESTRES_POR_ANIO = 4
const TOTAL_TRIMESTRES = 20 // 5 años

export interface FilaProyeccion {
  anio: number
  trimestre: number
  unidades: number
  ingreso: number
  costosFijos: number
  costosVariables: number
  utilidadNeta: number
  beneficioMensual: number
}

export interface IngresoAnual {
  anio: number
  ingreso: number
}

export interface ProyeccionFinanciera {
  filas: FilaProyeccion[]
  ingresosPorAnio: IngresoAnual[]
}

/**
 * Genera las 20 filas trimestrales aplicando crecimiento compuesto sobre
 * el ingreso inicial y costos variables como porcentaje del ingreso.
 * El `margen` no interviene en ningún cálculo, igual que en la maqueta
 * original: se guarda pero no se usa.
 */
export function calculateFinancialProjection(
  supuestos: SupuestosProyeccion
): ProyeccionFinanciera {
  const { precio, costosFijos, growth, startUnits, varRatio } = supuestos

  const filas: FilaProyeccion[] = []
  const ingresosPorAnioMap = new Map<number, number>()

  for (let i = 0; i < TOTAL_TRIMESTRES; i++) {
    // Estos calculos se basan en la maqueta original, que reporta el ingreso trimestral como
    // "beneficio mensual" (dividido entre 3) y no como utilidad neta mensualizada.
    const anio = Math.floor(i / TRIMESTRES_POR_ANIO) + 1
    const trimestre = (i % TRIMESTRES_POR_ANIO) + 1
    const ingreso = startUnits * precio * Math.pow(1 + growth / 100, i)
    const unidades = Math.round(ingreso / (precio || 1))
    const costosVariables = ingreso * (varRatio / 100)
    const utilidadNeta = ingreso - costosFijos - costosVariables
    const beneficioMensual = ingreso / 3

    filas.push({
      anio,
      trimestre,
      unidades,
      ingreso,
      costosFijos,
      costosVariables,
      utilidadNeta,
      beneficioMensual,
    })

    ingresosPorAnioMap.set(anio, (ingresosPorAnioMap.get(anio) ?? 0) + ingreso)
  }

  const ingresosPorAnio: IngresoAnual[] = Array.from(
    ingresosPorAnioMap,
    ([anio, ingreso]) => ({ anio, ingreso })
  )

  return { filas, ingresosPorAnio }
}
