import { Store, Users } from 'lucide-react'
import { api } from '@/lib/https'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import {
  buildAgeChart,
  buildGenderChart,
  buildParishChart,
  buildSectorChart,
} from '@/features/dashboard/utils/dashboard.utils'
import { fetchAllPages } from '@/lib/pagination'
import { isWithinDateRange, toLocalDate } from '@/lib/date'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type {
  FormularioReferenciaGeneral,
  FormularioRefSector,
  FormularioRefSectorListResponse,
} from '@/types/form.type'
import type { CatalogoResponse } from '@/types/catalog.type'
import type { ReportDefinition } from '@/features/reportes/types/report.type'

type FormularioEmprendimiento = FormularioReferenciaGeneral & {
  nombre_emprendedor: string
}

async function fetchAllEmprendedores(token: string) {
  return fetchAllPages<Emprendedor>((page, limit) =>
    entrepreneurService
      .getAll(page, limit, token)
      .then((res) => ({ total: res.total, items: res.emprendedores }))
  )
}

async function fetchAllFormularioSectores(token: string) {
  return fetchAllPages<FormularioRefSector>((page, limit) =>
    api
      .get<FormularioRefSectorListResponse>(
        `/formulariorefsector?limit=${limit}&page=${page}`,
        { token }
      )
      .then((res) => ({ total: res.total, items: res.formularios_ref_sector }))
  )
}

// Registro de reportes disponibles. Un reporte nuevo es un objeto más en
// este arreglo: reutiliza fetchAllPages, isWithinDateRange y la plantilla
// PDF compartida, sin necesidad de página, ruta ni layout propios.
export const REPORTS: ReportDefinition[] = [
  {
    slug: 'emprendedores',
    title: 'Reporte de Emprendedores',
    description: 'Cantidad de emprendedores registrados en un rango de fechas.',
    icon: Users,
    fetchRows: async (filters, token) => {
      const rows = await fetchAllEmprendedores(token)

      return rows.filter((emprendedor) =>
        isWithinDateRange(emprendedor.fecha_registro, filters.desde, filters.hasta)
      )
    },
    summarize: (rows) => [
      { label: 'Total de emprendedores registrados', value: rows.length },
    ],
    breakdowns: async (rows, token) => {
      const emprendedores = rows as Emprendedor[]
      const generosRes = await api.get<CatalogoResponse>('/catgenero', { token })

      return [
        { title: 'Por género', items: buildGenderChart(emprendedores, generosRes.data) },
        { title: 'Por rango de edad', items: buildAgeChart(emprendedores) },
        { title: 'Por parroquia', items: buildParishChart(emprendedores) },
      ]
    },
    columns: [
      {
        header: 'Nombre',
        accessor: (row) => (row as Emprendedor).nombres_apellidos,
      },
      { header: 'Cédula', accessor: (row) => (row as Emprendedor).cedula },
      {
        header: 'Parroquia',
        accessor: (row) => (row as Emprendedor).parroquia || 'Sin especificar',
      },
      {
        header: 'Fecha de registro',
        accessor: (row) => toLocalDate((row as Emprendedor).fecha_registro),
      },
    ],
  },
  {
    slug: 'emprendimientos',
    title: 'Reporte de Emprendimientos',
    description: 'Cantidad de emprendimientos registrados en un rango de fechas.',
    icon: Store,
    fetchRows: async (filters, token) => {
      const [formularios, emprendedores] = await Promise.all([
        fetchAllPages<FormularioReferenciaGeneral>((page, limit) =>
          entrepeneurFormService
            .getAllReferenciaGeneral(page, limit, token)
            .then((res) => ({
              total: res.total,
              items: res.formularios_referencia_general,
            }))
        ),
        fetchAllEmprendedores(token),
      ])

      const nombreMap = new Map(
        emprendedores.map((emprendedor) => [
          emprendedor.id,
          emprendedor.nombres_apellidos,
        ])
      )

      return formularios
        .filter(
          (formulario) =>
            formulario.tiene_emprendimiento &&
            isWithinDateRange(
              formulario.fecha_registro,
              filters.desde,
              filters.hasta
            )
        )
        .map((formulario) => ({
          ...formulario,
          nombre_emprendedor:
            nombreMap.get(formulario.id_emprendedor) ?? 'Sin especificar',
        }))
    },
    summarize: (rows) => [
      { label: 'Total de emprendimientos registrados', value: rows.length },
    ],
    breakdowns: async (rows, token) => {
      const formularios = rows as FormularioEmprendimiento[]
      const formularioIds = new Set(formularios.map((formulario) => formulario.id))

      const [sectorFormsRaw, sectoresRes] = await Promise.all([
        fetchAllFormularioSectores(token),
        api.get<CatalogoResponse>('/catsectoremprendimiento', { token }),
      ])

      const sectorForms = sectorFormsRaw.filter((sectorForm) =>
        formularioIds.has(sectorForm.id_formulario_ref)
      )

      return [
        { title: 'Por sector', items: buildSectorChart(sectorForms, sectoresRes.data) },
      ]
    },
    columns: [
      {
        header: 'Nombre del emprendimiento',
        accessor: (row) =>
          (row as FormularioEmprendimiento).nombre_emprendimiento || 'Sin nombre',
      },
      {
        header: 'Emprendedor',
        accessor: (row) => (row as FormularioEmprendimiento).nombre_emprendedor,
      },
      {
        header: 'Fecha de registro',
        accessor: (row) =>
          toLocalDate((row as FormularioEmprendimiento).fecha_registro),
      },
    ],
  },
]

export function getReportDefinition(slug: string) {
  return REPORTS.find((report) => report.slug === slug)
}
