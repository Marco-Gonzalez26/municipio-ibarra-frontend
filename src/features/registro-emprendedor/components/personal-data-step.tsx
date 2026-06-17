'use client'

import { Controller, useForm } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWizardStore } from '../store/wizard.store'
import type { DatosPersonalesForm } from '../types/wizard-form.type'
import { PersonalDataCatalogs } from '../types/props.type'

interface PersonalDataStepProps {
  onNext: () => void
  catalogs: PersonalDataCatalogs
}

export function PersonalDataStep({ onNext, catalogs }: PersonalDataStepProps) {
  const personalData = useWizardStore((state) => state.formData.datosPersonales)
  const updatePersonalData = useWizardStore((state) => state.updatePersonalData)
  const {
    maritalStatus,
    genders,
    occupations,
    ageRanges,
    ethnicities,
    educationLevels,
    disabilityTypes,
  } = catalogs
  const { control, handleSubmit, watch } = useForm<DatosPersonalesForm>({
    defaultValues: personalData,
  })

  const tieneDiscapacidad = watch('tiene_discapacidad')
  const idEtnia = watch('id_etnia')
  const esOtraEtnia = idEtnia === 6
  console.log({
    maritalStatus,
    genders,
    occupations,
    ageRanges,
    ethnicities,
    educationLevels,
    disabilityTypes,
  })
  function onSubmit(data: DatosPersonalesForm) {
    updatePersonalData(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Datos Personales
        </h2>
        <p className="text-sm text-muted-foreground">
          Completa tu información personal
        </p>
      </div>

      {/* Datos básicos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Controller
          name="nombres"
          control={control}
          rules={{ required: 'Los nombres son obligatorios' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombres *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="apellidos"
          control={control}
          rules={{ required: 'Los apellidos son obligatorios' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Apellidos *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="cedula"
          control={control}
          rules={{
            required: 'La cédula es obligatoria',
            minLength: {
              value: 10,
              message: 'La cédula debe tener 10 dígitos',
            },
            maxLength: {
              value: 10,
              message: 'La cédula debe tener 10 dígitos',
            },
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Cédula *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                maxLength={10}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo electrónico inválido',
            },
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Correo Electrónico *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="celular"
          control={control}
          rules={{ required: 'El celular es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Celular *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="nacionalidad"
          control={control}
          rules={{ required: 'La nacionalidad es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nacionalidad *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fecha_nacimiento"
          control={control}
          rules={{ required: 'La fecha de nacimiento es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Fecha de Nacimiento *
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fecha_nacimiento"
          control={control}
          rules={{ required: 'La fecha de nacimiento es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rango de edad *</FieldLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="focus:ring-secondary! focus:border-secondary! focus:ring-1!">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent align="center" className="mt-9">
                  {ageRanges.data.map((option) => (
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

      {/* Dirección */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Controller
          name="ciudad"
          control={control}
          rules={{ required: 'La ciudad es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Ciudad *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="parroquia"
          control={control}
          rules={{ required: 'La parroquia es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Parroquia *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="barrio_comunidad"
          control={control}
          rules={{ required: 'El barrio o comunidad es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Barrio o Comunidad *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="calle_principal"
          control={control}
          rules={{ required: 'La calle principal es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Calle Principal *</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="calle_secundaria"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Calle Secundaria</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
            </Field>
          )}
        />

        <Controller
          name="numero_casa"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Número de Casa</FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
            </Field>
          )}
        />
      </div>

      {/* Estado civil y discapacidad */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <Controller
          name="id_estado_civil"
          control={control}
          rules={{ required: 'El estado civil es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Estado Civil *</FieldLabel>
              <RadioGroup
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
                className="flex flex-wrap gap-4"
              >
                {maritalStatus.data.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`estado-civil-${option.id}`}
                    />
                    <FieldLabel
                      htmlFor={`estado-civil-${option.id}`}
                      className="font-normal"
                    >
                      {option.descripcion}
                    </FieldLabel>
                  </div>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tiene_discapacidad"
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={field.name}>¿Posee discapacidad?</FieldLabel>
            </Field>
          )}
        />
      </div>

      {tieneDiscapacidad && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            name="id_tipo_discapacidad"
            control={control}
            rules={{ required: 'El tipo de discapacidad es obligatorio' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tipo de Discapacidad *</FieldLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="focus:ring-secondary! focus:border-secondary! focus:ring-1!">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent align="center" className="mt-9">
                    {disabilityTypes.data.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="porcentaje_discapacidad"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Porcentaje</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
                />
              </Field>
            )}
          />

          <Controller
            name="numero_carnet_discapacidad"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Número de Carnet</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
                />
              </Field>
            )}
          />
        </div>
      )}

      {/* Cargas familiares, género, etnia */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          name="cantidad_cargas_familiares"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Número de Cargas Familiares
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="number"
                min={0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
            </Field>
          )}
        />

        <Controller
          name="cargas_con_discapacidad"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Familiares con Discapacidad
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="number"
                min={0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
            </Field>
          )}
        />

        <Controller
          name="id_genero"
          control={control}
          rules={{ required: 'El género es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Género *</FieldLabel>
              <RadioGroup
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
                className="flex flex-wrap gap-4"
              >
                {genders.data.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`genero-${option.id}`}
                    />
                    <FieldLabel
                      htmlFor={`genero-${option.id}`}
                      className="font-normal"
                    >
                      {option.descripcion}
                    </FieldLabel>
                  </div>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="id_etnia"
          control={control}
          rules={{ required: 'La etnia es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Etnia *</FieldLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="focus:ring-secondary! focus:border-secondary! focus:ring-1!">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent align="center" className="mt-9">
                  {ethnicities.data.map((option) => (
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

        {esOtraEtnia && (
          <Controller
            name="etnia_otra"
            control={control}
            rules={{ required: 'Especifica la etnia' }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Especifica Etnia *</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </div>

      {/* Nivel de estudios */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="id_nivel_estudios"
          control={control}
          rules={{ required: 'El nivel de estudios es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nivel de Estudios *</FieldLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger className="focus:ring-secondary! focus:border-secondary! focus:ring-1!">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent align="center" className="mt-9">
                  {educationLevels.data.map((option) => (
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

        <Controller
          name="titulo_profesional"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Título Profesional (si aplica)
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                className="focus:ring-secondary! focus:border-secondary! focus:ring-1!"
              />
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline">
          Guardar Borrador
        </Button>
        <Button type="submit">Siguiente</Button>
      </div>
    </form>
  )
}
