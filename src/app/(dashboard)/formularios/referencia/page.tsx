import { SidebarTrigger } from '@/components/ui/sidebar'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { ReferenciaTable } from '@/features/formularios/components/referencia-table'
import { TablePagination } from '@/features/emprendedores/components/table-pagination'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

const LIMIT = 15

interface ReferenciaPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ReferenciaPage({
  searchParams,
}: ReferenciaPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const session = await requireSession()

  const [formulariosRes, emprendedoresRes] = await withSessionRedirect(() =>
    Promise.all([
      entrepeneurFormService.getAllReferenciaGeneral(
        page,
        LIMIT,
        session.token
      ),
      entrepreneurService.getAll(1, 9999, session.token),
    ])
  )

  const totalPages = Math.ceil((formulariosRes.total ?? 0) / LIMIT)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Formularios de Referencia</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <ReferenciaTable
          formularios={formulariosRes.formularios_referencia_general ?? []}
          emprendedores={emprendedoresRes.emprendedores ?? []}
        />
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          total={formulariosRes.total ?? 0}
        />
      </div>
    </>
  )
}
