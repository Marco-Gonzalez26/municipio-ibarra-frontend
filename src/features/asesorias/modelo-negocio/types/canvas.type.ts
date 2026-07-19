export interface PropuestaForm {
  propuestaValor: string
  portafolio: string[]
}

export interface SegmentosForm {
  segmentos: string
}

export interface CanalesForm {
  canales: string
}

export interface RelacionForm {
  relacion: string
}

export interface ProductoPrecio {
  producto: string
  descripcion: string
  precio: number
}

export interface IngresosForm {
  ingresosTexto: string
  productos: ProductoPrecio[]
}

export interface RecursosForm {
  recursosFinancieros: string
  recursosFisicos: string
  mobiliario: string
  local: string
}

export interface ActividadesForm {
  actividades: string
}

export interface SociosForm {
  socios: string
}

export interface InsumoCosto {
  categoria: string
  descripcion: string
  cantidad: number
  unidad: string
  costoUnit: number
}

export interface CostoFijo {
  detalle: string
  valor: number
}

export interface InversionItem {
  categoria: string
  descripcion: string
  costo: number
}

export interface SupuestosProyeccion {
  precio: number
  costosFijos: number
  growth: number
  startUnits: number
  varRatio: number
  margen: number
}

export interface CostosForm {
  insumos: InsumoCosto[]
  fijos: CostoFijo[]
  inversion: InversionItem[]
  proyeccion: SupuestosProyeccion
}
