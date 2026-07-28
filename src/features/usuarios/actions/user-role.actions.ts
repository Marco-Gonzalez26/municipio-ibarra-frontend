'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/features/auth/services/session.service'

import { userRoleService } from '../services/user-role.service'

import type {
  CreateUserRoleDTO,
  UpdateUserRoleDTO,
} from '../types/user-role.type'

export async function createUserRoleAction(
  payload: Omit<CreateUserRoleDTO, 'asignado_por'>
) {
  const session = await requireAdmin()

  const response = await userRoleService.createAssignment(
    {
      ...payload,
      asignado_por: session.usuario.id,
    },
    session.token
  )

  revalidatePath('/usuarios')

  return response
}

export async function updateUserRoleAction(
  assignmentId: number,
  payload: Omit<UpdateUserRoleDTO, 'asignado_por'>
) {
  const session = await requireAdmin()

  const response = await userRoleService.updateAssignment(
    assignmentId,
    {
      ...payload,
      asignado_por: session.usuario.id,
    },
    session.token
  )

  revalidatePath('/usuarios')

  return response
}

export async function deleteUserRoleAction(assignmentId: number) {
  const session = await requireAdmin()

  const response = await userRoleService.deleteAssignment(
    assignmentId,
    session.token
  )

  revalidatePath('/usuarios')

  return response
}
