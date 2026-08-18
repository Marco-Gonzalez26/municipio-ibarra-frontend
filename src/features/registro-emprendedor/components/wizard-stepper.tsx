import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  WIZARD_STEPS,
  type WizardStep,
} from '../types/wizard-form.type'

interface WizardStepperProps {
  currentStep: WizardStep
  steps?: { key: WizardStep; label: string }[]
}

export function WizardStepper({ currentStep, steps = WIZARD_STEPS }: WizardStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const isLast = index === WIZARD_STEPS.length - 1

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive &&
                    'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-center text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
