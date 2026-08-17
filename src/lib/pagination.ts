interface PagedResult<T> {
  total: number
  items: T[]
}

// Trae todas las páginas de un listado paginado del backend, ya que la API
// no soporta filtrar por rango de fechas y no podemos asumir que todo cabe
// en una sola página.
export async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<PagedResult<T>>,
  limit = 100
): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let total = Infinity

  while (items.length < total) {
    const result = await fetchPage(page, limit)
    items.push(...result.items)
    total = result.total

    if (result.items.length === 0) break
    page += 1
  }

  return items
}
