import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { EntrepreneursTable } from '@/features/emprendedores/components/entrepreneurs-table'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

// trae todo el listado (no solo la página actual - paginación) para la búsqueda
const LIMIT_ALL = 1000
const LIMIT_FORMULARIOS = 500

export default async function EmprendedoresPage() {
  const session = await requireSession()

  const [entrepreneursRes, formularsRes] = await withSessionRedirect(() =>
    Promise.all([
      entrepreneurService.getAll(1, LIMIT_ALL, session.token),
      entrepeneurFormService.getAllReferenciaGeneral(
        1,
        LIMIT_FORMULARIOS,
        session.token
      ),
    ])
  )

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Emprendedores</h1>
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link href="/registro">
              <UserPlus className="mr-2 size-4" />
              Nuevo Emprendedor
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <EntrepreneursTable
          entrepreneurs={entrepreneursRes.emprendedores}
          formularios={formularsRes.formularios_referencia_general}
        />
      </div>
    </>
  )
}
