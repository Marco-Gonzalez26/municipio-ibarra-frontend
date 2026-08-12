'use server'

import { getSession } from '@/features/auth/services/session.service'
import { catalogService } from '@/features/modelo-negocio/services/sime.service'
import type { CatalogoItem } from '@/types/catalog.type'

export async function getCategoriasInsumo(): Promise<CatalogoItem[]> {
  const session = await getSession()
  if (!session) throw new Error('Sesión no encontrada')
  const res = await catalogService.getCategoriaInsumo(session.token)
  return res.data ?? []
}

export async function getUnidadesMedida(): Promise<CatalogoItem[]> {
  const session = await getSession()
  if (!session) throw new Error('Sesión no encontrada')
  const res = await catalogService.getUnidadMedida(session.token)
  return res.data ?? []
}

export async function getCategoriasInversion(): Promise<CatalogoItem[]> {
  const session = await getSession()
  if (!session) throw new Error('Sesión no encontrada')
  const res = await catalogService.getCategoriaInversion(session.token)
  return res.data ?? []
}
