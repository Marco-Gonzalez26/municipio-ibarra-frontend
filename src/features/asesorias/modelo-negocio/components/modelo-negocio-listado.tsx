'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { ModeloNegocioEstado } from '../types/wizard-form.type'

const ESTADO_MAP: Record<
  ModeloNegocioEstado,
  { label: string; variant: 'secondary' | 'default' }
> = {
  borrador: { label: 'BORRADOR', variant: 'secondary' },
  completado: { label: 'COMPLETADO', variant: 'default' },
}

function formatFecha(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ModeloNegocioListado() {
  const registro = useModeloNegocioWizardStore((state) => state.registro)
  const modelos = Object.values(registro).sort(
    (a, b) =>
      new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()
  )

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary *:text-center">
            <TableHead className="text-primary-foreground">
              Emprendedor
            </TableHead>
            <TableHead className="text-primary-foreground">
              Emprendimiento
            </TableHead>
            <TableHead className="text-primary-foreground">Estado</TableHead>
            <TableHead className="text-primary-foreground">
              Última actualización
            </TableHead>
            <TableHead className="text-right text-primary-foreground">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelos.map((modelo) => {
            const estado = ESTADO_MAP[modelo.estado]
            return (
              <TableRow key={modelo.idEmprendedor} className="text-center">
                <TableCell className="font-medium">
                  {modelo.nombreEmprendedor}
                </TableCell>
                <TableCell>
                  {modelo.nombreEmprendimiento ?? 'Sin nombre'}
                </TableCell>
                <TableCell>
                  <Badge variant={estado.variant}>{estado.label}</Badge>
                </TableCell>
                <TableCell>{formatFecha(modelo.actualizadoEn)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/asesorias/modelo-negocio?id=${modelo.idEmprendedor}`}
                    >
                      Continuar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}

          {modelos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Aún no hay modelos de negocio guardados.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
