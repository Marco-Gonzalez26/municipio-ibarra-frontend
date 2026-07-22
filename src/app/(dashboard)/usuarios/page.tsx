import { SidebarTrigger } from '@/components/ui/sidebar'
import { UsersTable } from '@/features/usuarios/components/users-table'
import { userService } from '@/features/usuarios/services/user.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

const LIMIT = 15

interface UsuariosPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function UsuariosPage({
  searchParams,
}: UsuariosPageProps) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const session = await requireSession()
  const usersRes = await withSessionRedirect(() =>
    userService.getAll(page, LIMIT, session.token)
  )
  const users = Array.isArray(usersRes.usuarios) ? usersRes.usuarios : []

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Usuarios</h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 pb-6">
        <UsersTable users={users} />
      </main>
    </>
  )
}
