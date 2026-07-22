'use client'

import { Controller, useForm } from 'react-hook-form'
import { Info } from 'lucide-react'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWizardStore } from '../store/wizard.store'
import type { EmprendimientoForm } from '../types/wizard-form.type'
import { EnterpriseCatalogs } from '../types/props.type'

interface EnterpriseStepProps {
  onNext: () => void
  onPrevious: () => void
  catalogs: EnterpriseCatalogs
}

export function EnterpriseStep({
  onNext,
  onPrevious,
  catalogs,
}: EnterpriseStepProps) {
  const { enterpriseInfrastructures, enterpriseSectors, enterpriseTypes } =
    catalogs

  const hasEnterprise = useWizardStore((state) => state.hasEnterprise())
  const enterpriseData = useWizardStore(
    (state) => state.formData.emprendimiento
  )
  const updateEnterprise = useWizardStore((state) => state.updateEnterprise)

  const { control, handleSubmit, watch } = useForm<EmprendimientoForm>({
    defaultValues: enterpriseData,
  })

  const deseaMejorar = watch('desea_mejorar')

  function onSubmit(data: EmprendimientoForm) {
    updateEnterprise(data)
    onNext()
  }

  // Si el usuario no tiene emprendimiento, mostramos solo el mensaje informativo
  if (!hasEnterprise) {
    return (
      <div className="space-y-8">
        <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p>
            Este paso es solo para quienes ya tienen un emprendimiento. Puedes
            continuar al siguiente paso.
          </p>
        </div>

        <div className="flex justify-between gap-3 border-t pt-6">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Anterior
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline">
              Guardar Borrador
            </Button>
            <Button type="button" onClick={onNext}>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Información del Emprendimiento
        </h2>
        <p className="text-sm text-muted-foreground">
          Proporciona detalles sobre tu emprendimiento actual
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Controller
          name="nombre_emprendimiento"
          control={control}
          rules={{ required: 'El nombre del emprendimiento es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Nombre del Emprendimiento *
              </FieldLabel>
              <Input {...field} id={field.name} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="anio_creacion"
          control={control}
          rules={{ required: 'El año de creación es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Año de Creación *</FieldLabel>
              <Input
                id={field.name}
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="descripcion"
          control={control}
          rules={{ required: 'La descripción es obligatoria' }}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Descripción *</FieldLabel>
              <Textarea {...field} id={field.name} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="id_sector"
          control={control}
          rules={{ required: 'El sector es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Sector *</FieldLabel>
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {enterpriseSectors.data.map((option) => (
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
          name="id_tipo"
          control={control}
          rules={{ required: 'El tipo es obligatorio' }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Tipo *</FieldLabel>
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {enterpriseTypes.data.map((option) => (
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

      <Controller
        name="recursos_disponibles"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Recursos Disponibles</FieldLabel>
            <p className="text-sm text-muted-foreground">
              Selecciona los recursos con los que ya cuenta tu emprendimiento
            </p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {enterpriseInfrastructures.data.map((option) => {
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
                      id={`recurso-${option.id}`}
                      checked={checked}
                      onCheckedChange={handleCheckedChange}
                    />
                    <FieldLabel
                      htmlFor={`recurso-${option.id}`}
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

      <div className="flex flex-wrap items-start gap-6">
        <Controller
          name="desea_mejorar"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>¿Desea mejorar su emprendimiento? *</FieldLabel>
              <RadioGroup
                value={field.value ? 'si' : 'no'}
                onValueChange={(v) => field.onChange(v === 'si')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="si" id="desea-mejorar-si" />
                  <FieldLabel
                    htmlFor="desea-mejorar-si"
                    className="font-normal"
                  >
                    Sí
                  </FieldLabel>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="desea-mejorar-no" />
                  <FieldLabel
                    htmlFor="desea-mejorar-no"
                    className="font-normal"
                  >
                    No
                  </FieldLabel>
                </div>
              </RadioGroup>
            </Field>
          )}
        />

        {deseaMejorar && (
          <Controller
            name="motivo_mejora"
            control={control}
            render={({ field }) => (
              <Field className="min-w-64 flex-1">
                <FieldLabel htmlFor={field.name}>
                  Motivo / Áreas de Mejora
                </FieldLabel>
                <Textarea {...field} id={field.name} />
              </Field>
            )}
          />
        )}
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
