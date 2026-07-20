'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginAction } from '../actions/auth.actions'
import type { LoginCredentials } from '../types/auth.type'

export const Login = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>()

  async function onSubmit(data: LoginCredentials) {
    try {
      await loginAction(data)
      router.push('/inicio')
    } catch (error) {
      toast.error('No se pudo iniciar sesión', {
        description:
          error instanceof Error
            ? error.message
            : 'Intente nuevamente más tarde.',
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/escudo-ibarra.png"
          alt="Escudo de la Municipalidad de Ibarra"
          width={72}
          height={72}
          className="h-16 w-auto object-contain"
          priority
        />
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accede al sistema de gestión de emprendedores
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field data-invalid={Boolean(errors.identificador)}>
          <FieldLabel htmlFor="identificador">
            Usuario o correo electrónico
          </FieldLabel>
          <Input
            id="identificador"
            autoComplete="username"
            {...register('identificador', {
              required: 'Este campo es obligatorio',
            })}
          />
          {errors.identificador && (
            <FieldError errors={[errors.identificador]} />
          )}
        </Field>

        <Field data-invalid={Boolean(errors.contrasena)}>
          <FieldLabel htmlFor="contrasena">Contraseña</FieldLabel>
          <div className="relative">
            <Input
              id="contrasena"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="pr-9"
              {...register('contrasena', {
                required: 'Este campo es obligatorio',
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.contrasena && <FieldError errors={[errors.contrasena]} />}
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Volver al inicio
        </Link>
        <button
          type="button"
          onClick={() => toast.info('En proceso de implementación...')}
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  )
}
