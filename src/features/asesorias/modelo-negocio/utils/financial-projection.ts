import type { SupuestosProyeccion } from '../types/canvas.type'

const TRIMESTRES_POR_ANIO = 4
const TOTAL_TRIMESTRES = 20

export interface FilaProyeccion {
  anio: number
  trimestre: number
  unidades: number
  ingreso: number
  costosFijos: number
  costosVariables: number
  utilidadNeta: number
  margen: number
  ingresoMensualPromedio: number
}

export interface IngresoAnual {
  anio: number
  ingreso: number
}

export interface ProyeccionFinanciera {
  filas: FilaProyeccion[]
  ingresosPorAnio: IngresoAnual[]
}

export function calculateFinancialProjection(
  supuestos: SupuestosProyeccion
): ProyeccionFinanciera {
  const precio = Number(supuestos.precio) || 0
  const baseCostosFijos = Number(supuestos.costosFijos) || 0
  const growthPct = Number(supuestos.growth) || 0
  const startUnits = Number(supuestos.startUnits) || 0
  const costoVariableUnitario = Number(supuestos.costoVariableUnitario) || 0
  const annualPct = Number(supuestos.annualFixedCostIncrease) || 0

  const growthDecimal = growthPct / 100
  const annualIncreaseDecimal = 1 + annualPct / 100

  const filas: FilaProyeccion[] = []
  const ingresosPorAnioMap = new Map<number, number>()

  let unidadesActuales = startUnits

  for (let i = 0; i < TOTAL_TRIMESTRES; i++) {
    const anio = Math.floor(i / TRIMESTRES_POR_ANIO) + 1
    const trimestre = (i % TRIMESTRES_POR_ANIO) + 1

    const costosFijos =
      baseCostosFijos * Math.pow(annualIncreaseDecimal, anio - 1)
    const ingreso = unidadesActuales * precio
    const costosVariables = unidadesActuales * costoVariableUnitario
    const utilidadNeta = ingreso - costosFijos - costosVariables
    const margen = ingreso > 0 ? (utilidadNeta / ingreso) * 100 : 0
    const ingresoMensualPromedio = ingreso / 3

    filas.push({
      anio,
      trimestre,
      unidades: Math.round(unidadesActuales),
      ingreso,
      costosFijos,
      costosVariables,
      utilidadNeta,
      margen,
      ingresoMensualPromedio,
    })

    ingresosPorAnioMap.set(anio, (ingresosPorAnioMap.get(anio) ?? 0) + ingreso)

    unidadesActuales = unidadesActuales * (1 + growthDecimal)
  }

  const ingresosPorAnio: IngresoAnual[] = Array.from(
    ingresosPorAnioMap,
    ([anio, ingreso]) => ({ anio, ingreso })
  )

  return { filas, ingresosPorAnio }
}
