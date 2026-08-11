import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { EntrepreneursTable } from '@/features/emprendedores/components/entrepreneurs-table'
import { TablePagination } from '@/features/emprendedores/components/table-pagination'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

const LIMIT = 15
const LIMIT_FORMULARIOS = 500

interface EmprendedoresPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function EmprendedoresPage({
  searchParams,
}: EmprendedoresPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const session = await requireSession()

  const [entrepreneursRes, formularsRes] = await withSessionRedirect(() =>
    Promise.all([
      entrepreneurService.getAll(page, LIMIT, session.token),
      entrepeneurFormService.getAllReferenciaGeneral(
        1,
        LIMIT_FORMULARIOS,
        session.token
      ),
    ])
  )

  const totalPages = Math.ceil(entrepreneursRes.total / LIMIT)

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
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          total={entrepreneursRes.total}
        />
      </div>
    </>
  )
}
