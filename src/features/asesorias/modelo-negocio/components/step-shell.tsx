'use client'

import { Button } from '@/components/ui/button'
import { useModeloNegocioWizardStore } from '../store/wizard.store'

export interface StepHandle {
  saveDraft: () => void | Promise<void>
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
  const saveCurrentStep = useModeloNegocioWizardStore(
    (state) => state.saveCurrentStep
  )
  const isSaving = useModeloNegocioWizardStore((state) => state.isSaving)

  async function handleSaveDraft() {
    onSaveDraft()
    await saveCurrentStep()
  }

  return (
    <div className="flex justify-between gap-3 border-t pt-6">
      {onPrevious ? (
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isSaving}>
          Anterior
        </Button>
      ) : (
        <span />
      )}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          Guardar Borrador
        </Button>
        <Button type="submit" disabled={isSaving}>{submitLabel}</Button>
      </div>
    </div>
  )
}
