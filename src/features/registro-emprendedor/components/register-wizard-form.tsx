'use client'
import { useState } from 'react'
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
import { mapWizardToEntrepreneurDTO } from '../utils/wizard-form-mapper'
import type {
  CurrentSituationCatalogs,
  PersonalDataCatalogs,
  TechnicalAssistanceCatalogs,
} from '../types/props.type'

interface RegisterWizardProps {
  personalDataCatalogs: PersonalDataCatalogs
  technicalAssistanceCatalogs: TechnicalAssistanceCatalogs

  currentSituationCatalogs: CurrentSituationCatalogs
}
export function RegisterWizard({
  personalDataCatalogs,
  technicalAssistanceCatalogs,
  currentSituationCatalogs,
}: RegisterWizardProps) {
  const currentStep = useWizardStore((state) => state.currentStep)
  const goToNextStep = useWizardStore((state) => state.goToNextStep)
  const goToPreviousStep = useWizardStore((state) => state.goToPreviousStep)
  const router = useRouter()
  async function onFinish() {
    const state = useWizardStore.getState().formData
    const dto = mapWizardToEntrepreneurDTO(
      state,
      personalDataCatalogs.ageRanges.data
    )

    try {
      console.log({ dto })
      const newEntrepreneur = await entrepreneurService.create(dto)
      console.log({ newEntrepreneur })
      toast.success('¡Solicitud enviada con éxito!', {
        description: 'Información registrada correctamente.',
      })
      useWizardStore.getState().reset()
      router.push('/')
      // await enterpriseService.create(mapWizardToEnterpriseDTO(state, newEntrepreneur.id))
    } catch (error) {
      // manejar error, mostrar feedback al usuario
      toast.error('No se pudo enviar la solicitud', {
        description:
          error instanceof Error ? error.message : 'Intente nuevamente.',
      })
    }
  }
  return (
    <>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <WizardStepper currentStep={currentStep} />
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'datos-personales' ? (
          <PersonalDataStep
            onNext={goToNextStep}
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
          <IntentionsStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}

        {currentStep === 'emprendimiento' ? (
          <EnterpriseStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
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
