'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type {
  FormularioReferenciaGeneral,
  FormularioAsistenciaTecnica,
} from '@/types/form.type'
import type { Emprendedor } from '@/types/entrepreneur.type'

const ESTADO_MAP: Record<number, string> = {
  1: 'INGRESADO',
  2: 'PENDIENTE',
  3: 'APROBADO',
  4: 'RECHAZADO',
}

interface FormularioDetailDialogProps {
  tipo: 'referencia' | 'asistencia'
  formulario: FormularioReferenciaGeneral | FormularioAsistenciaTecnica | null
  emprendedor: Emprendedor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FormularioDetailDialog({
  tipo,
  formulario,
  emprendedor,
  open,
  onOpenChange,
}: FormularioDetailDialogProps) {
  if (!formulario) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'referencia'
              ? `Formulario Referencia FRG-${formulario.id}`
              : `Asistencia Técnica FAT-${formulario.id}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground">Emprendedor</p>
              <p className="font-medium">
                {emprendedor?.nombres_apellidos ?? 'No encontrado'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Cédula</p>
              <p className="font-medium">{emprendedor?.cedula ?? '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha</p>
              <p className="font-medium">
                {new Date(formulario.fecha_formulario).toLocaleDateString(
                  'es-EC'
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Estado</p>
              <p className="font-medium">
                {tipo === 'referencia'
                  ? (ESTADO_MAP[
                      (formulario as FormularioReferenciaGeneral)
                        .id_estado_emprendedor
                    ] ?? 'DESCONOCIDO')
                  : '-'}
              </p>
            </div>
          </div>

          {tipo === 'referencia' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Tiene emprendimiento</p>
                  <p className="font-medium">
                    {(formulario as FormularioReferenciaGeneral)
                      .tiene_emprendimiento
                      ? 'Sí'
                      : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Intención emprender</p>
                  <p className="font-medium">
                    {(formulario as FormularioReferenciaGeneral)
                      .intencion_emprender === null
                      ? 'Sin especificar'
                      : (formulario as FormularioReferenciaGeneral)
                            .intencion_emprender
                        ? 'Sí'
                        : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nombre emprendimiento</p>
                  <p className="font-medium">
                    {(formulario as FormularioReferenciaGeneral)
                      .nombre_emprendimiento ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Código pago</p>
                  <p className="font-medium">
                    {(formulario as FormularioReferenciaGeneral).codigo_pago ??
                      '-'}
                  </p>
                </div>
              </div>
              {(formulario as FormularioReferenciaGeneral)
                .notas_adicionales && (
                <div>
                  <p className="text-muted-foreground">Notas</p>
                  <p>
                    {
                      (formulario as FormularioReferenciaGeneral)
                        .notas_adicionales
                    }
                  </p>
                </div>
              )}
            </>
          )}

          {tipo === 'asistencia' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Emprendimiento</p>
                  <p className="font-medium">
                    {(formulario as FormularioAsistenciaTecnica)
                      .nombre_emprendimiento ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tasa cancelada</p>
                  <p className="font-medium">
                    {Boolean(
                      (formulario as FormularioAsistenciaTecnica).tasa_cancelada
                    )
                      ? 'Sí'
                      : 'No'}
                  </p>
                </div>
              </div>
              {(formulario as FormularioAsistenciaTecnica).notas && (
                <div>
                  <p className="text-muted-foreground">Notas</p>
                  <p>{(formulario as FormularioAsistenciaTecnica).notas}</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
