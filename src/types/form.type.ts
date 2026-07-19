// Formulario Referencia General

import { Emprendedor } from './entrepreneur.type'

export interface FormularioReferenciaGeneral {
  id: number
  id_emprendedor: number
  fecha_formulario: string
  id_estado_emprendedor: number
  tiene_emprendimiento: boolean
  esta_en_asociatividad: boolean
  intencion_emprender: boolean | null
  motivo_intencion_emprender: string | null
  intencion_mejorar: boolean | null
  motivo_intencion_mejorar: string | null
  nombre_emprendimiento: string | null
  id_tipo_oferta: number | null
  notas_adicionales: string | null
  firma_solicitante: boolean
  firma_delegado: boolean
  fecha_registro: string
  valor_pago_inicial: number | null
  codigo_pago: string
}

export type FormularioReferenciaGeneralCreateDTO = Omit<
  FormularioReferenciaGeneral,
  | 'id'
  | 'id_estado_emprendedor'
  | 'firma_solicitante'
  | 'firma_delegado'
  | 'fecha_registro'
>

// Formulario Ref Sector

export interface FormularioRefSector {
  id: number
  id_formulario_ref: number
  id_sector: number
  sector_otro: string | null
}

export type FormularioRefSectorCreateDTO = Omit<FormularioRefSector, 'id'>

export interface FormularioRefSectorListResponse {
  ok: boolean
  total: number
  formularios_ref_sector: FormularioRefSector[]
}

// Formulario Ref Infraestructura

export interface FormularioRefInfraestructura {
  id: number
  id_formulario_ref: number
  id_infraestructura: number
  descripcion_otro: string | null
}

export type FormularioRefInfraestructuraCreateDTO = Omit<
  FormularioRefInfraestructura,
  'id'
>

// Formulario Asistencia Técnica

export interface FormularioAsistenciaTecnica {
  id: number
  id_emprendedor: number
  fecha_formulario: string
  nombre_emprendimiento: string | null
  id_situacion: number
  tasa_cancelada: boolean
  firma_solicitante: boolean
  notas: string | null
  fecha_registro: string
}

export type FormularioAsistenciaTecnicaCreateDTO = Omit<
  FormularioAsistenciaTecnica,
  'id' | 'tasa_cancelada' | 'firma_solicitante' | 'fecha_registro'
>

// Formulario Asist Requerimiento

export interface FormularioAsistRequerimiento {
  id: number
  id_formulario_asist: number
  id_tema: number
  requerimiento: string | null
}

export type FormularioAsistRequerimientoCreateDTO = Omit<
  FormularioAsistRequerimiento,
  'id'
>

// Respuestas del Backend

export interface EmprendedoresResponse {
  ok: boolean
  total: number
  emprendedores: Emprendedor[]
}
export interface EmprendedorResponse {
  ok: boolean
  emprendedor: Emprendedor
}

export interface FormularioReferenciaGeneralResponse {
  ok: boolean
  total: number
  formularios_referencia_general: FormularioReferenciaGeneral[]
}
export interface FormularioReferenciaGeneralCreateResponse {
  ok: boolean
  formulario_referencia_general: FormularioReferenciaGeneral
}

export interface FormularioAsistenciaTecnicaResponse {
  ok: boolean
  data: FormularioAsistenciaTecnica
}

export interface FormularioReferenciaGeneralListResponse {
  ok: boolean
  total: number
  formularios_referencia_general: FormularioReferenciaGeneral[]
}
