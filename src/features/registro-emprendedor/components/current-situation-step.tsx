'use client'

import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWizardStore } from '../store/wizard.store'
import type { SituacionActualForm } from '../types/wizard-form.type'
import { CurrentSituationCatalogs } from '../types/props.type'

// TODO: reemplazar por datos reales de catocupacion y catnivelingresos
const OCUPACION_OPTIONS = [
  { id: 1, descripcion: 'Sin empleo' },
  { id: 2, descripcion: 'Ama de casa' },
  { id: 3, descripcion: 'Dependiente privado' },
  { id: 4, descripcion: 'Estudiante' },
  { id: 5, descripcion: 'Servidor público' },
  { id: 6, descripcion: 'Artesano' },
  { id: 7, descripcion: 'Jornalero' },
  { id: 8, descripcion: 'Emprendedor' },
  { id: 9, descripcion: 'Jubilado' },
  { id: 10, descripcion: 'Otro' },
]

const OCUPACION_OTRA_ID = 10

interface CurrentSituationStepProps {
  onNext: () => void
  onPrevious: () => void
  catalogs: CurrentSituationCatalogs
}

export function CurrentSituationStep({
  onNext,
  onPrevious,
  catalogs,
}: CurrentSituationStepProps) {
  const { entrepreneurSituations, incomeLevels, entrepreneurOccupations } =
    catalogs

  const currentSituation = useWizardStore(
    (state) => state.formData.situacionActual
  )
  const updateCurrentSituation = useWizardStore(
    (state) => state.updateCurrentSituation
  )

  const { control, handleSubmit, watch } = useForm<SituacionActualForm>({
    defaultValues: currentSituation,
  })

  const idOcupacion = watch('id_ocupacion')
  const esOtraOcupacion = idOcupacion === OCUPACION_OTRA_ID

  function onSubmit(data: SituacionActualForm) {
    updateCurrentSituation(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Situación Actual
        </h2>
        <p className="text-sm text-muted-foreground">
          Cuéntanos sobre tu situación laboral y económica actual
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="id_ocupacion"
          control={control}
          rules={{ required: 'La ocupación es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ocupación *</FieldLabel>
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {entrepreneurOccupations.data.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {esOtraOcupacion && (
          <Controller
            name="ocupacion_otra"
            control={control}
            rules={{ required: 'Especifica la ocupación' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Especifica Ocupación *
                </FieldLabel>
                <Input {...field} id={field.name} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Controller
          name="id_nivel_ingresos"
          control={control}
          rules={{ required: 'El nivel de ingresos es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ingresos Económicos *</FieldLabel>
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {incomeLevels.data.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-wrap gap-10">
        <Controller
          name="tiene_emprendimiento"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>¿Tiene emprendimiento? *</FieldLabel>
              <RadioGroup
                value={field.value ? 'si' : 'no'}
                onValueChange={(v) => field.onChange(v === 'si')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="si" id="tiene-emprendimiento-si" />
                  <FieldLabel
                    htmlFor="tiene-emprendimiento-si"
                    className="font-normal"
                  >
                    Sí
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="tiene-emprendimiento-no" />
                  <FieldLabel
                    htmlFor="tiene-emprendimiento-no"
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
          name="pertenece_asociatividad"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>¿Pertenece a una asociatividad? *</FieldLabel>
              <RadioGroup
                value={field.value ? 'si' : 'no'}
                onValueChange={(v) => field.onChange(v === 'si')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="si" id="asociatividad-si" />
                  <FieldLabel
                    htmlFor="asociatividad-si"
                    className="font-normal"
                  >
                    Sí
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="asociatividad-no" />
                  <FieldLabel
                    htmlFor="asociatividad-no"
                    className="font-normal"
                  >
                    No
                  </FieldLabel>
                </div>
              </RadioGroup>
            </Field>
          )}
        />
      </div>

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
