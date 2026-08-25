import { FileText, Store, User, Users } from 'lucide-react'
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
  {
    slug: 'emprendedor-detalle',
    title: 'Reporte por Emprendedor',
    description: 'Ficha completa del emprendedor y sus emprendimientos.',
    icon: User,
    entitySelector: {
      paramName: 'emprendedorId',
      label: 'Emprendedor',
      placeholder: 'Seleccionar emprendedor',
      fetchOptions: async (token) => {
        const emprendedores = await fetchAllEmprendedores(token)
        return emprendedores.map((e) => ({
          value: String(e.id),
          label: `${e.nombres_apellidos} — ${e.cedula}`,
        }))
      },
    },
    fetchRows: async (filters, token) => {
      const emprendedorId = Number(filters.emprendedorId)
      if (!emprendedorId) return []

      const [emprendedor, formulariosRaw] = await Promise.all([
        entrepreneurService.getById(emprendedorId, token),
        fetchAllPages<FormularioReferenciaGeneral>((page, limit) =>
          entrepeneurFormService
            .getAllReferenciaGeneral(page, limit, token, emprendedorId)
            .then((res) => ({
              total: res.total,
              items: res.formularios_referencia_general,
            }))
        ),
      ])

      const formularios = formulariosRaw.filter((f) =>
        isWithinDateRange(f.fecha_registro, filters.desde, filters.hasta)
      )

      const emprendimientos = formularios.filter((f) => f.tiene_emprendimiento)

      // One row per emprendimiento; if none, one row with just emprendedor data
      if (emprendimientos.length === 0) {
        return [
          {
            emprendedor,
            nombre_emprendimiento: 'Sin emprendimientos',
            tiene_emprendimiento: false,
            fecha_registro: emprendedor.fecha_registro,
            emprendedorId,
          },
        ]
      }

      return emprendimientos.map((f) => ({
        ...f,
        emprendedor,
        emprendedorId,
      }))
    },
    summarize: (rows) => {
      const emprendimientos = (rows as { tiene_emprendimiento: boolean }[]).filter(
        (r) => r.tiene_emprendimiento
      ).length
      return [
        { label: 'Total de emprendimientos', value: emprendimientos },
        { label: 'Total de formularios', value: rows.length },
      ]
    },
    columns: [
      {
        header: 'Emprendedor',
        accessor: (row) => (row as { emprendedor: Emprendedor }).emprendedor?.nombres_apellidos ?? '—',
      },
      { header: 'Cédula', accessor: (row) => (row as { emprendedor: Emprendedor }).emprendedor?.cedula ?? '—' },
      {
        header: 'Emprendimiento',
        accessor: (row) => (row as FormularioReferenciaGeneral).nombre_emprendimiento ?? 'Sin nombre',
      },
      {
        header: 'Estado',
        accessor: (row) => {
          const estadoMap: Record<number, string> = { 1: 'Ingresado', 2: 'Pendiente', 3: 'Aprobado', 4: 'Rechazado' }
          return estadoMap[(row as FormularioReferenciaGeneral).id_estado_emprendedor] ?? '—'
        },
      },
      {
        header: 'Fecha de registro',
        accessor: (row) => toLocalDate((row as FormularioReferenciaGeneral).fecha_registro),
      },
    ],
  },
  {
    slug: 'emprendimiento-detalle',
    title: 'Reporte por Emprendimiento',
    description: 'Contexto, estado, fecha y formularios del emprendimiento.',
    icon: FileText,
    entitySelector: {
      paramName: 'formularioId',
      label: 'Emprendimiento',
      placeholder: 'Seleccionar emprendimiento',
      fetchOptions: async (token) => {
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

        const nombreMap = new Map(emprendedores.map((e) => [e.id, e.nombres_apellidos]))

        return formularios
          .filter((f) => f.tiene_emprendimiento)
          .map((f) => ({
            value: String(f.id),
            label: `${f.nombre_emprendimiento ?? 'Sin nombre'} — ${nombreMap.get(f.id_emprendedor) ?? 'Sin emprendedor'}`,
          }))
      },
    },
    fetchRows: async (filters, token) => {
      const formularioId = Number(filters.formularioId)
      if (!formularioId) return []

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

      const nombreMap = new Map(emprendedores.map((e) => [e.id, e.nombres_apellidos]))

      const formulario = formularios.find((f) => f.id === formularioId)
      if (!formulario) return []

      if (!isWithinDateRange(formulario.fecha_registro, filters.desde, filters.hasta)) {
        return []
      }

      // Enrich with emprendedor name and sector context
      const sectorForms = await fetchAllFormularioSectores(token)
      const sectoresDelFormulario = sectorForms.filter(
        (sf) => sf.id_formulario_ref === formularioId
      )

      let sectorLabel = 'Sin sector'
      if (sectoresDelFormulario.length > 0) {
        try {
          const sectoresRes = await api.get<CatalogoResponse>('/catsectoremprendimiento', { token })
          const sectorNames = sectoresDelFormulario
            .map((sf) => sectoresRes.data.find((c) => c.id === sf.id_sector)?.descripcion)
            .filter(Boolean)
          if (sectorNames.length > 0) sectorLabel = sectorNames.join(', ')
        } catch {
          // keep default
        }
      }

      return [
        {
          ...formulario,
          nombre_emprendedor: nombreMap.get(formulario.id_emprendedor) ?? 'Sin especificar',
          sector: sectorLabel,
        },
      ]
    },
    summarize: (rows) => {
      if (rows.length === 0) return [{ label: 'Registros encontrados', value: 0 }]
      const row = rows[0] as FormularioReferenciaGeneral & { sector: string }
      const estadoMap: Record<number, string> = { 1: 'Ingresado', 2: 'Pendiente', 3: 'Aprobado', 4: 'Rechazado' }
      return [
        { label: `Estado: ${estadoMap[row.id_estado_emprendedor] ?? '—'}`, value: 1 },
        { label: `Sector: ${row.sector}`, value: 1 },
      ]
    },
    columns: [
      {
        header: 'Emprendimiento',
        accessor: (row) => (row as FormularioReferenciaGeneral).nombre_emprendimiento ?? 'Sin nombre',
      },
      {
        header: 'Emprendedor',
        accessor: (row) => (row as { nombre_emprendedor: string }).nombre_emprendedor,
      },
      {
        header: 'Contexto (sector)',
        accessor: (row) => (row as { sector: string }).sector,
      },
      {
        header: 'Estado',
        accessor: (row) => {
          const m: Record<number, string> = { 1: 'Ingresado', 2: 'Pendiente', 3: 'Aprobado', 4: 'Rechazado' }
          return m[(row as FormularioReferenciaGeneral).id_estado_emprendedor] ?? '—'
        },
      },
      {
        header: 'Fecha de registro',
        accessor: (row) => toLocalDate((row as FormularioReferenciaGeneral).fecha_registro),
      },
    ],
  },
]

export function getReportDefinition(slug: string) {
  return REPORTS.find((report) => report.slug === slug)
}
