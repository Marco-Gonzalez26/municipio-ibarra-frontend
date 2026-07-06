'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Emprendedor } from '@/types/entrepreneur.type'
import type { FormularioReferenciaGeneral } from '@/types/form.type'

interface EntrepreneurDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entrepreneur: Emprendedor | null
  formulario: FormularioReferenciaGeneral | null
}

export function EntrepreneurDetailDialog({
  open,
  onOpenChange,
  entrepreneur,
  formulario,
}: EntrepreneurDetailDialogProps) {
  if (!entrepreneur) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl min-w-xl w-full "
        showCloseButton
        aria-describedby="alert-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Detalles del Emprendedor</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Nombre Completo</p>
            <p className="text-sm font-medium">
              {entrepreneur.nombres_apellidos}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cédula</p>
            <p className="text-sm font-medium">{entrepreneur.cedula}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Correo</p>
            <p className="text-sm font-medium">{entrepreneur.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Celular</p>
            <p className="text-sm font-medium">{entrepreneur.celular}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Edad</p>
            <p className="text-sm font-medium">{entrepreneur.edad}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ciudad</p>
            <p className="text-sm font-medium">{entrepreneur.ciudad}</p>
          </div>
        </div>

        {formulario && (
          <>
            <Separator />
            <p className="text-sm font-semibold">
              Información del Emprendimiento
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nombre</p>
                <p className="text-sm font-medium">
                  {formulario.nombre_emprendimiento ?? 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pago Inicial</p>
                <p className="text-sm font-medium">
                  {formulario.valor_pago_inicial
                    ? `$${formulario.valor_pago_inicial}`
                    : 'No registrado'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Código de Pago</p>
                <p className="text-sm font-medium">
                  {formulario.codigo_pago ?? 'No registrado'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Intención de Emprender
                </p>
                <p className="text-sm font-medium">
                  {formulario.intencion_emprender ? 'Sí' : 'No'}
                </p>
              </div>
              {formulario.motivo_intencion_emprender && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Motivación</p>
                  <p className="text-sm font-medium">
                    {formulario.motivo_intencion_emprender}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
