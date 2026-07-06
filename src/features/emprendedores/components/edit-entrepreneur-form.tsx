'use client'

import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { updateEntrepreneurAction } from '@/features/emprendedores/actions/update-entrepreneur.action'
import type {
  Emprendedor,
  EmprendedorCreateDTO,
} from '@/types/entrepreneur.type'

function toInputDate(value?: string | Date | null) {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().split('T')[0]
}

interface EditEntrepreneurFormProps {
  entrepreneur: Emprendedor
}

type EditEntrepreneurFormValues = Omit<
  EmprendedorCreateDTO,
  'fecha_nacimiento'
> & {
  fecha_nacimiento: string
  activo: boolean
}

export function EditEntrepreneurForm({
  entrepreneur,
}: EditEntrepreneurFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<EditEntrepreneurFormValues>({
    defaultValues: {
      ...entrepreneur,
      activo: entrepreneur.activo,
      fecha_nacimiento: toInputDate(entrepreneur.fecha_nacimiento),
    },
  })

  async function onSubmit(values: EditEntrepreneurFormValues) {
    const payload: EmprendedorCreateDTO = {
      ...values,
      fecha_nacimiento: values.fecha_nacimiento,
      edad: Number(values.edad),
      cantidad_cargas_familiares: Number(values.cantidad_cargas_familiares),
      cargas_con_discapacidad: Number(values.cargas_con_discapacidad),
      id_estado_civil: Number(values.id_estado_civil),
      id_genero: Number(values.id_genero),
      id_etnia: Number(values.id_etnia),
      id_nivel_estudios: Number(values.id_nivel_estudios),
      id_ocupacion: Number(values.id_ocupacion),
      id_nivel_ingresos: Number(values.id_nivel_ingresos),
      id_rango_edad: Number(values.id_rango_edad),
      id_tipo_discapacidad: values.id_tipo_discapacidad ?? null,
      porcentaje_discapacidad: values.porcentaje_discapacidad ?? null,
      numero_carnet_discapacidad: values.numero_carnet_discapacidad ?? null,
      etnia_otra: values.etnia_otra ?? null,
      ocupacion_otra: values.ocupacion_otra ?? null,
      titulo_profesional: values.titulo_profesional ?? null,
    }

    try {
      await updateEntrepreneurAction(entrepreneur.id, payload)
      toast.success('Emprendedor actualizado', {
        description: 'Los cambios se guardaron correctamente.',
      })
      router.push('/emprendedores')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el emprendedor', {
        description: 'Intente nuevamente más tarde.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>
            Actualiza los datos generales del emprendedor.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={Boolean(errors.nombres_apellidos)}>
            <FieldLabel htmlFor="nombres_apellidos">
              Nombres y apellidos
            </FieldLabel>
            <Input
              id="nombres_apellidos"
              {...register('nombres_apellidos', {
                required: 'Este campo es obligatorio',
              })}
            />
            {errors.nombres_apellidos && (
              <FieldError errors={[errors.nombres_apellidos]} />
            )}
          </Field>

          <Field data-invalid={Boolean(errors.cedula)}>
            <FieldLabel htmlFor="cedula">Cédula</FieldLabel>
            <Input
              id="cedula"
              {...register('cedula', {
                required: 'Este campo es obligatorio',
              })}
            />
            {errors.cedula && <FieldError errors={[errors.cedula]} />}
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingrese un correo válido',
                },
              })}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          <Field data-invalid={Boolean(errors.celular)}>
            <FieldLabel htmlFor="celular">Celular</FieldLabel>
            <Input
              id="celular"
              {...register('celular', {
                required: 'Este campo es obligatorio',
              })}
            />
            {errors.celular && <FieldError errors={[errors.celular]} />}
          </Field>

          <Field data-invalid={Boolean(errors.nacionalidad)}>
            <FieldLabel htmlFor="nacionalidad">Nacionalidad</FieldLabel>
            <Input
              id="nacionalidad"
              {...register('nacionalidad', {
                required: 'Este campo es obligatorio',
              })}
            />
            {errors.nacionalidad && (
              <FieldError errors={[errors.nacionalidad]} />
            )}
          </Field>

          <Field data-invalid={Boolean(errors.fecha_nacimiento)}>
            <FieldLabel htmlFor="fecha_nacimiento">
              Fecha de nacimiento
            </FieldLabel>
            <Input
              id="fecha_nacimiento"
              type="date"
              {...register('fecha_nacimiento', {
                required: 'Este campo es obligatorio',
              })}
            />
            {errors.fecha_nacimiento && (
              <FieldError errors={[errors.fecha_nacimiento]} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="edad">Edad</FieldLabel>
            <Input id="edad" type="number" {...register('edad')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="ciudad">Ciudad</FieldLabel>
            <Input id="ciudad" {...register('ciudad')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="parroquia">Parroquia</FieldLabel>
            <Input id="parroquia" {...register('parroquia')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="barrio_comunidad">
              Barrio o comunidad
            </FieldLabel>
            <Input id="barrio_comunidad" {...register('barrio_comunidad')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="calle_numero">Calle y número</FieldLabel>
            <Input id="calle_numero" {...register('calle_numero')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="calle_secundaria">Calle secundaria</FieldLabel>
            <Input id="calle_secundaria" {...register('calle_secundaria')} />
          </Field>

          <Field>
            <FieldLabel htmlFor="cantidad_cargas_familiares">
              Cargas familiares
            </FieldLabel>
            <Input
              id="cantidad_cargas_familiares"
              type="number"
              {...register('cantidad_cargas_familiares')}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cargas_con_discapacidad">
              Cargas con discapacidad
            </FieldLabel>
            <Input
              id="cargas_con_discapacidad"
              type="number"
              {...register('cargas_con_discapacidad')}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="titulo_profesional">
              Título profesional
            </FieldLabel>
            <Input
              id="titulo_profesional"
              {...register('titulo_profesional')}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado del registro</CardTitle>
          <CardDescription>
            Ajusta el estado de activación del emprendedor.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between   p-4">
          <div>
            <p className="font-medium">Activo</p>
            <p className="text-sm text-muted-foreground">
              Indica si el emprendedor se encuentra habilitado en el sistema.
            </p>
          </div>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end gap-2 px-4 py-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando' : 'Guardar cambios'}
        </Button>
      </CardFooter>
    </form>
  )
}
