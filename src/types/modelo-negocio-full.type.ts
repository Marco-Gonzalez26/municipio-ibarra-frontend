import type { SupuestosProyeccion } from '@/features/asesorias/modelo-negocio/types/canvas.type'
import type {
  FilaProyeccion,
  IngresoAnual,
} from '@/features/asesorias/modelo-negocio/utils/financial-projection'

export interface ModeloNegocioFullData {
  ficha: FichaFullData
  introduccion: IntroduccionFullData | null
  contexto: ContextoFullData | null
  objetivosEspecificos: string[] | null
  conclusiones: string | null
  canvas: CanvasFullData | null
  foda: FodaFullData | null
  propuestaValor: string | null
  propuestaProductos: PropuestaProductoFullData[] | null
  fuenteIngreso: string | null
  portafolioProductos: PortafolioProductoFullData[] | null
  recursosActividades: RecursosActividadesFullData | null
  costosVariables: CostoVariableFullData[] | null
  costosFijos: CostoFijoFullData[] | null
  inversionInicial: InversionInicialFullData[] | null
  proyeccion: ProyeccionFinanciera | null
}

export interface ProyeccionFinanciera {
  filas: FilaProyeccion[]
  ingresosPorAnio: IngresoAnual[]
}

export interface FichaFullData {
  n_tramite: string
  nombre_emprendimiento: string
  analista: string
  producto_linea: string
  observaciones: string
  nombreEmprendedor: string
  cedula: string
  contacto: string
  correo: string
  fechaIngreso: string
  sector: string | null
  direccion: string | null
}

export interface IntroduccionFullData {
  texto: string
  importancia: string
}

export interface ContextoFullData {
  antecedentes: string
  justificacion: string
  objetivo_general: string
}

export interface CanvasFullData {
  segmentos: string
  canales: string
  relacion_clientes: string
}

export interface FodaFullData {
  fortalezas: string
  oportunidades: string
  debilidades: string
  amenazas: string
}

export interface PropuestaProductoFullData {
  producto: string
  descripcion: string
  precio: number
}

export interface PortafolioProductoFullData {
  producto: string
  precio: number
  peso: number | null
}

export interface RecursosActividadesFullData {
  recursosFinancieros: string
  recursosFisicos: string
  mobiliario: string
  local: string
  actividades: string
  socios: string
}

export interface CostoVariableFullData {
  categoria: string
  descripcion: string
  cantidad: number
  unidad: string
  costoUnitario: number
}

export interface CostoFijoFullData {
  detalle: string
  valor: number
}

export interface InversionInicialFullData {
  categoria: string
  descripcion: string
  costo: number
}

export type { SupuestosProyeccion }
