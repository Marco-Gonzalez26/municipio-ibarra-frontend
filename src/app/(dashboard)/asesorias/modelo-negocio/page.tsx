import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeloNegocioListado } from '@/features/asesorias/modelo-negocio/components/modelo-negocio-listado'
import { ModeloNegocioWizard } from '@/features/asesorias/modelo-negocio/components/modelo-negocio-wizard'
import { fichaContextoService } from '@/features/asesorias/modelo-negocio/services/ficha-contexto.service'

interface ModeloNegocioPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ModeloNegocioPage({
  searchParams,
}: ModeloNegocioPageProps) {
  const { id } = await searchParams
  const idEmprendedor = id ? Number(id) : null
  const contexto = idEmprendedor
    ? await fichaContextoService.getByEmprendedorId(idEmprendedor)
    : null

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Asesorías · Modelo de negocio</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {contexto && idEmprendedor ? (
          <>
            {contexto.datosSimulados && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <p>
                  No se pudo conectar con el backend (requiere autenticación aún
                  no implementada). Se están mostrando datos de referencia para
                  poder continuar con la demostración.
                </p>
              </div>
            )}
            <ModeloNegocioWizard
              idEmprendedor={idEmprendedor}
              contexto={contexto}
            />
          </>
        ) : (
          <>
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
              Selecciona un emprendedor desde{' '}
              <Link href="/emprendedores" className="text-primary underline">
                Emprendedores
              </Link>{' '}
              para generar su modelo de negocio.
            </div>
            <ModeloNegocioListado />
          </>
        )}
      </div>
    </>
  )
}
