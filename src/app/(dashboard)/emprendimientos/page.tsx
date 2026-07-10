import { SidebarTrigger } from '@/components/ui/sidebar'
import { EmprendimientosTable } from '@/features/emprendimientos/components/emprendimientos-table'
import { TablePagination } from '@/features/emprendedores/components/table-pagination'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'

const LIMIT = 15

interface EmprendimientosPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function EmprendimientosPage({
  searchParams,
}: EmprendimientosPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)

  let entrepreneurs: Emprendedor[] = []
  let formularios: FormularioReferenciaGeneral[] = []
  let total = 0

  try {
    // Se usa referencia general porque el front aún no tiene servicio propio.
    const [entrepreneursRes, formulariosRes] = await Promise.all([
      entrepreneurService.getAll(page, LIMIT),
      entrepeneurFormService.getAllReferenciaGeneral(page, LIMIT),
    ])

    entrepreneurs = Array.isArray(entrepreneursRes.emprendedores)
      ? entrepreneursRes.emprendedores
      : []

    const formulariosBase = Array.isArray(
      formulariosRes.formularios_referencia_general
    )
      ? formulariosRes.formularios_referencia_general
      : []

    formularios = formulariosBase.filter(
      (formulario) => formulario.tiene_emprendimiento
    )
    total = formulariosRes.total ?? formularios.length
  } catch (error) {
    console.error('No se pudieron cargar los emprendimientos', error)
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Emprendimientos</h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 pb-6">
        <EmprendimientosTable
          entrepreneurs={entrepreneurs}
          formularios={formularios}
        />

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          total={total}
          itemLabel="emprendimiento"
        />
      </main>
    </>
  )
}
