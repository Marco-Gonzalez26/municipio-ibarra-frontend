'use server'

import { revalidatePath } from 'next/cache'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'

export async function deleteEntrepreneurAction(id: number) {
  await entrepreneurService.remove(id)
  revalidatePath('/emprendedores')
}
