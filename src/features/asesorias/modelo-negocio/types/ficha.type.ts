export interface FichaContexto {
  idEmprendedor: number
  nombreEmprendedor: string
  cedula: string
  contacto: string
  correo: string
  fechaIngreso: string
  nombreEmprendimiento: string | null
  sector: string | null
  direccion: string | null
}

export interface FichaForm {
  numeroTramite: string
  productoLinea: string
  analista: string
  observaciones: string
}

export interface EmprendimientoOpcion {
  idEmprendedor: number
  nombreEmprendedor: string
  cedula: string
  nombreEmprendimiento: string
}
