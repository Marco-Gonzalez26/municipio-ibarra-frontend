import type { EmprendedorCreateDTO } from '@/types/entrepreneur.type'
import type { RangoEdadItem } from '@/types/catalog.type'
import type { RegistroEmprendedorState } from '../types/wizard-form.type'
import {
  FormularioAsistenciaTecnicaCreateDTO,
  FormularioReferenciaGeneralCreateDTO,
} from '@/types/form.type'

/**
 * Calcula la edad exacta a partir de la fecha de nacimiento (formato YYYY-MM-DD).
 */
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return age
}

/**
 * Determina el id del rango de edad correspondiente, según los rangos
 * (edad_min / edad_max) del catálogo cat_rango_edad.
 */
export function resolveAgeRangeId(
  age: number,
  ageRanges: RangoEdadItem[]
): number | null {
  const match = ageRanges.find(
    (range) => age >= range.edad_min && age <= range.edad_max
  )
  return match ? match.id : null
}

/**
 * Deriva el id_situacion del cat_situacion_emprendedor a partir de las
 * respuestas del wizard:
 * 1 → No tengo ni soy parte de un emprendimiento ni de una asociatividad y anhelo emprender
 * 2 → Tengo un emprendimiento
 * 3 → Soy parte de una asociatividad emprendedora
 */
export function resolveSituacionId(state: RegistroEmprendedorState): number {
  if (state.situacionActual.pertenece_asociatividad) return 3
  if (state.situacionActual.tiene_emprendimiento) return 2
  return 1
}

/**
 * Transforma el estado del wizard en el DTO de formulario_referencia_general.
 */
export function mapWizardToFormularioReferenciaDTO(
  state: RegistroEmprendedorState,
  idEmprendedor: number,
  today: string
): FormularioReferenciaGeneralCreateDTO {
  return {
    id_emprendedor: idEmprendedor,
    fecha_formulario: today,
    tiene_emprendimiento: state.situacionActual.tiene_emprendimiento,
    esta_en_asociatividad: state.situacionActual.pertenece_asociatividad,
    intencion_emprender: state.intenciones.desea_emprender ?? null,
    motivo_intencion_emprender: state.intenciones.motivacion_emprender || null,
    intencion_mejorar: state.emprendimiento.desea_mejorar ?? null,
    motivo_intencion_mejorar: state.emprendimiento.motivo_mejora || null,
    nombre_emprendimiento: state.emprendimiento.nombre_emprendimiento || null,
    id_tipo_oferta: state.emprendimiento.id_tipo ?? null,
    notas_adicionales: null,
    valor_pago_inicial: state.pago.valor_pago_inicial,
    codigo_pago: state.pago.codigo_pago,
  }
}

/**
 * Transforma el estado del wizard en el DTO de formulario_asistencia_tecnica.
 */
export function mapWizardToFormularioAsistenciaDTO(
  state: RegistroEmprendedorState,
  idEmprendedor: number,
  today: string
): FormularioAsistenciaTecnicaCreateDTO {
  if (state.asistenciaTecnica.tasa_cancelada === null) {
    throw new Error('Debe indicar si la tasa fue cancelada')
  }
  return {
    id_emprendedor: idEmprendedor,
    fecha_formulario: today,
    nombre_emprendimiento: state.emprendimiento.nombre_emprendimiento || null,
    id_situacion: resolveSituacionId(state),
    tasa_cancelada: state.asistenciaTecnica.tasa_cancelada,
    notas: state.asistenciaTecnica.observaciones || null,
  }
}

/**
 * Transforma el estado completo del wizard (5 pasos) en el DTO que espera
 * el endpoint POST /emprendedor.
 */
export function mapWizardToEntrepreneurDTO(
  state: RegistroEmprendedorState,
  ageRanges: RangoEdadItem[]
): EmprendedorCreateDTO {
  const { datosPersonales } = state
  const age = calculateAge(datosPersonales.fecha_nacimiento)
  const ageRangeId = resolveAgeRangeId(age, ageRanges)

  const streetNumber = [
    datosPersonales.calle_principal,
    datosPersonales.numero_casa,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    nombres_apellidos: `${datosPersonales.nombres} ${datosPersonales.apellidos}`,
    cedula: datosPersonales.cedula,
    email: datosPersonales.email,
    celular: datosPersonales.celular,
    nacionalidad: datosPersonales.nacionalidad,
    fecha_nacimiento: datosPersonales.fecha_nacimiento,
    edad: age,
    id_rango_edad: ageRangeId ?? 0,
    ciudad: datosPersonales.ciudad,
    parroquia: datosPersonales.parroquia,
    barrio_comunidad: datosPersonales.barrio_comunidad,
    calle_numero: streetNumber,
    calle_secundaria: datosPersonales.calle_secundaria,
    id_estado_civil: datosPersonales.id_estado_civil ?? 0,
    tiene_discapacidad: datosPersonales.tiene_discapacidad,
    id_tipo_discapacidad: datosPersonales.id_tipo_discapacidad,
    porcentaje_discapacidad: datosPersonales.porcentaje_discapacidad || null,
    numero_carnet_discapacidad:
      datosPersonales.numero_carnet_discapacidad || null,
    cantidad_cargas_familiares: datosPersonales.cantidad_cargas_familiares,
    cargas_con_discapacidad: datosPersonales.cargas_con_discapacidad,
    id_genero: datosPersonales.id_genero ?? 0,
    id_etnia: datosPersonales.id_etnia ?? 0,
    etnia_otra: datosPersonales.etnia_otra || null,
    id_nivel_estudios: datosPersonales.id_nivel_estudios ?? 0,
    titulo_profesional: datosPersonales.titulo_profesional || null,
    id_ocupacion: state.situacionActual.id_ocupacion ?? 0,
    ocupacion_otra: state.situacionActual.ocupacion_otra || null,
    id_nivel_ingresos: state.situacionActual.id_nivel_ingresos ?? 0,
  }
}
