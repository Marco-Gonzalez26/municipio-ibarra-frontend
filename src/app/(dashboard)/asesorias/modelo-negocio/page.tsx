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
import { modeloNegocioService } from '@/features/modelo-negocio/services/modelo-negocio-crud.service'
import type {
  FichaContexto,
  EmprendimientoOpcion,
} from '@/features/asesorias/modelo-negocio/types/ficha.type'
import type { ModeloNegocioDTO } from '@/features/modelo-negocio/types/modelo-negocio-api.types'

const LIMIT_EMPRENDIMIENTOS = 200
const LIMIT_MODELOS = 200

interface ModeloNegocioPageProps {
  searchParams: Promise<{ id?: string; formularioRef?: string }>
}

export default async function ModeloNegocioPage({
  searchParams,
}: ModeloNegocioPageProps) {
  const { id, formularioRef } = await searchParams
  const session = await requireSession()

  // If id is provided, try to load the modelo and its context
  let modeloNegocioId: number | null = null
  let contexto: FichaContexto | null = null
  let emprendedorId: number | null = null
  const parsedFormularioRef = formularioRef ? Number(formularioRef) : null

  if (id && !parsedFormularioRef) {
    const parsedId = Number(id)

    // First, try to fetch as a modelo_negocio ID
    try {
      const modeloRes = await withSessionRedirect(() =>
        modeloNegocioService.getById(parsedId, session.token)
      )
      modeloNegocioId = modeloRes.modelo.id

      // We have a modelo, but we need the emprendedor context
      // Since modelo_negocio doesn't have id_emprendedor, we try to find it
      // by matching nombre_emprendimiento against the user's emprendimientos
      try {
        const [entrepreneursRes, formulariosRes] = await withSessionRedirect(
          () =>
            Promise.all([
              entrepreneurService.getAll(
                1,
                LIMIT_EMPRENDIMIENTOS,
                session.token
              ),
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

        // Find the matching emprendimiento by nombre
        const matchingFormulario =
          formulariosRes.formularios_referencia_general.find(
            (formulario) =>
              formulario.tiene_emprendimiento &&
              formulario.nombre_emprendimiento ===
                modeloRes.modelo.nombre_emprendimiento
          )

        if (matchingFormulario) {
          emprendedorId = matchingFormulario.id_emprendedor
          const emprendedor = entrepreneursById.get(emprendedorId)
          if (emprendedor) {
            contexto = {
              idEmprendedor: emprendedor.id,
              idFormularioRef: matchingFormulario.id,
              nombreEmprendedor: emprendedor.nombres_apellidos,
              cedula: emprendedor.cedula,
              contacto: emprendedor.celular,
              correo: emprendedor.email,
              fechaIngreso:
                matchingFormulario.fecha_formulario ??
                emprendedor.fecha_registro,
              nombreEmprendimiento:
                matchingFormulario.nombre_emprendimiento ?? null,
              idSector: null,
              sector: null,
              direccion: emprendedor.parroquia || null,
            }
          }
        }
      } catch (error) {
        console.error('Error loading emprendedor context:', error)
      }
    } catch {
      // Not a modelo_negocio ID, try as emprendedor ID
      emprendedorId = parsedId
      try {
        contexto = await withSessionRedirect(() =>
          fichaContextoService.getByEmprendedorId(emprendedorId!, session.token)
        )
      } catch (error) {
        unstable_rethrow(error)
        console.error('No se pudo cargar la ficha del emprendedor', error)
      }
    }
  }

  if (id && parsedFormularioRef) {
    emprendedorId = Number(id)
    try {
      contexto = await withSessionRedirect(() =>
        fichaContextoService.getByEmprendedorId(
          emprendedorId!,
          session.token,
          parsedFormularioRef
        )
      )
    } catch (error) {
      unstable_rethrow(error)
      console.error('No se pudo cargar el formulario seleccionado', error)
    }
  }

  // Load listing data if no contexto (listing mode)
  let modelosIniciales: ModeloNegocioDTO[] = []
  let emprendimientos: EmprendimientoOpcion[] = []

  if (!contexto) {
    try {
      const [modelosRes, entrepreneursRes, formulariosRes] =
        await withSessionRedirect(() =>
          Promise.all([
            modeloNegocioService.list(
              { page: 1, limit: LIMIT_MODELOS },
              session.token
            ),
            entrepreneurService.getAll(1, LIMIT_EMPRENDIMIENTOS, session.token),
            entrepeneurFormService.getAllReferenciaGeneral(
              1,
              LIMIT_EMPRENDIMIENTOS,
              session.token
            ),
          ])
        )

      modelosIniciales = modelosRes.modelos ?? []
      const entrepreneursById = new Map(
        (entrepreneursRes.emprendedores ?? []).map((emprendedor) => [
          emprendedor.id,
          emprendedor,
        ])
      )

      emprendimientos = (formulariosRes.formularios_referencia_general ?? [])
        .filter(
          (formulario) =>
            formulario.tiene_emprendimiento &&
            formulario.id_estado_emprendedor === 3
        )
        .map((formulario) => {
          const emprendedor = entrepreneursById.get(formulario.id_emprendedor)
          return {
            idFormularioRef: formulario.id,
            idEmprendedor: formulario.id_emprendedor,
            nombreEmprendedor: emprendedor?.nombres_apellidos ?? 'Sin nombre',
            cedula: emprendedor?.cedula ?? '-',
            nombreEmprendimiento:
              formulario.nombre_emprendimiento ?? 'Sin nombre',
          }
        })
    } catch (error) {
      unstable_rethrow(error)
      console.error('No se pudieron cargar los datos', error)
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Asesorías - Modelo de negocio</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {contexto && emprendedorId ? (
          <ModeloNegocioWizard
            idEmprendedor={emprendedorId}
            contexto={contexto}
            modeloNegocioId={modeloNegocioId}
            analistaNombre={session.usuario.nombres}
          />
        ) : (
          <ModeloNegocioListado
            modelosIniciales={modelosIniciales}
            emprendimientos={emprendimientos}
          />
        )}
      </div>
    </>
  )
}
