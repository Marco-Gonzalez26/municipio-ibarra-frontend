export interface PagoForm {
  valor_pago_inicial: number | null
  codigo_pago: string
}

export interface DatosPersonalesForm {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  celular: string
  nacionalidad: string
  fecha_nacimiento: string

  ciudad: string
  parroquia: string
  barrio_comunidad: string
  calle_principal: string
  calle_secundaria: string
  numero_casa: string

  id_estado_civil: number | null
  id_rango_edad: number | null
  tiene_discapacidad: boolean
  id_tipo_discapacidad: number | null
  porcentaje_discapacidad: string
  numero_carnet_discapacidad: string

  cantidad_cargas_familiares: number
  cargas_con_discapacidad: number

  id_genero: number | null
  id_etnia: number | null
  etnia_otra: string

  id_nivel_estudios: number | null
  titulo_profesional: string
}

export interface SituacionActualForm {
  id_ocupacion: number | null
  ocupacion_otra: string
  id_nivel_ingresos: number | null
  tiene_emprendimiento: boolean
  pertenece_asociatividad: boolean
}

export interface IntencionesForm {
  desea_emprender: boolean
  motivacion_emprender: string
  sectores_interes: number[]
}

export interface EmprendimientoForm {
  nombre_emprendimiento: string
  anio_creacion: number | null
  descripcion: string
  id_sector: number | null
  id_tipo: number | null
  recursos_disponibles: number[]
  desea_mejorar: boolean
  motivo_mejora: string
}

export interface AsistenciaTecnicaForm {
  areas_asistencia: number[]
  observaciones: string
}

export interface RegistroEmprendedorState {
  pago: PagoForm
  datosPersonales: DatosPersonalesForm
  situacionActual: SituacionActualForm
  intenciones: IntencionesForm
  emprendimiento: EmprendimientoForm
  asistenciaTecnica: AsistenciaTecnicaForm
}

export type WizardStep =
  | 'pago'
  | 'datos-personales'
  | 'situacion-actual'
  | 'intenciones'
  | 'emprendimiento'
  | 'asistencia-tecnica'

export type WizardMode = 'registro' | 'emprendimiento-existente'

export const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: 'pago', label: 'Pago' },

  { key: 'datos-personales', label: 'Datos Personales' },
  { key: 'situacion-actual', label: 'Situación Actual' },
  { key: 'intenciones', label: 'Intenciones' },
  { key: 'emprendimiento', label: 'Emprendimiento' },
  { key: 'asistencia-tecnica', label: 'Asistencia Técnica' },
]

export const EXISTING_ENTREPRENEUR_STEPS: {
  key: WizardStep
  label: string
}[] = [
  { key: 'pago', label: 'Pago' },
  { key: 'intenciones', label: 'Sectores' },
  { key: 'emprendimiento', label: 'Emprendimiento' },
  { key: 'asistencia-tecnica', label: 'Asistencia Técnica' },
]
