export interface ModeloNegocioDTO {
  id: number
  n_tramite: string
  fecha_ingreso: string
  nombre_emprendimiento: string
  id_sector: number
  producto_linea: string | null
  analista: string
  observaciones: string | null
  id_estado: number
  fecha_registro: string
  fecha_actualizacion: string
  id_usuario_registro: number | null
  activo: boolean | number
}

export interface ModeloNegocioCreateDTO {
  n_tramite: string
  fecha_ingreso: string
  nombre_emprendimiento: string
  id_sector: number
  producto_linea?: string
  analista: string
  observaciones?: string
}

export interface ModeloNegocioListResponse {
  modelos: ModeloNegocioDTO[]
  total: number
  page: number
  limit: number
}

export interface IntroduccionDTO {
  id: number
  id_modelo: number
  introduccion: string
  importancia: string
}

export interface ContextoDTO {
  id: number
  id_modelo: number
  antecedentes: string
  justificacion: string
  impacto: string
  objetivo_general: string
}

export interface ObjetivoEspecificoDTO {
  id: number
  id_modelo: number
  descripcion: string
  orden: number
}

export interface PropuestaValorDTO {
  id: number
  id_modelo: number
  propuesta_valor: string
}

export interface PropuestaProductoDTO {
  id?: number
  codigo_producto: string
  id_propuesta: number
  nombre: string
  imagen: string | null
}

export interface ClientesCanalesDTO {
  id: number
  id_modelo: number
  segmentos: string
  canales: string
  relacion: string
}

export interface FuenteIngresoDTO {
  id: number
  id_modelo: number
  fuente_ingreso: string
  monto_estimado: number | null
}

export interface PortafolioProductoDTO {
  id: number
  id_fuente_ingreso: number
  codigo_producto: string | null
  nombre_producto: string
  precio: number
  descripcion: string | null
  peso: number | null
}

export interface RecursosActividadesDTO {
  id: number
  id_modelo: number
  recursos_financieros: string
  recursos_fisicos: string
  mobiliario: string
  local: string
  actividades: string
  socios: string
}

export interface CostoVariableDTO {
  id: number
  id_modelo: number
  categoria: string
  descripcion: string
  cantidad: number
  unidad: string
  costo_unitario: number
}

export interface CostoFijoDTO {
  id: number
  id_modelo: number
  detalle: string
  valor: number
}

export interface InversionInicialDTO {
  id: number
  id_modelo: number
  categoria: string
  descripcion: string
  costo: number
}

export interface ProyeccionSupuestosDTO {
  id: number
  id_modelo: number
  precio: number
  costos_fijos: number
  crecimiento: number
  start_units: number
  var_ratio: number
  margen: number
}

export interface ConclusionesDTO {
  id: number
  id_modelo: number
  conclusiones: string
}

export interface FodaDTO {
  id: number
  id_modelo: number
  id_cuadrante: number
  contenido: string
}

export interface CanvasDTO {
  id: number
  id_modelo: number
  id_bloque: number
  contenido: string
}

export interface ProgresoModeloDTO {
  id: number
  id_modelo: number
  paso_numero: number
  paso_descripcion: string
  estado: boolean | number
  fecha_guardado: string | null
  id_usuario_guardado: number | null
  fecha_registro: string
  fecha_actualizacion: string
}

export interface EstadoCambioDTO {
  id_estado: number
  motivo?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  id_estado?: number
}
