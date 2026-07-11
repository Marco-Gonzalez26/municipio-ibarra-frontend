import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardClock,
  GraduationCap,
  MapPin,
  RefreshCw,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { ComponentType, ReactNode } from 'react'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { userService } from '@/features/usuarios/services/user.service'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'

const LIMIT = 100

interface ChartItem {
  label: string
  value: number
}

interface AsistenciaTecnica {
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

interface AsistenciaTecnicaResponse {
  ok: boolean
  data: AsistenciaTecnica[]
}

interface CatalogItem {
  id: number
  descripcion: string
  activo: boolean | number
}

interface CatalogResponse {
  total: number
  data: CatalogItem[]
}

interface FormularioSector {
  id: number
  id_formulario_ref: number
  id_sector: number
  sector_otro: string | null
}

interface FormularioSectorResponse {
  ok: boolean
  total: number
  formularios_ref_sector: FormularioSector[]
}

type DashboardTone = 'blue' | 'green' | 'violet' | 'amber' | 'rose'

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error('La variable NEXT_PUBLIC_API_BASE_URL no está configurada.')
  }

  return apiBaseUrl.replace(/\/$/, '')
}

async function getAsistenciasTecnicas(): Promise<AsistenciaTecnicaResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/formularioasistenciatecnica`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(
      `Error al consultar asistencias técnicas: ${response.status}`
    )
  }

  const result = (await response.json()) as AsistenciaTecnicaResponse

  if (!result.ok || !Array.isArray(result.data)) {
    throw new Error('La respuesta de asistencias técnicas no es válida.')
  }

  return result
}

async function getGeneros(): Promise<CatalogResponse> {
  const response = await fetch(`${getApiBaseUrl()}/catgenero`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Error al consultar géneros: ${response.status}`)
  }

  const result = (await response.json()) as CatalogResponse

  if (!Array.isArray(result.data)) {
    throw new Error('La respuesta del catálogo de géneros no es válida.')
  }

  return result
}

async function getSectores(): Promise<CatalogResponse> {
  const response = await fetch(`${getApiBaseUrl()}/catsectoremprendimiento`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Error al consultar sectores: ${response.status}`)
  }

  const result = (await response.json()) as CatalogResponse

  if (!Array.isArray(result.data)) {
    throw new Error('La respuesta del catálogo de sectores no es válida.')
  }

  return result
}

async function getFormulariosSector(): Promise<FormularioSectorResponse> {
  const response = await fetch(`${getApiBaseUrl()}/formulariorefsector`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Error al consultar formularios de sector: ${response.status}`
    )
  }

  const result = (await response.json()) as FormularioSectorResponse

  if (!result.ok || !Array.isArray(result.formularios_ref_sector)) {
    throw new Error('La respuesta de formularios de sector no es válida.')
  }

  return result
}

function getAgeRange(age: number) {
  if (age >= 18 && age <= 28) return '18-28'
  if (age >= 29 && age <= 40) return '29-40'
  if (age >= 41 && age <= 50) return '41-50'
  if (age >= 51) return '51 o más'

  return 'Sin especificar'
}

function normalizeParishName(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase()

  const knownNames: Record<string, string> = {
    'rio verde': 'Río Verde',
    chiguilpe: 'Chiguilpe',
    daule: 'Daule',
    tarqui: 'Tarqui',
    priorato: 'Priorato',
    alpachaca: 'Alpachaca',
    caranqui: 'Caranqui',
    'san francisco': 'San Francisco',
    'el sagrario': 'El Sagrario',
  }

  if (knownNames[normalized]) {
    return knownNames[normalized]
  }

  return normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Guayaquil',
  }).format(date)
}

