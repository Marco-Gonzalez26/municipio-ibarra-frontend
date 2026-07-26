import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ApiError } from '@/lib/https'
import { SESSION_COOKIE } from '../constants'
import type { Session } from '../types/auth.type'

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value

  if (!raw) return null

  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

// Las Server Actions no pasan por proxy.ts, así que revalidan la sesión aquí.
export async function requireSession(redirectTo?: string): Promise<Session> {
  const session = await getSession()
  if (!session) {
    const redirectUrl = redirectTo
      ? `/iniciar-sesion?redirect_url=${encodeURIComponent(redirectTo)}`
      : '/iniciar-sesion'
    redirect(redirectUrl)
  }
  return session
}

// El backend responde 401 tanto si falta el token como si expiró.
// No se borra la cookie aquí: Next.js no permite modificar cookies desde un
// Server Component, solo redirigir. El próximo login la sobrescribe igual.
export async function withSessionRedirect<T>(
  request: () => Promise<T>
): Promise<T> {
  try {
    return await request()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect('/iniciar-sesion')
    }
    throw error
  }
}
