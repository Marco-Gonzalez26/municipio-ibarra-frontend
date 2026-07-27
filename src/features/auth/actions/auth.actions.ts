'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { authService } from '../services/auth.service'
import { roleService } from '../services/role.service'
import { SESSION_COOKIE } from '../constants'

import type { AuthUser, LoginCredentials, Role } from '../types/auth.type'

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

  const [rolesResponse, userRolesResponse] = await Promise.all([
    roleService.getRoles(response.token),
    roleService.getUserRoles(response.token),
  ])

  const activeAssignment = userRolesResponse.data.find(
    (assignment) =>
      assignment.id_usuario === response.usuario.id && assignment.activo === 1
  )

  const assignedRole: Role | null = activeAssignment
    ? (rolesResponse.data.find(
        (role) => role.id === activeAssignment.id_rol && role.activo
      ) ?? null)
    : null

  const authenticatedUser: AuthUser = {
    ...response.usuario,
    rol: assignedRole,
  }

  const cookieStore = await cookies()

  const sessionValue = JSON.stringify({
    token: response.token,
    usuario: authenticatedUser,
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
