'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'
import { userRoleService } from '@/features/usuarios/services/user-role.service'
import { userService } from '@/features/usuarios/services/user.service'

export interface CreateUserWithRoleInput {
  cuenta: string
  correo: string
  contrasena: string
  nombres: string
  apellidos: string
  idRol: number
  fechaVigenciaDesde: string
  fechaVigenciaHasta: string | null
  activo: boolean
}

export type CreateUserWithRoleResult =
  | {
      success: true
      message: string
      userId: number
    }
  | {
      success: false
      message: string
      userId?: number
    }

export async function createUserWithRoleAction(
  input: CreateUserWithRoleInput
): Promise<CreateUserWithRoleResult> {
  try {
    const session = await requireAdmin()

    const cuenta = input.cuenta.trim()
    const correo = input.correo.trim().toLowerCase()
    const nombres = input.nombres.trim()
    const apellidos = input.apellidos.trim()

    if (!cuenta || !correo || !input.contrasena || !nombres || !apellidos) {
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

    const userResponse = await userService.create(
      {
        cuenta,
        correo,
        contrasena: input.contrasena,
        id_estado: 1,
        fecha_vigencia_desde: input.fechaVigenciaDesde,
        fecha_vigencia_hasta: input.fechaVigenciaHasta || null,
        nombres,
        apellidos,
        intentos_fallidos: 0,
        requiere_cambio_pass: true,
        activo: input.activo,
      },
      session.token
    )

    const createdUser = userResponse.data

    if (!createdUser?.id) {
      return {
        success: false,
        message:
          'El usuario fue enviado al servidor, pero la API no devolvió su identificador.',
      }
    }

    try {
      await userRoleService.createAssignment(
        {
          id_usuario: createdUser.id,
          id_rol: input.idRol,
          fecha_asignacion: getCurrentDate(),
          fecha_expiracion: input.fechaVigenciaHasta || null,
          asignado_por: session.usuario.id,
          activo: input.activo ? 1 : 0,
          observacion:
            'Rol asignado desde el módulo administrativo de usuarios',
        },
        session.token
      )
    } catch (roleError) {
      console.error(
        'El usuario fue creado, pero no se pudo asignar el rol',
        roleError
      )

      revalidatePath('/usuarios')

      return {
        success: false,
        userId: createdUser.id,
        message:
          `El usuario USR-${createdUser.id} fue creado, pero no se pudo asignar el rol. ` +
          'No vuelvas a crearlo; revisa la asignación de rol.',
      }
    }

    revalidatePath('/usuarios')

    return {
      success: true,
      userId: createdUser.id,
      message: 'Usuario y rol creados correctamente.',
    }
  } catch (error) {
    console.error('No se pudo crear el usuario', error)

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

  return 'No se pudo crear el usuario. Revisa los datos e intenta nuevamente.'
}
