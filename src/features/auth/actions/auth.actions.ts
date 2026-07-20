'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authService } from '../services/auth.service'
import { SESSION_COOKIE } from '../constants'
import type { LoginCredentials } from '../types/auth.type'

function getTokenExpiry(token: string): Date | undefined {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf-8')
    )
    return typeof payload.exp === 'number'
      ? new Date(payload.exp * 1000)
      : undefined
  } catch {
    return undefined
  }
}

export async function loginAction(credentials: LoginCredentials) {
  const response = await authService.login(credentials)
  const cookieStore = await cookies()

  const sessionValue = JSON.stringify({
    token: response.token,
    usuario: response.usuario,
  })

  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: getTokenExpiry(response.token),
  })
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/iniciar-sesion')
}
