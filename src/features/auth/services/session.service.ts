import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ApiError } from '@/lib/https'
import { isDateExpired } from '@/lib/date'
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

// true si la sesión tiene rol con fecha de vencimiento pasada.
// Las sesiones emitidas antes de rolVenceEl se consideran vigentes.
export function isSessionRoleExpired(session: Session): boolean {
  if (!session.usuario.rol) return false
  return isDateExpired(session.usuario.rolVenceEl)
}

// Las Server Actions no pasan por proxy.ts, así que revalidan la sesión aquí.
export async function requireSession(redirectTo?: string): Promise<Session> {
  const session = await getSession()
  if (!session || isSessionRoleExpired(session)) {
    const redirectUrl = redirectTo
      ? `/iniciar-sesion?redirect_url=${encodeURIComponent(redirectTo)}`
      : '/iniciar-sesion'
    redirect(redirectUrl)
  }
  return session
}
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession('/usuarios')

  if (
    isSessionRoleExpired(session) ||
    session.usuario.rol?.codigo !== 'ADMIN'
  ) {
    redirect('/inicio')
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
