import {
  ArrowLeft,
  ArrowLeftCircle,
  Building2,
  ChevronLeft,
} from 'lucide-react'
import { RegisterWizard } from '@/features/registro-emprendedor/components/register-wizard-form'
import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const session = await requireSession('/registro')
  const catalogs = await withSessionRedirect(() =>
    catalogService.getAllCatalogs(session.token)
  )

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <Button asChild variant="ghost" className="flex items-center">
            <Link href="/">
              <ArrowLeft className="size-6" />
            </Link>
          </Button>
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <Building2 className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Registro de Emprendedor
            </h1>
            <p className="text-sm text-muted-foreground">
              Completa el formulario para registrar tu emprendimiento
            </p>
          </div>
        </div>

        <RegisterWizard
          personalDataCatalogs={catalogs.personalDataCatalogs}
          technicalAssistanceCatalogs={catalogs.technicalAssistanceCatalogs}
          currentSituationCatalogs={catalogs.currentSituationCatalogs}
          enterpriseCatalogs={catalogs.enterpriseCatalogs}
          intentionsCatalogs={catalogs.intentionsCatalogs}
        />
      </div>
    </div>
  )
}
