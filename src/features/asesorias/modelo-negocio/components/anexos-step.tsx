'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { AnexosForm } from '../types/cierre.type'
import type { WizardStep } from '../types/wizard-form.type'
import { deriveCanvas } from '../utils/canvas-selector'
import { getIncompleteSteps } from '../utils/wizard-validation'
import { StepFooter, StepHeader, type StepHandle } from './step-shell'

interface AnexosStepProps {
  onPrevious: () => void
  onGoToStep: (step: WizardStep) => void
}

const CUADRANTES: {
  key: keyof AnexosForm
  title: string
  colorClass: string
}[] = [
  {
    key: 'fortalezas',
    title: 'Fortalezas',
    colorClass: 'border-l-4 border-l-emerald-600',
  },
  {
    key: 'oportunidades',
    title: 'Oportunidades',
    colorClass: 'border-l-4 border-l-sky-700',
  },
  {
    key: 'debilidades',
    title: 'Debilidades',
    colorClass: 'border-l-4 border-l-amber-600',
  },
  {
    key: 'amenazas',
    title: 'Amenazas',
    colorClass: 'border-l-4 border-l-red-700',
  },
]

export const AnexosStep = forwardRef<StepHandle, AnexosStepProps>(
  function AnexosStep({ onPrevious, onGoToStep }, ref) {
    const router = useRouter()
    const updateAnexos = useModeloNegocioWizardStore(
      (state) => state.updateAnexos
    )
    const saveCurrentStep = useModeloNegocioWizardStore(
      (state) => state.saveCurrentStep
    )
    const formData = useModeloNegocioWizardStore((state) => state.formData)
    const canvas = deriveCanvas(formData)

    const { control, handleSubmit, getValues } = useForm<AnexosForm>({
      defaultValues: useModeloNegocioWizardStore.getState().formData.anexos,
    })

    useImperativeHandle(ref, () => ({
      saveDraft: () => updateAnexos(getValues()),
    }))

    async function onSubmit(data: AnexosForm) {
      const pendientes = getIncompleteSteps({
        ...formData,
        anexos: data,
      }).filter((step) => step.key !== 'anexos')

      if (pendientes.length > 0) {
        toast.error('Faltan secciones por completar', {
          description: pendientes.map((step) => step.label).join(', '),
          action: {
            label: 'Ir a la primera',
            onClick: () => onGoToStep(pendientes[0].key),
          },
        })
        return
      }

      updateAnexos(data)
      await saveCurrentStep()
      toast.success('Modelo de negocio guardado')
      router.push('/asesorias/modelo-negocio')
    }

    function onSaveDraft() {
      updateAnexos(getValues())
      toast.success('Borrador guardado')
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <StepHeader
          title="Anexos"
          subtitle="Análisis FODA y Modelo Canvas, sintetizados a partir de los apartados anteriores."
        />

        <Field>
          <FieldLabel>Análisis FODA</FieldLabel>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {CUADRANTES.map((cuadrante) => (
              <Controller
                key={cuadrante.key}
                name={cuadrante.key}
                control={control}
                rules={{
                  required: `${cuadrante.title} es un campo obligatorio`,
                }}
                render={({ field, fieldState }) => (
                  <div
                    className={`rounded-lg border bg-card p-3 ${cuadrante.colorClass}`}
                  >
                    <FieldLabel htmlFor={field.name} className="mb-2 text-sm">
                      {cuadrante.title} *
                    </FieldLabel>
                    <Textarea {...field} id={field.name} rows={5} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel>Modelo Canvas</FieldLabel>
          <p className="text-xs text-muted-foreground">
            Se genera automáticamente a partir de los pasos del Modelo de
            negocio ya completados.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {canvas.map((bloque) => (
              <div
                key={bloque.id}
                className="rounded-lg border bg-muted/40 p-3"
              >
                <p className="mb-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                  {bloque.titulo}
                </p>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {bloque.contenido}
                </p>
              </div>
            ))}
          </div>
        </Field>

        <StepFooter
          onPrevious={onPrevious}
          onSaveDraft={onSaveDraft}
          submitLabel="Finalizar"
        />
      </form>
    )
  }
)
