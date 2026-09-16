'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { authService } from '../services/auth.service'
import { roleService } from '../services/role.service'
import { SESSION_COOKIE } from '../constants'
import { ApiError } from '@/lib/https'
import { formatDate, isDateExpired } from '@/lib/date'

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

export type LoginActionResult =
  | { success: true }
  | { success: false; message: string }

export async function loginAction(
  credentials: LoginCredentials
): Promise<LoginActionResult> {
  let response: Awaited<ReturnType<typeof authService.login>>
  try {
    response = await authService.login(credentials)
  } catch (error) {
    // Nunca se lanza: en producción Next.js redacta los mensajes de
    // errores de Server Actions, así que se devuelve el mensaje.
    if (error instanceof ApiError && error.status === 401) {
      return {
        success: false,
        message:
          'Usuario o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.',
      }
    }
    if (error instanceof ApiError && error.status === 403) {
      return {
        success: false,
        message:
          error.message ||
          'Acceso denegado para este usuario. Contacta al administrador.',
      }
    }
    return {
      success: false,
      message:
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
    }
  }

  let rolesResponse: Awaited<ReturnType<typeof roleService.getRoles>>
  let userRolesResponse: Awaited<ReturnType<typeof roleService.getUserRoles>>
  try {
    ;[rolesResponse, userRolesResponse] = await Promise.all([
      roleService.getRoles(response.token),
      roleService.getUserRoles(response.token),
    ])
  } catch (error) {
    return {
      success: false,
      message:
        'Tus credenciales son válidas, pero no se pudieron cargar tus permisos. ' +
        (error instanceof Error && error.message
          ? `Detalle: ${error.message}`
          : 'Intenta de nuevo o contacta al administrador.'),
    }
  }

  const activeAssignment = userRolesResponse.data.find(
    (assignment) =>
      assignment.id_usuario === response.usuario.id && assignment.activo === 1
  )

  const assignedRole: Role | null = activeAssignment
    ? (rolesResponse.data.find(
        (role) => role.id === activeAssignment.id_rol && role.activo
      ) ?? null)
    : null

  // El rol vencido niega el acceso por completo.
  if (activeAssignment && isDateExpired(activeAssignment.fecha_expiracion)) {
    return {
      success: false,
      message: `Tu rol venció el ${formatDate(activeAssignment.fecha_expiracion, '-')}. Contacta al administrador para renovar tu acceso.`,
    }
  }

  const authenticatedUser: AuthUser = {
    ...response.usuario,
    rol: assignedRole,
    rolVenceEl: activeAssignment?.fecha_expiracion ?? null,
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

  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/iniciar-sesion')
}
