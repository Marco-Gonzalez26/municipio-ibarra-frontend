import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
} from 'lucide-react'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'

export default async function HomeDashboardPage() {
  const { emprendedores: enterpreneurs } = await entrepreneurService.getAll()

  const { formularios_referencia_general: formsRefGeneral } =
    await entrepeneurFormService.getAllRefGeneral()

  // Agrupar emprendimientos por emprendedor
  const enterprisesPerEnterpreneur = formsRefGeneral.reduce(
    (acc, formulario) => {
      if (!acc[formulario.id_emprendedor]) {
        acc[formulario.id_emprendedor] = []
      }
      acc[formulario.id_emprendedor].push(formulario)
      return acc
    },
    {} as Record<number, typeof formsRefGeneral>
  )

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />

        <h1 className="text-sm font-medium">Inicio</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-muted-foreground text-sm">
          Bienvenido al sistema de gestión de emprendedores.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <small className="text-muted-foreground text-xs font-bold">
          Demo para demostracion del lunes 22 de junio
        </small>

        <div className="flex flex-col gap-4">
          <h3 className="text-muted-foreground text-sm font-medium">
            Emprendedores
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enterpreneurs
              .sort(
                (a, b) =>
                  new Date(b.fecha_registro).getTime() -
                  new Date(a.fecha_registro).getTime()
              )
              .map((enterpreneur) => {
                const enterperneurForms =
                  enterprisesPerEnterpreneur[enterpreneur.id] || []
                const hasForm = enterperneurForms.length > 0
                const hasEnterprise = enterperneurForms.some(
                  (form) => form.tiene_emprendimiento === true
                )
                const activeEnterprises = enterperneurForms.filter(
                  (formulario) =>
                    formulario.tiene_emprendimiento === true &&
                    formulario.nombre_emprendimiento
                )

                return (
                  <Card key={enterpreneur.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {enterpreneur.nombres_apellidos}
                      </CardTitle>
                      <CardDescription>
                        Cédula: {enterpreneur.cedula}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Información General
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enterpreneur.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enterpreneur.celular}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enterpreneur.ciudad}, {enterpreneur.parroquia}
                        </p>
                      </div>

                      <div className="border-t pt-3">
                        {hasForm ? (
                          <>
                            {hasEnterprise ? (
                              // Si TIENE emprendimiento: mostrar solo el nombre
                              <div className="space-y-2">
                                {activeEnterprises.map((emp) => (
                                  <div
                                    key={emp.id}
                                    className="flex items-start gap-2"
                                  >
                                    <Briefcase className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium">
                                        Emprendimiento:{' '}
                                        {emp.nombre_emprendimiento}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(
                                          emp.fecha_formulario
                                        ).toLocaleDateString('es-ES')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Si NO TIENE emprendimiento: mostrar otros estados
                              <div className="space-y-2">
                                {enterperneurForms.map((form) => (
                                  <div key={form.id} className="space-y-2">
                                    {form.intencion_emprender && (
                                      <div className="flex items-start gap-2">
                                        <TrendingUp className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                                        <p className="text-xs">
                                          <span className="font-medium">
                                            Intención de emprender:
                                          </span>
                                          <span className="text-muted-foreground ml-1">
                                            {form.motivo_intencion_emprender}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                    {form.intencion_mejorar && (
                                      <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-orange-600 shrink-0" />
                                        <p className="text-xs">
                                          <span className="font-medium">
                                            Intención de mejorar:
                                          </span>
                                          <span className="text-muted-foreground ml-1">
                                            {form.motivo_intencion_mejorar}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                    {form.esta_en_asociatividad && (
                                      <div className="flex items-start gap-2">
                                        <Users className="w-4 h-4 mt-0.5 text-purple-600 shrink-0" />
                                        <p className="text-xs font-medium">
                                          Está en asociatividad
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                            <p className="text-xs text-muted-foreground">
                              Sin formulario de referencia registrado
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
