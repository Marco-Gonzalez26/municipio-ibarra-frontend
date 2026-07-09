'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="max-w-3xl min-w-xl w-full" showCloseButton>
        <DialogHeader>
          <DialogTitle>Detalles del Emprendedor</DialogTitle>
          <DialogDescription>
            Información general del emprendedor y de su formulario registrado.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <InfoItem label="Nombre Completo" value={entrepreneur.nombres_apellidos} />
          <InfoItem label="Cédula" value={entrepreneur.cedula} />
          <InfoItem label="Correo" value={entrepreneur.email} />
          <InfoItem label="Celular" value={entrepreneur.celular} />
          <InfoItem label="Edad" value={String(entrepreneur.edad ?? '-')} />
          <InfoItem label="Ciudad" value={entrepreneur.ciudad ?? '-'} />
        </div>

        {formulario ? (
          <>
            <Separator />
            <p className="text-sm font-semibold">
              Información del Emprendimiento
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Nombre"
                value={formulario.nombre_emprendimiento ?? 'No especificado'}
              />
              <InfoItem
                label="Pago Inicial"
                value={
                  formulario.valor_pago_inicial
                    ? `$${formulario.valor_pago_inicial}`
                    : 'No registrado'
                }
              />
              <InfoItem
                label="Código de Pago"
                value={formulario.codigo_pago ?? 'No registrado'}
              />
              <InfoItem
                label="Intención de Emprender"
                value={formulario.intencion_emprender ? 'Sí' : 'No'}
              />
              {formulario.motivo_intencion_emprender ? (
                <div className="col-span-2">
                  <InfoItem
                    label="Motivación"
                    value={formulario.motivo_intencion_emprender}
                  />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}
