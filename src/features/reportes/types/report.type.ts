import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ReportFilters {
  desde?: string
  hasta?: string
}

export interface ReportSummaryItem {
  label: string
  value: number
}

export interface ReportBreakdown {
  title: string
  items: ReportSummaryItem[]
}

export interface ReportColumn {
  header: string
  accessor: (row: unknown) => string
}

export interface ReportDefinition {
  slug: string
  title: string
  description: string
  icon: LucideIcon | ComponentType
  fetchRows: (filters: ReportFilters, token: string) => Promise<unknown[]>
  summarize: (rows: unknown[]) => ReportSummaryItem[]
  // Desgloses por categoría (ej. por género, por sector). Reciben el token
  // porque suelen necesitar catálogos adicionales del backend.
  breakdowns?: (rows: unknown[], token: string) => Promise<ReportBreakdown[]>
  // Columnas de la tabla detallada. Si no se define, el PDF omite esa sección.
  columns?: ReportColumn[]
}

export interface ReportDetail {
  columns: string[]
  rows: string[][]
}

export interface ReportPayload {
  title: string
  description: string
  filters: ReportFilters
  summary: ReportSummaryItem[]
  breakdowns: ReportBreakdown[]
  detail?: ReportDetail
  generatedAt: Date
}
