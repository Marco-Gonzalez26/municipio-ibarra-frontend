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

export default async function DashboardPage() {
  const { emprendedores: enterpreneurs } = await entrepreneurService.getAll()

  const { formularios_referencia_general: formsRefGeneral } =
    await entrepeneurFormService.getAllRefGeneral()

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
      <h1 className="text-sm font-medium">Dashboard de Gestión</h1>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-muted-foreground text-sm">
          Resumen general del sistema de emprendedores.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Total Emprendedores
                </CardTitle>
                <CardDescription>
                  <Users/> {enterpreneurs.length}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
