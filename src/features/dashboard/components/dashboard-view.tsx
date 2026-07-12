import {
  AlertCircle,
  CalendarDays,
  MapPin,
  RefreshCw,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ChartCard } from '@/features/dashboard/components/chart-card'
import { DashboardCard } from '@/features/dashboard/components/dashboard-card'
import { PieChart } from '@/features/dashboard/components/pie-chart'
import { VerticalBarChart } from '@/features/dashboard/components/vertical-bar-chart'
import type { DashboardData } from '@/features/dashboard/types/dashboard.type'

interface DashboardViewProps {
  data: DashboardData
}

export function DashboardView({ data }: DashboardViewProps) {
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
                    {data.totalUsuarios.toLocaleString('es-EC')}
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
                    {data.updatedAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {data.hasApiError ? (
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
          {data.cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              tone={card.tone}
            />
          ))}
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
            <VerticalBarChart data={data.sectores} />
          </ChartCard>

          <ChartCard
            title="Distribución por género"
            description="Emprendedores registrados por género"
            icon={Users}
          >
            <PieChart data={data.generos} />
          </ChartCard>

          <ChartCard
            title="Distribución por edad"
            description="Emprendedores agrupados por rango de edad"
            icon={CalendarDays}
          >
            <VerticalBarChart data={data.edades} />
          </ChartCard>

          <ChartCard
            title="Emprendedores por parroquia"
            description="Cinco parroquias con mayor número de registros"
            icon={MapPin}
          >
            <VerticalBarChart data={data.parroquias} />
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
