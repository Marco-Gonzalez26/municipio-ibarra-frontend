'use client'

import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { LoginForm } from '../types/login-form.type'
import { login } from '@/features/dashboard/services/auth.service'

export const Login = () => {
  const router = useRouter()
  const { handleSubmit } = useForm<LoginForm>({})

  async function onSubmit(data: LoginForm) {
    await login(data)
    router.push('/inicio')
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-xl border bg-card p-6 text-left shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="text"
            name="user"
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <Button type="submit" size="lg" className="hover:cursor-pointer">
          Ingresar
        </Button>
      </form>
      <div className="mt-4 flex gap-x-4">
        <Link href="/">Volver al inicio</Link>
        <Link href="/registro">No tienes cuenta? Regístrate</Link>
      </div>
    </div>
  )
}
