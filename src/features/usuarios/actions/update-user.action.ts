'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'
import { userService } from '../services/user.service'
import { userRoleService } from '../services/user-role.service'

export interface UpdateUserWithRoleInput {
  id: number
  cuenta: string
  correo: string
  nombres: string
  apellidos: string
  idRol: number
  assignmentId: number | null
  fechaAsignacion: string | null
  fechaExpiracion: string | null
  activo: boolean
}

export type UpdateUserWithRoleResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      message: string
    }

export async function updateUserWithRoleAction(
  input: UpdateUserWithRoleInput
): Promise<UpdateUserWithRoleResult> {
  try {
    const session = await requireAdmin()

    const cuenta = input.cuenta.trim()
    const correo = input.correo.trim().toLowerCase()
    const nombres = input.nombres.trim()
    const apellidos = input.apellidos.trim()

    if (!cuenta || !correo || !nombres || !apellidos) {
      return {
        success: false,
        message: 'Completa todos los campos obligatorios.',
      }
    }

    if (!Number.isInteger(input.idRol) || input.idRol <= 0) {
      return {
        success: false,
        message: 'Selecciona un rol válido.',
      }
    }

    await userService.update(
      input.id,
      {
        cuenta,
        correo,
        nombres,
        apellidos,
      },
      session.token
    )

    const fechaAsignacion = input.fechaAsignacion ?? getCurrentDate()

    if (input.assignmentId) {
      await userRoleService.updateAssignment(
        input.assignmentId,
        {
          id_usuario: input.id,
          id_rol: input.idRol,
          fecha_asignacion: fechaAsignacion,
          fecha_expiracion: input.fechaExpiracion,
          asignado_por: session.usuario.id,
          activo: input.activo ? 1 : 0,
          observacion:
            'Asignación actualizada desde el módulo administrativo de usuarios',
        },
        session.token
      )
    } else {
      await userRoleService.createAssignment(
        {
          id_usuario: input.id,
          id_rol: input.idRol,
          fecha_asignacion: fechaAsignacion,
          fecha_expiracion: input.fechaExpiracion,
          asignado_por: session.usuario.id,
          activo: input.activo ? 1 : 0,
          observacion:
            'Rol asignado desde el módulo administrativo de usuarios',
        },
        session.token
      )
    }

    revalidatePath('/usuarios')

    return {
      success: true,
      message: 'Usuario actualizado correctamente.',
    }
  } catch (error) {
    console.error('No se pudo actualizar el usuario', error)

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
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'No se pudo actualizar el usuario.'
}
