
import type { CatalogoItem } from '@/types/catalog.type'

export interface CatalogoItemConCodigoOrden extends CatalogoItem {
  codigo: string
  orden: number
}

export interface CatalogoEstadoModelo extends CatalogoItemConCodigoOrden {
   es_terminal: boolean | number
}
