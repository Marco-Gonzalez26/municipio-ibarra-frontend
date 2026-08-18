import { getReportDefinition } from '@/features/reportes/config/reports.config'
import type {
  ReportFilters,
  ReportPayload,
} from '@/features/reportes/types/report.type'

export class ReportNotFoundError extends Error {}

export async function buildReportPayload(
  slug: string,
  filters: ReportFilters,
  token: string
): Promise<ReportPayload> {
  const report = getReportDefinition(slug)

  if (!report) {
    throw new ReportNotFoundError(`No existe el reporte "${slug}".`)
  }

  const rows = await report.fetchRows(filters, token)

  const breakdowns = report.breakdowns
    ? await report.breakdowns(rows, token)
    : []

  const detail = report.columns
    ? {
        columns: report.columns.map((column) => column.header),
        rows: rows.map((row) =>
          report.columns!.map((column) => column.accessor(row))
        ),
      }
    : undefined

  return {
    title: report.title,
    description: report.description,
    filters,
    summary: report.summarize(rows),
    breakdowns,
    detail,
    generatedAt: new Date(),
  }
}
