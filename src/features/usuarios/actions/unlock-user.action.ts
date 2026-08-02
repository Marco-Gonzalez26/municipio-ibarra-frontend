'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'
import { userService } from '../services/user.service'

export type UnlockUserResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      message: string
    }

export async function unlockUserAction(
  userId: number
): Promise<UnlockUserResult> {
  try {
    const session = await requireAdmin()

    // Validacion extra, solo el rol ADMIN puede desbloquear a un usuario
    const isAdmin =
      session.usuario.rol?.codigo === 'ADMIN' &&
      session.usuario.rol.es_admin === true

    if (!isAdmin) {
      return {
        success: false,
        message: 'No tienes permisos para desbloquear usuarios.',
      }
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return {
        success: false,
        message: 'El usuario seleccionado no es válido.',
      }
    }

    const response = await userService.resetAttempts(userId, session.token)

    revalidatePath('/usuarios')

    return {
      success: true,
      message: response.msg || 'Usuario desbloqueado correctamente.',
    }
  } catch (error) {
    console.error('No se pudo desbloquear el usuario', error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No se pudo desbloquear el usuario.',
    }
  }
}
