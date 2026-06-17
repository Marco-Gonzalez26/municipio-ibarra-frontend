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
        {currentStep === 'situacion-actual'
          ? '<SituacionActualStep onNext={onNext} />'
          : null}
        {currentStep === 'intenciones'
          ? '<IntencionesStep onNext={onNext} />'
          : null}
        {currentStep === 'emprendimiento'
          ? '<EmprendimientoStep onNext={onNext} />'
          : null}
        {currentStep === 'asistencia-tecnica'
          ? '<AsistenciaTecnicaStep onNext={onNext} />'
          : null}
      </div>
    </>
  )
}