export default async function HomeDashboardPage() {
  let emprendedores: Emprendedor[] = []
  let formularios: FormularioReferenciaGeneral[] = []
  let asistenciasTecnicas: AsistenciaTecnica[] = []
  let generosCatalogo: CatalogItem[] = []
  let sectoresCatalogo: CatalogItem[] = []
  let formulariosSector: FormularioSector[] = []

  let totalUsuarios = 0
  let totalEmprendedores = 0
  let hasApiError = false

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
    asistenciasTecnicas = assistanceRes.data
    generosCatalogo = gendersRes.data
    sectoresCatalogo = sectorsRes.data
    formulariosSector = sectorFormsRes.formularios_ref_sector

    totalUsuarios = usersRes.total
    totalEmprendedores =
      entrepreneursRes.total > 0
        ? entrepreneursRes.total
        : entrepreneursRes.emprendedores.length
  } catch (error) {
    console.error('Error al cargar el dashboard:', error)
    hasApiError = true
  }

  const emprendedoresActivos = emprendedores.filter(
    (emprendedor) => emprendedor.activo === true
  ).length

  const emprendedoresConEmprendimiento = formularios.filter(
    (formulario) => formulario.tiene_emprendimiento === true
  ).length

  const solicitudesPendientes = formularios.filter(
    (formulario) => formulario.id_estado_emprendedor === 2
  ).length

  const totalAsesoriasTecnicas = asistenciasTecnicas.length

  const genderMap = new Map(
    generosCatalogo.map((genero) => [genero.id, genero.descripcion])
  )

  const generosReales: ChartItem[] = Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const genero = genderMap.get(emprendedor.id_genero) ?? 'Sin especificar'

      accumulator[genero] = (accumulator[genero] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value)

  const ageOrder = ['18-28', '29-40', '41-50', '51 o más', 'Sin especificar']

  const edadesReales: ChartItem[] = Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const edad = Number(emprendedor.edad)
      const rango = Number.isFinite(edad)
        ? getAgeRange(edad)
        : 'Sin especificar'

      accumulator[rango] = (accumulator[rango] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort(
      (first, second) =>
        ageOrder.indexOf(first.label) - ageOrder.indexOf(second.label)
    )

  const sectorMap = new Map(
    sectoresCatalogo.map((sector) => [sector.id, sector.descripcion])
  )

  const sectoresReales: ChartItem[] = Object.entries(
    formulariosSector.reduce<Record<string, number>>(
      (accumulator, formulario) => {
        const sector =
          formulario.id_sector === 19 && formulario.sector_otro?.trim()
            ? formulario.sector_otro.trim()
            : (sectorMap.get(formulario.id_sector) ?? 'Sin especificar')

        accumulator[sector] = (accumulator[sector] ?? 0) + 1

        return accumulator
      },
      {}
    )
  )
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)

  const parroquiasReales: ChartItem[] = Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const rawParish = emprendedor.parroquia?.trim()
      const parroquia = rawParish
        ? normalizeParishName(rawParish)
        : 'Sin especificar'

      accumulator[parroquia] = (accumulator[parroquia] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)

  const displayedTotalEntrepreneurs = hasApiError ? 0 : totalEmprendedores
  const displayedActiveEntrepreneurs = hasApiError ? 0 : emprendedoresActivos
  const displayedTechnicalAssistances = hasApiError ? 0 : totalAsesoriasTecnicas
  const displayedPendingRequests = hasApiError ? 0 : solicitudesPendientes
  const displayedEntrepreneursWithBusiness = hasApiError
    ? 0
    : emprendedoresConEmprendimiento

  const updatedAt = formatUpdatedAt(new Date())

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            Panel de Administración
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Sistema de Gestión de Emprendedores
          </p>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col gap-5 overflow-hidden bg-muted/20 p-4 md:p-6 lg:p-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/5 to-transparent"
          aria-hidden="true"
        />

        <section className="relative overflow-hidden rounded-2xl border bg-card px-5 py-5 shadow-sm md:px-6 md:py-5">
          <div
            className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                <span>Resumen administrativo</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Dashboard de gestión
              </h1>

              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Consulta los indicadores principales y la distribución general
                de los emprendedores registrados.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" aria-hidden="true" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Usuarios del sistema
                  </p>

                  <p className="text-lg font-bold">
                    {(hasApiError ? 0 : totalUsuarios).toLocaleString('es-EC')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <RefreshCw
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Última actualización
                  </p>

                  <p className="max-w-56 text-xs font-medium leading-5">
                    {updatedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {hasApiError ? (
          <Card className="relative overflow-hidden border-amber-200 bg-amber-50/80 text-amber-950 shadow-sm">
            <div
              className="absolute inset-y-0 left-0 w-1 bg-amber-500"
              aria-hidden="true"
            />

            <CardHeader className="flex flex-row items-start gap-3 space-y-0 pl-6">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <AlertCircle
                  className="size-5 text-amber-700"
                  aria-hidden="true"
                />
              </div>

              <div>
                <CardTitle className="text-sm">Backend no disponible</CardTitle>

                <CardDescription className="mt-1 text-amber-800">
                  No fue posible obtener la información del dashboard. Revisa el
                  backend y la configuración de NEXT_PUBLIC_API_BASE_URL.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          aria-label="Indicadores generales"
        >
          <DashboardCard
            title="Total emprendedores"
            value={displayedTotalEntrepreneurs}
            description="Personas registradas"
            icon={Users}
            tone="blue"
          />

          <DashboardCard
            title="Emprendedores activos"
            value={displayedActiveEntrepreneurs}
            description="Registros habilitados"
            icon={BriefcaseBusiness}
            tone="green"
          />

          <DashboardCard
            title="Asesorías técnicas"
            value={displayedTechnicalAssistances}
            description="Asistencias registradas"
            icon={GraduationCap}
            tone="violet"
          />

          <DashboardCard
            title="Solicitudes pendientes"
            value={displayedPendingRequests}
            description="En revisión por el supervisor"
            icon={ClipboardClock}
            tone="amber"
          />

          <DashboardCard
            title="Con emprendimiento"
            value={displayedEntrepreneursWithBusiness}
            description="Formularios con emprendimiento"
            icon={Store}
            tone="rose"
          />
        </section>

        <section
          className="grid gap-5 lg:grid-cols-2"
          aria-label="Gráficas estadísticas"
        >
          <ChartCard
            title="Emprendedores por sector"
            description="Cinco sectores con mayor número de registros"
            icon={Store}
          >
            <VerticalBarChart data={sectoresReales} />
          </ChartCard>

          <ChartCard
            title="Distribución por género"
            description="Emprendedores registrados por género"
            icon={Users}
          >
            <PieChart data={generosReales} />
          </ChartCard>

          <ChartCard
            title="Distribución por edad"
            description="Emprendedores agrupados por rango de edad"
            icon={CalendarDays}
          >
            <VerticalBarChart data={edadesReales} />
          </ChartCard>

          <ChartCard
            title="Emprendedores por parroquia"
            description="Cinco parroquias con mayor número de registros"
            icon={MapPin}
          >
            <VerticalBarChart data={parroquiasReales} />
          </ChartCard>
        </section>

        <section className="rounded-xl border border-dashed bg-card/70 px-4 py-3 shadow-sm">
          <p className="text-sm leading-6 text-muted-foreground">
            Información actualizada desde los módulos de emprendedores,
            formularios, sectores, catálogos y asistencias técnicas.
          </p>
        </section>
      </main>
    </>
  )
}

interface DashboardCardProps {
  title: string
  value: number
  description: string
  tone: DashboardTone
  icon: ComponentType<{
    className?: string
    'aria-hidden'?: boolean
  }>
}

const dashboardToneStyles: Record<
  DashboardTone,
  {
    accent: string
    iconContainer: string
    icon: string
    value: string
  }
> = {
  blue: {
    accent: 'bg-blue-500',
    iconContainer: 'border-blue-100 bg-blue-50',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    accent: 'bg-emerald-500',
    iconContainer: 'border-emerald-100 bg-emerald-50',
    icon: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  violet: {
    accent: 'bg-violet-500',
    iconContainer: 'border-violet-100 bg-violet-50',
    icon: 'text-violet-600',
    value: 'text-violet-700',
  },
  amber: {
    accent: 'bg-amber-500',
    iconContainer: 'border-amber-100 bg-amber-50',
    icon: 'text-amber-600',
    value: 'text-amber-700',
  },
  rose: {
    accent: 'bg-rose-500',
    iconContainer: 'border-rose-100 bg-rose-50',
    icon: 'text-rose-600',
    value: 'text-rose-700',
  },
}

function DashboardCard({
  title,
  value,
  description,
  tone,
  icon: Icon,
}: DashboardCardProps) {
  const toneStyles = dashboardToneStyles[tone]

  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${toneStyles.accent}`}
        aria-hidden="true"
      />

      <CardContent className="flex min-h-36 items-center gap-4 p-5">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${toneStyles.iconContainer}`}
        >
          <Icon className={`size-5 ${toneStyles.icon}`} aria-hidden={true} />
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-tight text-muted-foreground">{title}</p>

          <p
            className={`mt-1.5 text-3xl font-bold tracking-tight ${toneStyles.value}`}
          >
            {value.toLocaleString('es-EC')}
          </p>

          <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChartCardProps {
  title: string
  description: string
  icon: ComponentType<{
    className?: string
    'aria-hidden'?: boolean
  }>
  children: ReactNode
}

function ChartCard({
  title,
  description,
  icon: Icon,
  children,
}: ChartCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/10 transition-transform duration-200 group-hover:scale-105">
            <Icon className="size-4 text-primary" aria-hidden={true} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}

function VerticalBarChart({ data }: { data: ChartItem[] }) {
  if (data.length === 0) {
    return <EmptyChart />
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="relative flex min-h-72 items-end justify-between gap-2 pt-5">
      {data.map((item) => {
        const heightPercentage = (item.value / maxValue) * 100

        return (
          <div
            key={item.label}
            className="group/bar relative z-10 flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="rounded-md bg-background px-2 py-0.5 text-xs font-semibold shadow-sm ring-1 ring-border transition-colors group-hover/bar:text-primary">
              {item.value}
            </span>

            <div className="relative flex h-52 w-full items-end justify-center overflow-hidden rounded-lg border bg-muted/20 px-2">
              <div
                className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-primary to-primary/70 transition-all duration-500 group-hover/bar:brightness-110"
                style={{
                  height: `${Math.max(
                    heightPercentage,
                    item.value > 0 ? 8 : 0
                  )}%`,
                }}
                role="img"
                aria-label={`${item.label}: ${item.value}`}
              />
            </div>

            <span
              className="min-h-8 max-w-full text-center text-xs leading-tight text-muted-foreground"
              title={item.label}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PieChart({ data }: { data: ChartItem[] }) {
  const visibleData = data.filter((item) => item.value > 0)

  const total = visibleData.reduce(
    (accumulator, item) => accumulator + item.value,
    0
  )

  if (total === 0) {
    return <EmptyChart />
  }

  const palette = [
    'var(--primary)',
    'var(--muted-foreground)',
    'var(--accent-foreground)',
    'var(--secondary-foreground)',
  ]

  const { segments: gradientSegments } = visibleData.reduce<{
    accumulated: number
    segments: string[]
  }>(
    (result, item, index) => {
      const percentage = (item.value / total) * 100
      const start = result.accumulated
      const end = start + percentage

      return {
        accumulated: end,
        segments: [
          ...result.segments,
          `${palette[index % palette.length]} ${start}% ${end}%`,
        ],
      }
    },
    {
      accumulated: 0,
      segments: [],
    }
  )

  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-6">
      <div className="relative">
        <div
          className="size-48 rounded-full shadow-sm ring-1 ring-border"
          style={{
            background: `conic-gradient(${gradientSegments.join(', ')})`,
          }}
          role="img"
          aria-label="Distribución de emprendedores por género"
        />

        <div className="absolute inset-0 m-auto flex size-28 flex-col items-center justify-center rounded-full border bg-card shadow-sm">
          <span className="text-3xl font-bold tracking-tight">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {visibleData.map((item, index) => {
          const percentage = Math.round((item.value / total) * 100)

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: palette[index % palette.length],
                  }}
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </div>

              <span className="font-semibold">
                {item.value} ({percentage}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed bg-muted/20">
      <p className="text-sm text-muted-foreground">
        No existen datos para mostrar.
      </p>
    </div>
  )
}
