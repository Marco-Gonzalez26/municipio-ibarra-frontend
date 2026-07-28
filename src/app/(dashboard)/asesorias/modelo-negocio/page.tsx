import { unstable_rethrow } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { ModeloNegocioListado } from '@/features/asesorias/modelo-negocio/components/modelo-negocio-listado'
import { ModeloNegocioWizard } from '@/features/asesorias/modelo-negocio/components/modelo-negocio-wizard'
import { fichaContextoService } from '@/features/asesorias/modelo-negocio/services/ficha-contexto.service'
import type {
  FichaContexto,
  EmprendimientoOpcion,
} from '@/features/asesorias/modelo-negocio/types/ficha.type'

const LIMIT_EMPRENDIMIENTOS = 200

interface ModeloNegocioPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ModeloNegocioPage({
  searchParams,
}: ModeloNegocioPageProps) {
  const { id } = await searchParams
  const idEmprendedor = id ? Number(id) : null
  const session = await requireSession()

  let contexto: FichaContexto | null = null
  if (idEmprendedor) {
    try {
      contexto = await withSessionRedirect(() =>
        fichaContextoService.getByEmprendedorId(idEmprendedor, session.token)
      )
    } catch (error) {
      unstable_rethrow(error)
      console.error('No se pudo cargar la ficha del emprendedor', error)
    }
  }

  let emprendimientos: EmprendimientoOpcion[] = []
  if (!contexto) {
    try {
      const [entrepreneursRes, formulariosRes] = await withSessionRedirect(() =>
        Promise.all([
          entrepreneurService.getAll(1, LIMIT_EMPRENDIMIENTOS, session.token),
          entrepeneurFormService.getAllReferenciaGeneral(
            1,
            LIMIT_EMPRENDIMIENTOS,
            session.token
          ),
        ])
      )

      const entrepreneursById = new Map(
        entrepreneursRes.emprendedores.map((emprendedor) => [
          emprendedor.id,
          emprendedor,
        ])
      )

      emprendimientos = formulariosRes.formularios_referencia_general
        .filter((formulario) => formulario.tiene_emprendimiento)
        .map((formulario) => {
          const emprendedor = entrepreneursById.get(formulario.id_emprendedor)
          return {
            idEmprendedor: formulario.id_emprendedor,
            nombreEmprendedor: emprendedor?.nombres_apellidos ?? 'Sin nombre',
            cedula: emprendedor?.cedula ?? '-',
            nombreEmprendimiento:
              formulario.nombre_emprendimiento ?? 'Sin nombre',
          }
        })
    } catch (error) {
      unstable_rethrow(error)
      console.error('No se pudieron cargar los emprendimientos', error)
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Asesorías - Modelo de negocio</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {contexto && idEmprendedor ? (
          <ModeloNegocioWizard
            idEmprendedor={idEmprendedor}
            contexto={contexto}
          />
        ) : (
          <ModeloNegocioListado emprendimientos={emprendimientos} />
        )}
      </div>
    </>
  )
}
