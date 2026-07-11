import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardClock,
  GraduationCap,
  MapPin,
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

/*
 * Datos temporales
 * TODO: Reemplazar cuando el backend devuelva sector, género,
 * edad y total de asesorías.
 */
const temporaryDashboardData = {
  asesoriasSolicitadas: 20,

  sectors: [
    { label: 'Comercio', value: 6 },
    { label: 'Alimentos', value: 5 },
    { label: 'Servicios', value: 4 },
    { label: 'Tecnología', value: 2 },
    { label: 'Belleza', value: 1 },
  ],

  genders: [
    { label: 'Femenino', value: 11 },
    { label: 'Masculino', value: 7 },
  ],

  ages: [
    { label: '18-28', value: 4 },
    { label: '29-40', value: 7 },
    { label: '41-50', value: 5 },
    { label: '51 o más', value: 2 },
  ],

  parishesFallback: [
    { label: 'San Francisco', value: 5 },
    { label: 'El Sagrario', value: 4 },
    { label: 'Caranqui', value: 4 },
    { label: 'Alpachaca', value: 3 },
    { label: 'Priorato', value: 2 },
  ],
}

export default async function HomeDashboardPage() {
  let emprendedores: Emprendedor[] = []
  let formularios: FormularioReferenciaGeneral[] = []
  let totalUsuarios = 0
  let totalEmprendedores = 0
  let hasApiError = false

  try {
    // Datos reales del backend para el resumen.
    const [entrepreneursRes, formsRes, usersRes] = await Promise.all([
      entrepreneurService.getAll(1, LIMIT),
      entrepeneurFormService.getAllReferenciaGeneral(1, LIMIT),
      userService.getAll(1, LIMIT),
    ])

    emprendedores = entrepreneursRes.emprendedores
    formularios = formsRes.formularios_referencia_general
    totalUsuarios = usersRes.total
    totalEmprendedores = entrepreneursRes.total
  } catch (error) {
    console.error(error)
    hasApiError = true
  }

  const totalEmprendimientos = formularios.filter(
    (formulario) => formulario.tiene_emprendimiento
  ).length

  const pendientes = formularios.filter(
    (formulario) => formulario.id_estado_emprendedor === 2
  ).length

  const haceSieteDias = new Date()
  haceSieteDias.setHours(0, 0, 0, 0)
  haceSieteDias.setDate(haceSieteDias.getDate() - 7)

  const nuevosUltimosSieteDias = emprendedores.filter((emprendedor) => {
    const fechaRegistro = new Date(emprendedor.fecha_registro)

    return (
      !Number.isNaN(fechaRegistro.getTime()) && fechaRegistro >= haceSieteDias
    )
  }).length

  const parroquiasReales: ChartItem[] = Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const parroquia = emprendedor.parroquia?.trim() || 'Sin especificar'

      accumulator[parroquia] = (accumulator[parroquia] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)

  //  Si el backend no responde o no existen parroquias, se muestran datos temporales para visualizar el diseño.

  const parishes =
    parroquiasReales.length > 0
      ? parroquiasReales
      : temporaryDashboardData.parishesFallback

  // valores de respaldo para visualizar el dashboard

  const displayedTotalEntrepreneurs = hasApiError ? 18 : totalEmprendedores

  const displayedNewEntrepreneurs = hasApiError ? 5 : nuevosUltimosSieteDias

  const displayedActiveEnterprises = hasApiError ? 7 : totalEmprendimientos

  const displayedPendingRequests = hasApiError ? 2 : pendientes

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <div>
          <p className="text-sm font-semibold">Panel de Administración</p>

          <p className="text-xs text-muted-foreground">
            Sistema de Gestión de Emprendedores
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-6">
        <section className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard de gestión
          </h1>

          <p className="text-sm text-muted-foreground md:text-base">
            Resumen general del sistema de emprendedores.
          </p>
        </section>

        {hasApiError ? (
          <Card className="border-yellow-200 bg-yellow-50 text-yellow-900">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />

              <div>
                <CardTitle className="text-sm">Backend no disponible</CardTitle>

                <CardDescription className="text-yellow-800">
                  Se muestran valores temporales para visualizar el dashboard.
                  Revisa la configuración de NEXT_PUBLIC_API_BASE_URL.
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
            description="Ciudadanos registrados"
            icon={Users}
          />

          <DashboardCard
            title="Nuevos (7 días)"
            value={displayedNewEntrepreneurs}
            description="Registros recientes"
            icon={CalendarDays}
          />

          <DashboardCard
            title="Emprendimientos activos"
            value={displayedActiveEnterprises}
            description="Formularios con emprendimiento"
            icon={BriefcaseBusiness}
          />

          <DashboardCard
            title="Solicitudes pendientes"
            value={displayedPendingRequests}
            description="Pendientes de revisión"
            icon={ClipboardClock}
          />

          <DashboardCard
            title="Asesorías solicitadas"
            value={temporaryDashboardData.asesoriasSolicitadas}
            description="Solicitudes registradas"
            icon={GraduationCap}
          />
        </section>

        <section
          className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4"
          aria-label="Gráficas estadísticas"
        >
          <ChartCard
            title="Emprendedores por sector"
            description="Distribución por actividad económica"
            icon={Store}
          >
            <VerticalBarChart data={temporaryDashboardData.sectors} />
          </ChartCard>

          <ChartCard
            title="Distribución por género"
            description="Emprendedores registrados"
            icon={Users}
          >
            <PieChart data={temporaryDashboardData.genders} />
          </ChartCard>

          <ChartCard
            title="Distribución por edad"
            description="Registros por rango de edad"
            icon={CalendarDays}
          >
            <VerticalBarChart data={temporaryDashboardData.ages} />
          </ChartCard>

          <ChartCard
            title="Emprendedores por parroquia"
            description="Distribución territorial"
            icon={MapPin}
          >
            <VerticalBarChart data={parishes} />
          </ChartCard>
        </section>

        <section className="rounded-xl border border-dashed bg-card/60 p-4">
          <p className="text-sm text-muted-foreground">
            Los KPI disponibles y la distribución por parroquia usan información
            del backend. Sector, género, edad y asesorías utilizan datos
            temporales hasta que se implementen sus endpoints correspondientes.
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
  icon: ComponentType<{
    className?: string
    'aria-hidden'?: boolean
  }>
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-6 text-primary" aria-hidden={true} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{title}</p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {value.toLocaleString('es-EC')}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
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
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>

            <CardDescription className="mt-1">{description}</CardDescription>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" aria-hidden={true} />
          </div>
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  )
}

function VerticalBarChart({ data }: { data: ChartItem[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  if (data.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          No existen datos para mostrar.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-72 items-end justify-between gap-3 pt-4">
      {data.map((item) => {
        const heightPercentage = (item.value / maxValue) * 100

        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-sm font-semibold">{item.value}</span>

            <div className="flex h-52 w-full items-end justify-center rounded-md bg-muted/50 px-2">
              <div
                className="w-full max-w-12 rounded-t-md bg-primary transition-[height] duration-500"
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
              className="max-w-full text-center text-xs leading-tight text-muted-foreground"
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
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">
          No existen datos para mostrar.
        </p>
      </div>
    )
  }

  const firstValue = visibleData[0]?.value ?? 0
  const firstPercentage = (firstValue / total) * 100

  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-6">
      <div
        className="size-48 rounded-full shadow-sm"
        style={{
          background: `conic-gradient(
            var(--primary) 0% ${firstPercentage}%,
            var(--muted-foreground) ${firstPercentage}% 100%
          )`,
        }}
        role="img"
        aria-label="Distribución de emprendedores por género"
      />

      <div className="w-full space-y-3">
        {visibleData.map((item, index) => {
          const percentage = Math.round((item.value / total) * 100)

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={
                    index === 0
                      ? 'size-3 rounded-sm bg-primary'
                      : 'size-3 rounded-sm bg-muted-foreground'
                  }
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
