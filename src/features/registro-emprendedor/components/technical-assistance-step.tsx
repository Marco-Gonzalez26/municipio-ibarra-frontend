'use client'

import { Controller, useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useWizardStore } from '../store/wizard.store'
import type { AsistenciaTecnicaForm } from '../types/wizard-form.type'
import type { TechnicalAssistanceCatalogs } from '../types/props.type'
import { CatalogoItem } from '@/types/catalog.type'

interface TechnicalAssistanceStepProps {
  onPrevious: () => void
  onFinish: () => void
  isSubmitting?: boolean
  catalogs: TechnicalAssistanceCatalogs
}

export function TechnicalAssistanceStep({
  onPrevious,
  onFinish,
  isSubmitting,
  catalogs,
}: TechnicalAssistanceStepProps) {
  const { assistanceAreas, themeAssistanceAreas } = catalogs
  const technicalAssistance = useWizardStore(
    (state) => state.formData.asistenciaTecnica
  )
  const updateTechnicalAssistance = useWizardStore(
    (state) => state.updateTechnicalAssistance
  )

  // catareaasistencia tiene un campo "categoria" que se puede usar para agrupar las opciones en la UI, pero por ahora lo dejamos plano hasta tener claridad sobre las categorías finales.
  const assistanceAreaOptions = assistanceAreas.data
    .filter((area) => area.activo)
    .sort((a, b) => a.orden - b.orden)

  const themeOptions = themeAssistanceAreas.data.filter((area) => area.activo)
  const themeOptionsByCategory = themeOptions.reduce(
    (acc, theme) => {
      console.log({ theme })
      const area = assistanceAreas.data.find((a) => a.id === theme.id_area)
      const categoryName = area?.descripcion ?? 'Sin categoría'

      if (!acc[categoryName]) {
        acc[categoryName] = []
      }

      acc[categoryName].push(theme)
      return acc
    },
    {} as Record<string, typeof themeOptions>
  )

  // Deriva la "situación actual" a partir de las respuestas previas del wizard,
  // en vez de pedírsela de nuevo al usuario.
  const hasEnterprise = useWizardStore((state) => state.hasEnterprise())
  const belongsToAssociation = useWizardStore(
    (state) => state.formData.situacionActual.pertenece_asociatividad
  )
  const wantsToStart = useWizardStore(
    (state) => state.formData.intenciones.desea_emprender
  )

  const situacionActualLabel = belongsToAssociation
    ? 'Pertenezco a una asociatividad'
    : hasEnterprise
      ? 'Tengo emprendimiento'
      : wantsToStart
        ? 'Deseo emprender'
        : 'Sin información'

  const { control, handleSubmit } = useForm<AsistenciaTecnicaForm>({
    defaultValues: technicalAssistance,
  })

  function onSubmit(data: AsistenciaTecnicaForm) {
    updateTechnicalAssistance(data)
    onFinish()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Asistencia Técnica Requerida
        </h2>
        <p className="text-sm text-muted-foreground">
          Selecciona las áreas en las que necesitas asesoramiento
        </p>
      </div>

      <Field>
        <FieldLabel>Situación Actual</FieldLabel>
        <div className="flex h-9 w-fit items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
          {situacionActualLabel}
        </div>
      </Field>

      <Controller
        name="areas_asistencia"
        control={control}
        render={({ field }) => (
          <div className="space-y-6">
            <FieldLabel>Áreas de Asesoramiento</FieldLabel>

            {Object.entries(themeOptionsByCategory).map(
              ([category, themes]) => (
                <div key={category}>
                  <h3 className="mb-2 text-sm font-semibold text-indigo-900">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {themes.map((option) => {
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
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`area-${option.id}`}
                            checked={checked}
                            onCheckedChange={handleCheckedChange}
                            disabled={option.id !== 1}
                          />
                          <FieldLabel
                            htmlFor={`area-${option.id}`}
                            className="font-normal"
                          >
                            {option.descripcion}
                          </FieldLabel>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      />
      <Controller
        name="observaciones"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Observaciones</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              className="resize-none"
              placeholder="Agrega cualquier información adicional relevante sobre tu solicitud de asesoramiento..."
            />
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
          <Button type="submit" disabled={isSubmitting}>
            <Send className="size-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </div>
      </div>
    </form>
  )
}
