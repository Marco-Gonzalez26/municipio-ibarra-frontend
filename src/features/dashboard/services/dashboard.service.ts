import {
  BriefcaseBusiness,
  ClipboardClock,
  GraduationCap,
  Store,
  Users,
} from 'lucide-react'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { userService } from '@/features/usuarios/services/user.service'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'
import type {
  AsistenciaTecnicaResponse,
  CatalogResponse,
  ChartItem,
  DashboardData,
  FormularioSectorResponse,
} from '@/features/dashboard/types/dashboard.type'
import {
  buildAgeChart,
  buildGenderChart,
  buildParishChart,
  buildSectorChart,
  formatUpdatedAt,
} from '@/features/dashboard/utils/dashboard.utils'

const LIMIT = 100

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error('La variable NEXT_PUBLIC_API_BASE_URL no está configurada.')
  }

  return apiBaseUrl.replace(/\/$/, '')
}

async function requestJson<T>(path: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`)
  }

  return (await response.json()) as T
}

async function getAsistenciasTecnicas(): Promise<AsistenciaTecnicaResponse> {
  const result = await requestJson<AsistenciaTecnicaResponse>(
    '/formularioasistenciatecnica',
    'Error al consultar asistencias técnicas'
  )

  if (!result.ok || !Array.isArray(result.data)) {
    throw new Error('La respuesta de asistencias técnicas no es válida.')
  }

  return result
}

async function getGeneros(): Promise<CatalogResponse> {
  const result = await requestJson<CatalogResponse>(
    '/catgenero',
    'Error al consultar géneros'
  )

  if (!Array.isArray(result.data)) {
    throw new Error('La respuesta del catálogo de géneros no es válida.')
  }

  return result
}

async function getSectores(): Promise<CatalogResponse> {
  const result = await requestJson<CatalogResponse>(
    '/catsectoremprendimiento',
    'Error al consultar sectores'
  )

  if (!Array.isArray(result.data)) {
    throw new Error('La respuesta del catálogo de sectores no es válida.')
  }

  return result
}

async function getFormulariosSector(): Promise<FormularioSectorResponse> {
  const result = await requestJson<FormularioSectorResponse>(
    '/formulariorefsector',
    'Error al consultar formularios de sector'
  )

  if (!result.ok || !Array.isArray(result.formularios_ref_sector)) {
    throw new Error('La respuesta de formularios de sector no es válida.')
  }

  return result
}

export async function getDashboardData(): Promise<DashboardData> {
  let emprendedores: Emprendedor[] = []
  let formularios: FormularioReferenciaGeneral[] = []

  let totalUsuarios = 0
  let totalEmprendedores = 0
  let hasApiError = false

  let sectores: ChartItem[] = []
  let generos: ChartItem[] = []
  let edades: ChartItem[] = []
  let parroquias: ChartItem[] = []

  let totalAsesoriasTecnicas = 0

  try {
    const [
      entrepreneursRes,
      formsRes,
      usersRes,
      assistanceRes,
      gendersRes,
      sectorsRes,
      sectorFormsRes,
    ] = await Promise.all([
      entrepreneurService.getAll(1, LIMIT),
      entrepeneurFormService.getAllReferenciaGeneral(1, LIMIT),
      userService.getAll(1, LIMIT),
      getAsistenciasTecnicas(),
      getGeneros(),
      getSectores(),
      getFormulariosSector(),
    ])

    emprendedores = entrepreneursRes.emprendedores
    formularios = formsRes.formularios_referencia_general

    totalUsuarios = usersRes.total

    totalEmprendedores =
      entrepreneursRes.total > 0
        ? entrepreneursRes.total
        : entrepreneursRes.emprendedores.length

    totalAsesoriasTecnicas = assistanceRes.data.length

    sectores = buildSectorChart(
      sectorFormsRes.formularios_ref_sector,
      sectorsRes.data
    )

    generos = buildGenderChart(emprendedores, gendersRes.data)

    edades = buildAgeChart(emprendedores)

    parroquias = buildParishChart(emprendedores)
  } catch (error) {
    console.error('Error al cargar el dashboard:', error)

    hasApiError = true
  }

  const emprendedoresActivos = emprendedores.filter(
    (emprendedor) => emprendedor.activo === true
  ).length

  const solicitudesPendientes = formularios.filter(
    (formulario) => formulario.id_estado_emprendedor === 2
  ).length

  const emprendedoresConEmprendimiento = formularios.filter(
    (formulario) => formulario.tiene_emprendimiento === true
  ).length

  return {
    hasApiError,

    totalUsuarios: hasApiError ? 0 : totalUsuarios,

    updatedAt: formatUpdatedAt(new Date()),

    cards: [
      {
        title: 'Total emprendedores',
        value: hasApiError ? 0 : totalEmprendedores,
        description: 'Personas registradas',
        icon: Users,
        tone: 'blue',
      },
      {
        title: 'Emprendedores activos',
        value: hasApiError ? 0 : emprendedoresActivos,
        description: 'Registros habilitados',
        icon: BriefcaseBusiness,
        tone: 'green',
      },
      {
        title: 'Asesorías técnicas',
        value: hasApiError ? 0 : totalAsesoriasTecnicas,
        description: 'Asistencias registradas',
        icon: GraduationCap,
        tone: 'violet',
      },
      {
        title: 'Solicitudes pendientes',
        value: hasApiError ? 0 : solicitudesPendientes,
        description: 'En revisión por el supervisor',
        icon: ClipboardClock,
        tone: 'amber',
      },
      {
        title: 'Con emprendimiento',
        value: hasApiError ? 0 : emprendedoresConEmprendimiento,
        description: 'Formularios con emprendimiento',
        icon: Store,
        tone: 'rose',
      },
    ],

    sectores,
    generos,
    edades,
    parroquias,
  }
}
