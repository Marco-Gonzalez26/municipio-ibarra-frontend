import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { EntrepreneursTable } from '@/features/emprendedores/components/entrepreneurs-table'
import { TablePagination } from '@/features/emprendedores/components/table-pagination'

const LIMIT = 15

interface EmprendedoresPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function EmprendedoresPage({
  searchParams,
}: EmprendedoresPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)

  const [entrepreneursRes, formularsRes] = await Promise.all([
    entrepreneurService.getAll(page, LIMIT),
    entrepeneurFormService.getAllReferenciaGeneral(page, LIMIT),
  ])

  const totalPages = Math.ceil(entrepreneursRes.total / LIMIT)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Emprendedores</h1>
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
