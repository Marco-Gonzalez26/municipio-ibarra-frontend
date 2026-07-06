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
    await entrepeneurFormService.getAllReferenciaGeneral()

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
        <h1>Trabajo en progreso</h1>
      </div>
    </>
  )
}
