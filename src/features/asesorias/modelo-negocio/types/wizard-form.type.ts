import type { FichaForm } from './ficha.type'
import type {
  AntecedentesForm,
  IntroduccionForm,
  JustificacionForm,
  ObjetivosForm,
} from './documento.type'
import type {
  ActividadesForm,
  CanalesForm,
  CostosForm,
  IngresosForm,
  PropuestaForm,
  RecursosForm,
  RelacionForm,
  SegmentosForm,
  SociosForm,
} from './canvas.type'
import type { AnexosForm, ConclusionesForm } from './cierre.type'

export interface ModeloNegocioState {
  ficha: FichaForm
  introduccion: IntroduccionForm
  antecedentes: AntecedentesForm
  justificacion: JustificacionForm
  objetivos: ObjetivosForm
  propuesta: PropuestaForm
  segmentos: SegmentosForm
  canales: CanalesForm
  relacion: RelacionForm
  ingresos: IngresosForm
  recursos: RecursosForm
  actividades: ActividadesForm
  socios: SociosForm
  costos: CostosForm
  conclusiones: ConclusionesForm
  anexos: AnexosForm
}

export type WizardStep =
  | 'ficha'
  | 'introduccion'
  | 'antecedentes'
  | 'justificacion'
  | 'objetivos'
  | 'propuesta'
  | 'segmentos'
  | 'canales'
  | 'relacion'
  | 'ingresos'
  | 'recursos'
  | 'actividades'
  | 'socios'
  | 'costos'
  | 'conclusiones'
  | 'anexos'

export type ModeloNegocioEstado = 'borrador' | 'completado'

export interface ModeloNegocioRegistro {
  modeloNegocioId: number | null
  idEmprendedor: number
  nombreEmprendedor: string
  nombreEmprendimiento: string | null
  estado: ModeloNegocioEstado
  actualizadoEn: string
  formData: ModeloNegocioState
}

export const TABLE_MAP: Record<WizardStep, string[]> = {
  ficha: ['modelo_negocio'],
  introduccion: ['mn_introduccion'],
  antecedentes: ['mn_contexto'],
  justificacion: ['mn_contexto'],
  objetivos: ['mn_contexto'],
  propuesta: ['mn_propuesta_valor'],
  segmentos: ['mn_clientes_canales'],
  canales: ['mn_clientes_canales'],
  relacion: ['mn_clientes_canales'],
  ingresos: ['mn_fuente_ingreso', 'mn_portafolio_producto'],
  recursos: ['mn_recursos_actividades'],
  actividades: ['mn_recursos_actividades'],
  socios: ['mn_recursos_actividades'],
  costos: ['mn_costo_variable', 'mn_costo_fijo', 'mn_inversion_inicial', 'mn_proyeccion_supuestos'],
  conclusiones: ['mn_conclusiones'],
  anexos: ['mn_foda', 'mn_canvas'],
}

export const WIZARD_STEPS: {
  key: WizardStep
  label: string
  group: string
}[] = [
  { key: 'ficha', label: 'Ficha del emprendimiento', group: 'Datos generales' },

  { key: 'introduccion', label: 'Introducción', group: 'Documento' },
  {
    key: 'antecedentes',
    label: 'Antecedentes del emprendimiento',
    group: 'Documento',
  },
  { key: 'justificacion', label: 'Justificación', group: 'Documento' },
  { key: 'objetivos', label: 'Objetivos', group: 'Documento' },

  {
    key: 'propuesta',
    label: 'Propuesta de valor',
    group: 'Modelo de negocio',
  },
  {
    key: 'segmentos',
    label: 'Segmentos de clientes',
    group: 'Modelo de negocio',
  },
  {
    key: 'canales',
    label: 'Canales de distribución',
    group: 'Modelo de negocio',
  },
  {
    key: 'relacion',
    label: 'Relación con clientes',
    group: 'Modelo de negocio',
  },
  { key: 'ingresos', label: 'Fuentes de ingreso', group: 'Modelo de negocio' },
  { key: 'recursos', label: 'Recursos clave', group: 'Modelo de negocio' },
  {
    key: 'actividades',
    label: 'Actividades clave',
    group: 'Modelo de negocio',
  },
  { key: 'socios', label: 'Socios clave', group: 'Modelo de negocio' },
  { key: 'costos', label: 'Estructura de costos', group: 'Modelo de negocio' },

  { key: 'conclusiones', label: 'Conclusiones', group: 'Cierre' },
  { key: 'anexos', label: 'Anexos (FODA)', group: 'Cierre' },
]
