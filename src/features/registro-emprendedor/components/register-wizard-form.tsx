'use client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { WizardStepper } from './wizard-stepper'
import { useWizardStore } from '../store/wizard.store'
import { PersonalDataStep } from './personal-data-step'
import { CurrentSituationStep } from './current-situation-step'
import { IntentionsStep } from './intentions-step'
import { EnterpriseStep } from './enterprise-step'
import { TechnicalAssistanceStep } from './technical-assistance-step'
import { entrepreneurService } from '../services/entrepreneur.service'
import {
  mapWizardToEntrepreneurDTO,
  mapWizardToFormularioAsistenciaDTO,
  mapWizardToFormularioReferenciaDTO,
} from '../utils/wizard-form-mapper'
import type {
  CurrentSituationCatalogs,
  EnterpriseCatalogs,
  IntentionsCatalogs,
  PersonalDataCatalogs,
  TechnicalAssistanceCatalogs,
} from '../types/props.type'
import { PaymentStep } from './payment-step'
import { entrepeneurFormService } from '../services/entrepreneur-form.service'
import { createEntrepreneurAction } from '../actions/create-entrepeneur-and-enterprise-action'

interface RegisterWizardProps {
  personalDataCatalogs: PersonalDataCatalogs
  technicalAssistanceCatalogs: TechnicalAssistanceCatalogs

  currentSituationCatalogs: CurrentSituationCatalogs

  enterpriseCatalogs: EnterpriseCatalogs
  intentionsCatalogs: IntentionsCatalogs
}
export function RegisterWizard({
  personalDataCatalogs,
  technicalAssistanceCatalogs,
  currentSituationCatalogs,
  intentionsCatalogs,
  enterpriseCatalogs,
}: RegisterWizardProps) {
  const currentStep = useWizardStore((state) => state.currentStep)
  const goToNextStep = useWizardStore((state) => state.goToNextStep)
  const goToPreviousStep = useWizardStore((state) => state.goToPreviousStep)
  const router = useRouter()
  async function onFinish() {
    const state = useWizardStore.getState().formData

    try {
      await createEntrepreneurAction(state, personalDataCatalogs.ageRanges.data)
      toast.success('¡Emprendedor creado con éxito!', {
        description: 'Información registrada correctamente.',
      })
      useWizardStore.getState().reset()
      router.push('/inicio')
    } catch (error) {
      toast.error('No se pudo enviar la solicitud', {
        description: (error as { msg?: string }).msg ?? 'Intente nuevamente.',
      })
    }
  }
  return (
    <>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <WizardStepper currentStep={currentStep} />
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'pago' ? <PaymentStep onNext={goToNextStep} /> : null}
        {currentStep === 'datos-personales' ? (
          <PersonalDataStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            catalogs={personalDataCatalogs}
          />
        ) : null}
        {currentStep === 'situacion-actual' ? (
          <CurrentSituationStep
            catalogs={currentSituationCatalogs}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
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
