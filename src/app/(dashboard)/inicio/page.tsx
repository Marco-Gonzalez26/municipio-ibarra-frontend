import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Store,
  UserCog,
  Users,
  XCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { userService } from '@/features/usuarios/services/user.service'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'

const LIMIT = 100

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

  const aprobados = formularios.filter(
    (formulario) => formulario.id_estado_emprendedor === 3
  ).length

  const rechazados = formularios.filter(
    (formulario) => formulario.id_estado_emprendedor === 4
  ).length

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Panel de Administración</h1>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4">
        <section className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Resumen general
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualización rápida de emprendedores, emprendimientos, usuarios y
            estados del registro.
          </p>
        </section>

        {hasApiError ? (
          <Card className="border-yellow-200 bg-yellow-50 text-yellow-900">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <AlertCircle className="size-5" />
              <div>
                <CardTitle className="text-sm">Backend no disponible</CardTitle>
                <CardDescription className="text-yellow-800">
                  Revisa que NEXT_PUBLIC_API_BASE_URL esté configurado y que el
                  backend esté respondiendo.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            title="Total emprendedores"
            value={totalEmprendedores}
            description="Ciudadanos registrados"
            icon={<Users className="size-5 text-blue-600" />}
          />

          <DashboardCard
            title="Emprendimientos"
            value={totalEmprendimientos}
            description="Formularios con emprendimiento"
            icon={<Store className="size-5 text-green-600" />}
          />

          <DashboardCard
            title="Solicitudes pendientes"
            value={pendientes}
            description="Pendientes de revisión"
            icon={<ClipboardList className="size-5 text-yellow-600" />}
          />

          <DashboardCard
            title="Usuarios"
            value={totalUsuarios}
            description="Usuarios administrativos"
            icon={<UserCog className="size-5 text-purple-600" />}
          />

          <DashboardCard
            title="Aprobados"
            value={aprobados}
            description="Registros aprobados"
            icon={<CheckCircle className="size-5 text-emerald-600" />}
          />

          <DashboardCard
            title="Rechazados"
            value={rechazados}
            description="Registros rechazados"
            icon={<XCircle className="size-5 text-red-500" />}
          />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Últimos emprendedores</h3>
          <div className="mt-4 space-y-3">
            {emprendedores.slice(0, 5).map((emprendedor) => (
              <div
                key={emprendedor.id}
                className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {emprendedor.nombres_apellidos}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cédula: {emprendedor.cedula} · {emprendedor.parroquia}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  {new Date(emprendedor.fecha_registro).toLocaleDateString(
                    'es-EC'
                  )}
                </p>
              </div>
            ))}

            {emprendedores.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No existen emprendedores para mostrar.
              </p>
            ) : null}
          </div>
        </section>
      </main>
    </>
  )
}

interface DashboardCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
