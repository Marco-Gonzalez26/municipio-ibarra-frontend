import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WIZARD_STEPS, type WizardStep } from '../types/wizard-form.type'

interface WizardStepperProps {
  currentStep: WizardStep
}

const GROUPS = Array.from(new Set(WIZARD_STEPS.map((step) => step.group)))

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const currentIndex = WIZARD_STEPS.findIndex(
    (step) => step.key === currentStep
  )

  return (
    <nav className="flex flex-col gap-6">
      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <span className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group}
          </span>

          {WIZARD_STEPS.map((step, index) => {
            if (step.group !== group) return null

            const isCompleted = index < currentIndex
            const isActive = index === currentIndex

            return (
              <div
                key={step.key}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                  isActive && 'bg-primary/10 text-foreground',
                  !isActive && 'text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isActive &&
                      'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    !isCompleted &&
                      !isActive &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span>{step.label}</span>
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
