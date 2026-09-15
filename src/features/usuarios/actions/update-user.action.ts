'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'
import { userService } from '../services/user.service'
import { userRoleService } from '../services/user-role.service'
import { perfilService } from '../services/perfil.service'

export interface UpdateUserWithRoleInput {
  id: number
  cuenta: string
  correo: string
  nombres: string
  apellidos: string
  idRol: number
  cargo?: string | null
  perfilId?: number | null
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

    // Sincroniza el cargo en perfilusuario: PUT si ya tiene perfil,
    // POST si no. No bloquea el éxito si el backend lo rechaza.
    const cargo = input.cargo?.trim() || null
    const perfilResult = await Promise.allSettled([
      input.perfilId
        ? perfilService.update(input.perfilId, { cargo }, session.token)
        : perfilService.create(
            {
              id_usuario: input.id,
              dependencia: 'Unidad de Desarrollo Económico',
              cargo,
              idioma: 'es-EC',
              zona_horaria: 'America/Guayaquil',
            },
            session.token
          ),
    ])
    if (perfilResult[0].status === 'rejected') {
      console.error(
        `El usuario USR-${input.id} fue actualizado, pero no se pudo sincronizar su perfil`,
        perfilResult[0].reason
      )
    }

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
