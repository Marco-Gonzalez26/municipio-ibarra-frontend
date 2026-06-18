'use client'

import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useWizardStore } from '../store/wizard.store'
import type { IntencionesForm } from '../types/wizard-form.type'

// TODO: pendiente catálogo "sectores de interés", no existe aún en backend
const SECTORES_INTERES_OPTIONS = [
  { id: 1, descripcion: 'Artesanías' },
  { id: 2, descripcion: 'Textil' },
  { id: 3, descripcion: 'Ornamentación' },
  { id: 4, descripcion: 'Manualidades' },
  { id: 5, descripcion: 'Procesados' },
  { id: 6, descripcion: 'Bisutería' },
  { id: 7, descripcion: 'Salud y Nutrición' },
  { id: 8, descripcion: 'Tecnología' },
  { id: 9, descripcion: 'Lencería' },
  { id: 10, descripcion: 'Licores' },
  { id: 11, descripcion: 'Servicios Profesionales' },
  { id: 12, descripcion: 'Calzado' },
  { id: 13, descripcion: 'Productos de Limpieza' },
  { id: 14, descripcion: 'Belleza' },
  { id: 15, descripcion: 'Productos del Campo' },
  { id: 16, descripcion: 'Gastronomía' },
  { id: 17, descripcion: 'Productos para Mascotas' },
  { id: 18, descripcion: 'Dulces y Postres' },
  { id: 19, descripcion: 'Otro' },
]

interface IntentionsStepProps {
  onNext: () => void
  onPrevious: () => void
}

export function IntentionsStep({ onNext, onPrevious }: IntentionsStepProps) {
  const intenciones = useWizardStore((state) => state.formData.intenciones)
  const updateIntentions = useWizardStore((state) => state.updateIntentions)

  const { control, handleSubmit } = useForm<IntencionesForm>({
    defaultValues: intenciones,
  })

  function onSubmit(data: IntencionesForm) {
    updateIntentions(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Intenciones de Emprendimiento
        </h2>
        <p className="text-sm text-muted-foreground">
          Cuéntanos sobre tus intenciones y áreas de interés
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <Controller
          name="desea_emprender"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>¿Desea emprender?</FieldLabel>
              <RadioGroup
                value={field.value ? 'si' : 'no'}
                onValueChange={(v) => field.onChange(v === 'si')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="si" id="desea-emprender-si" />
                  <FieldLabel
                    htmlFor="desea-emprender-si"
                    className="font-normal"
                  >
                    Sí
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="desea-emprender-no" />
                  <FieldLabel
                    htmlFor="desea-emprender-no"
                    className="font-normal"
                  >
                    No
                  </FieldLabel>
                </div>
              </RadioGroup>
            </Field>
          )}
        />

        <Controller
          name="motivacion_emprender"
          control={control}
          render={({ field }) => (
            <Field className="min-w-64 flex-1">
              <FieldLabel htmlFor={field.name}>¿Por qué?</FieldLabel>
              <Textarea
                className="resize-none"
                {...field}
                id={field.name}
                placeholder="Explica tus motivaciones para emprender..."
              />
            </Field>
          )}
        />
      </div>

      <Controller
        name="sectores_interes"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Sectores de Interés</FieldLabel>
            <p className="text-sm text-muted-foreground">
              Selecciona los sectores en los que estás interesado/a
            </p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {SECTORES_INTERES_OPTIONS.map((option) => {
                const checked = field.value.includes(option.id)

                function handleCheckedChange(isChecked: boolean) {
                  if (isChecked) {
                    field.onChange([...field.value, option.id])
                  } else {
                    field.onChange(
                      field.value.filter((id: number) => id !== option.id)
                    )
                  }
                }

                return (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`sector-${option.id}`}
                      checked={checked}
                      onCheckedChange={handleCheckedChange}
                    />
                    <FieldLabel
                      htmlFor={`sector-${option.id}`}
                      className="font-normal"
                    >
                      {option.descripcion}
                    </FieldLabel>
                  </div>
                )
              })}
            </div>
          </Field>
        )}
      />

      <div className="flex justify-between gap-3 border-t pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Anterior
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="outline">
            Guardar Borrador
          </Button>
          <Button type="submit">Siguiente</Button>
        </div>
      </div>
    </form>
  )
}
