// Tipo base compartido por la mayoría de catálogos
// NOTA: el backend es inconsistente en este campo: algunos endpoints devuelven
// 1/0 (number) y otros true/false (boolean). Se tipa como union para reflejar
// la realidad actual; normalizar a boolean en la capa de mapeo/servicio.
export interface CatalogoItem {
  id: number
  descripcion: string
  activo: boolean | number
}

// Catálogos que además incluyen orden de visualización
export interface CatalogoItemConOrden extends CatalogoItem {
  orden: number
}

// Caso especial: cat_rango_edad
export interface RangoEdadItem {
  id: number
  codigo: string
  descripcion: string
  edad_min: number
  edad_max: number
  activo: boolean | number
}

export interface TemaAsistenciaItem extends CatalogoItem {
  id_area: number
}

export interface CatalogoResponse<T = CatalogoItem> {
  total: number
  data: T[]
}
