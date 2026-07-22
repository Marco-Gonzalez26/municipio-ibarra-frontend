'use client'

import { useEffect } from 'react'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { FichaContexto } from '../types/ficha.type'
import { WizardStepper } from './wizard-stepper'
import { FichaStep } from './ficha-step'
import { IntroduccionStep } from './introduccion-step'
import { AntecedentesStep } from './antecedentes-step'
import { JustificacionStep } from './justificacion-step'
import { ObjetivosStep } from './objetivos-step'
import { PropuestaStep } from './propuesta-step'
import { SegmentosStep } from './segmentos-step'
import { CanalesStep } from './canales-step'
import { RelacionStep } from './relacion-step'
import { IngresosStep } from './ingresos-step'
import { RecursosStep } from './recursos-step'
import { ActividadesStep } from './actividades-step'
import { SociosStep } from './socios-step'
import { CostosStep } from './costos-step'
import { ConclusionesStep } from './conclusiones-step'
import { AnexosStep } from './anexos-step'

interface ModeloNegocioWizardProps {
  idEmprendedor: number
  contexto: FichaContexto
}

export function ModeloNegocioWizard({
  idEmprendedor,
  contexto,
}: ModeloNegocioWizardProps) {
  const ensureEmprendedor = useModeloNegocioWizardStore(
    (state) => state.ensureEmprendedor
  )
  useEffect(() => {
    ensureEmprendedor(idEmprendedor, contexto)
  }, [idEmprendedor, contexto, ensureEmprendedor])

  const currentStep = useModeloNegocioWizardStore((state) => state.currentStep)
  const goToNextStep = useModeloNegocioWizardStore(
    (state) => state.goToNextStep
  )
  const goToPreviousStep = useModeloNegocioWizardStore(
    (state) => state.goToPreviousStep
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <WizardStepper currentStep={currentStep} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'ficha' ? (
          <FichaStep contexto={contexto} onNext={goToNextStep} />
        ) : null}
        {currentStep === 'introduccion' ? (
          <IntroduccionStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'antecedentes' ? (
          <AntecedentesStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'justificacion' ? (
          <JustificacionStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'objetivos' ? (
          <ObjetivosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'propuesta' ? (
          <PropuestaStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'segmentos' ? (
          <SegmentosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'canales' ? (
          <CanalesStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'relacion' ? (
          <RelacionStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'ingresos' ? (
          <IngresosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'recursos' ? (
          <RecursosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'actividades' ? (
          <ActividadesStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'socios' ? (
          <SociosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'costos' ? (
          <CostosStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        ) : null}
        {currentStep === 'conclusiones' ? (
          <ConclusionesStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'anexos' ? (
          <AnexosStep onPrevious={goToPreviousStep} />
        ) : null}
      </div>
    </div>
  )
}
