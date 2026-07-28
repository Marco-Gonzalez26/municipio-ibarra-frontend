'use client'

import { useEffect, useRef } from 'react'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { FichaContexto } from '../types/ficha.type'
import type { WizardStep } from '../types/wizard-form.type'
import { WizardStepper } from './wizard-stepper'
import type { StepHandle } from './step-shell'
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
  const setCurrentStep = useModeloNegocioWizardStore(
    (state) => state.setCurrentStep
  )
  const goToNextStep = useModeloNegocioWizardStore(
    (state) => state.goToNextStep
  )
  const goToPreviousStep = useModeloNegocioWizardStore(
    (state) => state.goToPreviousStep
  )

  const stepRef = useRef<StepHandle>(null)

  function handleStepClick(step: WizardStep) {
    if (step === currentStep) return
    stepRef.current?.saveDraft()
    setCurrentStep(step)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <WizardStepper
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'ficha' ? (
          <FichaStep ref={stepRef} contexto={contexto} onNext={goToNextStep} />
        ) : null}
        {currentStep === 'introduccion' ? (
          <IntroduccionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'antecedentes' ? (
          <AntecedentesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'justificacion' ? (
          <JustificacionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'objetivos' ? (
          <ObjetivosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'propuesta' ? (
          <PropuestaStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'segmentos' ? (
          <SegmentosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'canales' ? (
          <CanalesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'relacion' ? (
          <RelacionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'ingresos' ? (
          <IngresosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'recursos' ? (
          <RecursosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'actividades' ? (
          <ActividadesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'socios' ? (
          <SociosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'costos' ? (
          <CostosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'conclusiones' ? (
          <ConclusionesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'anexos' ? (
          <AnexosStep
            ref={stepRef}
            onPrevious={goToPreviousStep}
            onGoToStep={setCurrentStep}
          />
        ) : null}
      </div>
    </div>
  )
}
