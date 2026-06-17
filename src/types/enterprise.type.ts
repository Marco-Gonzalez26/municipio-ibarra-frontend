// NOTA: Aun no implementado en el back
// Se basa en los campos visuales del formulario en los pasos 3, 4 y 5.
// Ajustar cuando el backend defina el contrato real.

export interface Emprendimiento {
  id: number
  id_emprendedor: number

  // Paso 3 - Intenciones
  desea_emprender: boolean
  motivacion_emprender: string | null
  // TODO: pendiente catálogo "sectores de interés" (cat_sector_interes), no existe aún en backend
  sectores_interes: number[]

  // Paso 4 - Información del emprendimiento (solo si tiene_emprendimiento = true)
  nombre_emprendimiento: string | null
  anio_creacion: number | null
  descripcion: string | null
  // TODO: pendiente catálogo de "sector" y "tipo" de emprendimiento, no existe aún en backend
  id_sector: number | null
  id_tipo: number | null
  // TODO: pendiente catálogo "recursos disponibles", no existe aún en backend
  recursos_disponibles: number[]
  desea_mejorar: boolean | null
  motivo_mejora: string | null

  // Paso 5 - Asistencia técnica
  id_situacion_actual: number // deriva de paso 2/3, no editable directamente
  areas_asistencia: number[] // ids de cat_area_asistencia
  observaciones: string | null

  fecha_registro: string
  activo: boolean
}

export type EmprendimientoCreateDTO = Omit<
  Emprendimiento,
  'id' | 'fecha_registro' | 'activo'
>
