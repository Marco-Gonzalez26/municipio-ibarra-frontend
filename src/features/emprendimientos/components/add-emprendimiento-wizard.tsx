'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { WizardStepper } from '@/features/registro-emprendedor/components/wizard-stepper'
import { PaymentStep } from '@/features/registro-emprendedor/components/payment-step'
import { IntentionsStep } from '@/features/registro-emprendedor/components/intentions-step'
import { EnterpriseStep } from '@/features/registro-emprendedor/components/enterprise-step'
import { TechnicalAssistanceStep } from '@/features/registro-emprendedor/components/technical-assistance-step'
import { useWizardStore } from '@/features/registro-emprendedor/store/wizard.store'
import { EXISTING_ENTREPRENEUR_STEPS } from '@/features/registro-emprendedor/types/wizard-form.type'
import type {
  EnterpriseCatalogs,
  IntentionsCatalogs,
  TechnicalAssistanceCatalogs,
} from '@/features/registro-emprendedor/types/props.type'
import { createEmprendimientoAction } from '../actions/create-emprendimiento.action'

interface AddEmprendimientoWizardProps {
  idEmprendedor: number
  enterpriseCatalogs: EnterpriseCatalogs
  intentionsCatalogs: IntentionsCatalogs
  technicalAssistanceCatalogs: TechnicalAssistanceCatalogs
}

export function AddEmprendimientoWizard({
  idEmprendedor,
  enterpriseCatalogs,
  intentionsCatalogs,
  technicalAssistanceCatalogs,
}: AddEmprendimientoWizardProps) {
  const router = useRouter()
  const currentStep = useWizardStore((state) => state.currentStep)
  const resetForMode = useWizardStore((state) => state.resetForMode)
  const goToNextStep = useWizardStore((state) => state.goToNextStep)
  const goToPreviousStep = useWizardStore((state) => state.goToPreviousStep)

  useEffect(() => {
    resetForMode('emprendimiento-existente')
  }, [resetForMode])

  async function onFinish() {
    const state = useWizardStore.getState().formData

    try {
      await createEmprendimientoAction(idEmprendedor, state)
      toast.success('Emprendimiento creado correctamente.')
      resetForMode('registro')
      router.push('/emprendimientos')
    } catch (error) {
      toast.error('No se pudo crear el emprendimiento.', {
        description:
          error instanceof Error ? error.message : 'Intente nuevamente.',
      })
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <WizardStepper
          currentStep={currentStep}
          steps={EXISTING_ENTREPRENEUR_STEPS}
        />
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'pago' ? <PaymentStep onNext={goToNextStep} /> : null}
        {currentStep === 'intenciones' ? (
          <IntentionsStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            catalogs={intentionsCatalogs}
          />
        ) : null}
        {currentStep === 'emprendimiento' ? (
          <EnterpriseStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            catalogs={enterpriseCatalogs}
          />
        ) : null}
        {currentStep === 'asistencia-tecnica' ? (
          <TechnicalAssistanceStep
            onPrevious={goToPreviousStep}
            onFinish={onFinish}
            catalogs={technicalAssistanceCatalogs}
          />
        ) : null}
      </div>
    </>
  )
}
