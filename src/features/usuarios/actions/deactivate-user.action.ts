'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'
import { userService } from '../services/user.service'
import { userRoleService } from '../services/user-role.service'

export interface DeactivateUserInput {
  userId: number
  assignmentId: number | null
  idRol: number | null
  fechaAsignacion: string | null
  fechaExpiracion: string | null
}

export type DeactivateUserResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      message: string
    }

export async function deactivateUserAction(
  input: DeactivateUserInput
): Promise<DeactivateUserResult> {
  try {
    const session = await requireAdmin()

    if (!Number.isInteger(input.userId) || input.userId <= 0) {
      return {
        success: false,
        message: 'El usuario seleccionado no es válido.',
      }
    }

    if (input.userId === session.usuario.id) {
      return {
        success: false,
        message:
          'No puedes desactivar el usuario con el que tienes la sesión iniciada.',
      }
    }

    await userService.remove(input.userId, session.token)

    if (input.assignmentId && input.idRol) {
      await userRoleService.updateAssignment(
        input.assignmentId,
        {
          id_usuario: input.userId,
          id_rol: input.idRol,
          fecha_asignacion: input.fechaAsignacion ?? getCurrentDate(),
          fecha_expiracion: input.fechaExpiracion,
          asignado_por: session.usuario.id,
          activo: 0,
          observacion:
            'Asignación desactivada desde el módulo administrativo de usuarios',
        },
        session.token
      )
    }

    revalidatePath('/usuarios')

    return {
      success: true,
      message: 'Usuario desactivado correctamente.',
    }
  } catch (error) {
    console.error('No se pudo desactivar el usuario', error)

    return {
      success: false,
      message: getErrorMessage(error),
    }
  }
}

function getCurrentDate() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'Not Found') {
      return 'El backend no tiene configurada la ruta utilizada para desactivar usuarios.'
    }

    if (error.message) {
      return error.message
    }
  }

  return 'No se pudo desactivar el usuario.'
}
