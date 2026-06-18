'use client'

import { WizardStepper } from './wizard-stepper'
import { useWizardStore } from '../store/wizard.store'
import { PersonalDataStep } from './personal-data-step'
import {
  CatalogoItem,
  CatalogoItemConOrden,
  CatalogoResponse,
  RangoEdadItem,
} from '@/types/catalog.type'
import { CurrentSituationStep } from './current-situation-step'
import { IntentionsStep } from './intentions-step'
import { EnterpriseStep } from './enterprise-step'
import { TechnicalAssistanceStep } from './technical-assistance-step'
import { entrepreneurService } from '../services/entrepreneur.service'
import { mapWizardToEntrepreneurDTO } from '../utils/wizard-form-mapper'
interface PersonalDataCatalogs {
  maritalStatus: CatalogoResponse<CatalogoItem & { activo: boolean }>
  genders: CatalogoResponse<CatalogoItem & { activo: boolean }>
  occupations: CatalogoResponse<CatalogoItem & { activo: boolean }>
  ageRanges: CatalogoResponse<RangoEdadItem & { activo: boolean }>
  ethnicities: CatalogoResponse<CatalogoItem & { activo: boolean }>
  educationLevels: CatalogoResponse<CatalogoItem & { activo: boolean }>
  disabilityTypes: CatalogoResponse<CatalogoItem & { activo: boolean }>
}

interface RegisterWizardProps {
  personalDataCatalogs: PersonalDataCatalogs
}
export function RegisterWizard({ personalDataCatalogs }: RegisterWizardProps) {
  const currentStep = useWizardStore((state) => state.currentStep)
  const goToNextStep = useWizardStore((state) => state.goToNextStep)
  const goToPreviousStep = useWizardStore((state) => state.goToPreviousStep)
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

      // await enterpriseService.create(mapWizardToEnterpriseDTO(state, newEntrepreneur.id))
    } catch (error) {
      // manejar error, mostrar feedback al usuario
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
          />
        ) : null}
      </div>
    </>
  )
}
