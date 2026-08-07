'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { EmprendimientoOpcion } from '../types/ficha.type'

interface SeleccionarEmprendimientoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emprendimientos: EmprendimientoOpcion[]
}

export function SeleccionarEmprendimientoDialog({
  open,
  onOpenChange,
  emprendimientos,
}: SeleccionarEmprendimientoDialogProps) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return emprendimientos

    return emprendimientos.filter((opcion) =>
      [opcion.nombreEmprendedor, opcion.cedula, opcion.nombreEmprendimiento]
        .join(' ')
        .toLowerCase()
        .includes(termino)
    )
  }, [emprendimientos, busqueda])

  function seleccionar(idEmprendedor: number) {
    onOpenChange(false)
    router.push(`/asesorias/modelo-negocio?id=${idEmprendedor}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl min-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Elegir emprendimiento</DialogTitle>
          <DialogDescription>
            Selecciona el emprendimiento al que le harás el modelo de negocio.
            Si ya tiene uno guardado, lo retomas donde quedó.
          </DialogDescription>
        </DialogHeader>

        <Input
          autoFocus
          placeholder="Buscar emprendimiento, CI o emprendedor..."
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
        />

        <div className="max-h-96 space-y-2 overflow-y-auto">
          {filtrados.map((opcion) => (
              <button
                key={opcion.idEmprendedor}
                type="button"
                onClick={() => seleccionar(opcion.idEmprendedor)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {opcion.nombreEmprendimiento}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {opcion.nombreEmprendedor} · CI {opcion.cedula}
                  </p>
                </div>
              </button>
          ))}

          {filtrados.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No se encontraron emprendimientos.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
