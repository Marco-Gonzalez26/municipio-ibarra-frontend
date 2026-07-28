import type { ComponentType } from 'react'

export interface ChartItem {
  label: string
  value: number
}

export interface AsistenciaTecnica {
  id: number
  id_emprendedor: number
  fecha_formulario: string
  nombre_emprendimiento: string | null
  id_situacion: number
  tasa_cancelada: number
  firma_solicitante: number
  notas: string | null
  fecha_registro: string
  usuario_registro: number | string | null
}

export interface AsistenciaTecnicaResponse {
  ok: boolean
  data: AsistenciaTecnica[]
}

export interface CatalogItem {
  id: number
  descripcion: string
  activo: boolean | number
}

export interface CatalogResponse {
  total: number
  data: CatalogItem[]
}

export interface FormularioSector {
  id: number
  id_formulario_ref: number
  id_sector: number
  sector_otro: string | null
}

export interface FormularioSectorResponse {
  ok: boolean
  total: number
  formularios_ref_sector: FormularioSector[]
}

export type DashboardTone = 'blue' | 'green' | 'violet' | 'amber' | 'rose'

export interface DashboardIconProps {
  className?: string
  'aria-hidden'?: boolean
}

export interface DashboardCardData {
  title: string
  value: number
  description: string
  tone: DashboardTone
  icon: ComponentType<DashboardIconProps>
}

export interface DashboardData {
  hasApiError: boolean
  totalUsuarios: number
  updatedAt: string
  cards: DashboardCardData[]
  sectores: ChartItem[]
  generos: ChartItem[]
  edades: ChartItem[]
  parroquias: ChartItem[]
}
