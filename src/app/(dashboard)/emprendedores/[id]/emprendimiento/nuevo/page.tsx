import { ArrowLeft, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AddEmprendimientoWizard } from '@/features/emprendimientos/components/add-emprendimiento-wizard'
import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

interface NewEmprendimientoPageProps {
  params: Promise<{ id: string }>
}

export default async function NewEmprendimientoPage({
  params,
}: NewEmprendimientoPageProps) {
  const { id } = await params
  const idEmprendedor = Number(id)
  const session = await requireSession()

  const [entrepreneur, catalogs] = await withSessionRedirect(() =>
    Promise.all([
      entrepreneurService.getById(idEmprendedor, session.token),
      catalogService.getAllCatalogs(session.token),
    ])
  )

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarBackButton />
        <h1 className="text-sm font-medium">
          Añadir emprendimiento a {entrepreneur.nombres_apellidos}
        </h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 pb-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Nuevo emprendimiento</h2>
              <p className="text-sm text-muted-foreground">
                Emprendedor: {entrepreneur.nombres_apellidos} · Cédula:{' '}
                {entrepreneur.cedula}
              </p>
            </div>
          </div>
        </div>

        <AddEmprendimientoWizard
          idEmprendedor={entrepreneur.id}
          enterpriseCatalogs={catalogs.enterpriseCatalogs}
          intentionsCatalogs={catalogs.intentionsCatalogs}
          technicalAssistanceCatalogs={catalogs.technicalAssistanceCatalogs}
        />
      </main>
    </>
  )
}

function SidebarBackButton() {
  return (
    <Button asChild size="icon" variant="ghost" aria-label="Volver">
      <Link href="/emprendedores">
        <ArrowLeft className="size-5" />
      </Link>
    </Button>
  )
}
