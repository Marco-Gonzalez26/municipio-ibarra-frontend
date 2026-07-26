'use client'

import { Button } from '@/components/ui/button'
import { useModeloNegocioWizardStore } from '../store/wizard.store'

export interface StepHandle {
  saveDraft: () => void
}

interface StepHeaderProps {
  title: string
  subtitle: string
}

export function StepHeader({ title, subtitle }: StepHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

interface StepFooterProps {
  onPrevious?: () => void
  onSaveDraft: () => void
  submitLabel?: string
}

export function StepFooter({
  onPrevious,
  onSaveDraft,
  submitLabel = 'Siguiente',
}: StepFooterProps) {
  const registrarProgreso = useModeloNegocioWizardStore(
    (state) => state.registrarProgreso
  )

  function handleSaveDraft() {
    onSaveDraft()
    registrarProgreso('borrador')
  }

  return (
    <div className="flex justify-between gap-3 border-t pt-6">
      {onPrevious ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Anterior
        </Button>
      ) : (
        <span />
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleSaveDraft}>
          Guardar Borrador
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </div>
  )
}
