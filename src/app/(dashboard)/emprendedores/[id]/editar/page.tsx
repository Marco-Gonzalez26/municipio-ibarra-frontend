import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { EditEntrepreneurForm } from '@/features/emprendedores/components/edit-entrepreneur-form'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

interface EditEntrepreneurPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEntrepreneurPage({
  params,
}: EditEntrepreneurPageProps) {
  const { id } = await params
  const session = await requireSession()
  const entrepreneur = await withSessionRedirect(() =>
    entrepreneurService.getById(Number(id), session.token)
  )

  if (!entrepreneur) notFound()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">
          Editar Emprendedor {entrepreneur.nombres_apellidos}
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-6 max-w-4xl mx-auto w-full">
        <EditEntrepreneurForm entrepreneur={entrepreneur} />
      </div>
    </>
  )
}
