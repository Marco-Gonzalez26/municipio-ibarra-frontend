# Cómo agregar un reporte nuevo

Un reporte nuevo = un objeto en el arreglo `REPORTS` de `src/features/reportes/config/reports.config.ts`. No se crea página, ruta ni plantilla PDF nueva: `/reportes`, `/reportes/[slug]` y `/api/reportes/[slug]/pdf` ya sirven cualquier reporte que esté en ese registro.

## Estructura mínima

```ts
{
  slug: 'mi-reporte',            // usado en la URL: /reportes/mi-reporte
  title: 'Título visible',
  description: 'Una línea, aparece en la card y en el header del PDF.',
  icon: AlgunIconoDeLucide,      // import { X } from 'lucide-react'
  fetchRows: async (filters, token) => {
    // filters: { desde?: string; hasta?: string } (YYYY-MM-DD)
    // retorna el arreglo de registros ya filtrado por fecha
  },
  summarize: (rows) => [
    { label: 'Total de algo', value: rows.length },
  ],
}
```

`fetchRows` y `summarize` son obligatorios. `breakdowns` y `columns` son opcionales — si no los defines, el PDF solo muestra el resumen.

## `fetchRows`: traer y filtrar los datos

La API del backend no soporta filtrar por fecha, así que hay que traer todo y filtrar en este lado.

- `fetchAllPages` (`src/lib/pagination.ts`) pagina un endpoint hasta agotar `total`. Recibe una función `(page, limit) => Promise<{ total, items }>`.
- `isWithinDateRange(fechaIso, desde?, hasta?)` (`src/lib/date.ts`) compara un timestamp ISO contra el rango.

```ts
fetchRows: async (filters, token) => {
  const rows = await fetchAllPages<MiTipo>((page, limit) =>
    miServicio.getAll(page, limit, token).then((res) => ({
      total: res.total,
      items: res.data,
    }))
  )

  return rows.filter((row) =>
    isWithinDateRange(row.fecha_registro, filters.desde, filters.hasta)
  )
}
```

Si necesitas cruzar datos de otro endpoint (join), hazlo aquí mismo y devuelve el objeto ya enriquecido. Ejemplo real en `reports.config.ts`, reporte `emprendimientos`: trae también todos los emprendedores, arma un `Map<id, nombre>` y le agrega `nombre_emprendedor` a cada fila antes de retornarla.

## `summarize`: el total

Recibe las filas que devolvió `fetchRows` (tipadas como `unknown[]`, hay que castear) y retorna una lista de `{ label, value }`. Puede tener más de un ítem si quieres mostrar varios totales.

```ts
summarize: (rows) => [{ label: 'Total de registros', value: rows.length }]
```

## `breakdowns` (opcional): desglose por categoría

Función `async (rows, token) => ReportBreakdown[]`, con `ReportBreakdown = { title: string; items: { label, value }[] }`. Recibe `token` porque normalmente necesita traer un catálogo del backend (género, sector, etc.).

Antes de escribir un agrupador nuevo, revisa `src/features/dashboard/utils/dashboard.utils.ts` — ya tiene `buildGenderChart`, `buildAgeChart`, `buildParishChart`, `buildSectorChart`, todos con la firma `(filas, catálogo?) => { label, value }[]`. Reutilízalos si el dato que quieres desglosar ya está cubierto ahí.

```ts
breakdowns: async (rows, token) => {
  const filas = rows as MiTipo[]
  const catalogo = await api.get<CatalogoResponse>('/mi-catalogo', { token })

  return [
    { title: 'Por categoría X', items: buildXChart(filas, catalogo.data) },
  ]
}
```

## `columns` (opcional): tabla detallada

Arreglo de `{ header: string; accessor: (row: unknown) => string }`. Cada `accessor` castea `row` a tu tipo y devuelve el valor como string (formatea fechas con `toLocalDate` de `src/lib/date.ts`).

```ts
columns: [
  { header: 'Nombre', accessor: (row) => (row as MiTipo).nombre },
  {
    header: 'Fecha',
    accessor: (row) => toLocalDate((row as MiTipo).fecha_registro),
  },
]
```

Si no se define `columns`, el PDF omite la sección "Listado detallado".

## Dónde no tocar código

- `src/features/reportes/services/reportes.service.ts` — orquesta `fetchRows` → `summarize`/`breakdowns`/`columns`, ya funciona para cualquier reporte del registro.
- `src/features/reportes/pdf/report-document.tsx` — plantilla PDF compartida (`@react-pdf/renderer`). Solo se edita si necesitas un elemento visual que ningún reporte tiene hoy (ej. un gráfico, no solo tablas de texto) — el cambio afecta a todos los reportes.
- `src/app/(dashboard)/reportes/page.tsx`, `src/app/(dashboard)/reportes/[slug]/page.tsx`, `src/app/api/reportes/[slug]/pdf/route.tsx` — genéricos, leen el registro por `slug`.

## Checklist para un reporte nuevo

1. Agregar el objeto al arreglo `REPORTS` en `reports.config.ts`.
2. Definir `fetchRows` reutilizando `fetchAllPages` + `isWithinDateRange`.
3. Definir `summarize`.
4. (Opcional) Definir `breakdowns`, reutilizando los `buildXChart` de `dashboard.utils.ts` si aplica.
5. (Opcional) Definir `columns` para la tabla detallada.
6. `npx tsc --noEmit` para verificar los casteos de `unknown` a tu tipo.
7. Probar en `/reportes/<slug>` y descargar el PDF.
