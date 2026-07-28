'use server'

import { revalidatePath } from 'next/cache'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import {
  requireSession,
  withSessionRedirect,
} from '@/features/auth/services/session.service'

export async function deleteEntrepreneurAction(id: number) {
  const session = await requireSession()
  await withSessionRedirect(() => entrepreneurService.remove(id, session.token))
  revalidatePath('/emprendedores')
}
