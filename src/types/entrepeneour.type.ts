export interface Emprendedor {
  id: number
  nombres_apellidos: string
  cedula: string
  email: string
  celular: string
  nacionalidad: string
  fecha_nacimiento: string
  edad: number
  id_rango_edad: number
  ciudad: string
  parroquia: string
  barrio_comunidad: string
  calle_numero: string
  calle_secundaria: string
  id_estado_civil: number
  tiene_discapacidad: boolean
  id_tipo_discapacidad: number | null
  porcentaje_discapacidad: string | null
  numero_carnet_discapacidad: string | null
  cantidad_cargas_familiares: number
  cargas_con_discapacidad: number
  id_genero: number
  id_etnia: number
  etnia_otra: string | null
  id_nivel_estudios: number
  titulo_profesional: string | null
  id_ocupacion: number
  ocupacion_otra: string | null
  id_nivel_ingresos: number
  fecha_registro: string
  activo: boolean
}

// DTO para creación, sin campos que genera el backend
export type EmprendedorCreateDTO = Omit<
  Emprendedor,
  'id' | 'fecha_registro' | 'activo'
>
