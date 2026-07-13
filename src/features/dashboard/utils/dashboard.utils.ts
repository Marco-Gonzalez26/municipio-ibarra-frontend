import type { Emprendedor } from '@/types/entrepreneur.type'
import type {
  CatalogItem,
  ChartItem,
  FormularioSector,
} from '@/features/dashboard/types/dashboard.type'

function getAgeRange(age: number) {
  if (age >= 18 && age <= 28) return '18-28'
  if (age >= 29 && age <= 40) return '29-40'
  if (age >= 41 && age <= 50) return '41-50'
  if (age >= 51) return '51 o más'

  return 'Sin especificar'
}

function normalizeParishName(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase()

  const knownNames: Record<string, string> = {
    'rio verde': 'Río Verde',
    chiguilpe: 'Chiguilpe',
    daule: 'Daule',
    tarqui: 'Tarqui',
    priorato: 'Priorato',
    alpachaca: 'Alpachaca',
    caranqui: 'Caranqui',
    'san francisco': 'San Francisco',
    'el sagrario': 'El Sagrario',
  }

  if (knownNames[normalized]) {
    return knownNames[normalized]
  }

  return normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Guayaquil',
  }).format(date)
}

export function buildGenderChart(
  emprendedores: Emprendedor[],
  catalogo: CatalogItem[]
): ChartItem[] {
  const genderMap = new Map(
    catalogo.map((genero) => [genero.id, genero.descripcion])
  )

  return Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const genero = genderMap.get(emprendedor.id_genero) ?? 'Sin especificar'

      accumulator[genero] = (accumulator[genero] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort((first, second) => second.value - first.value)
}

export function buildAgeChart(emprendedores: Emprendedor[]): ChartItem[] {
  const ageOrder = ['18-28', '29-40', '41-50', '51 o más', 'Sin especificar']

  return Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const edad = Number(emprendedor.edad)

      const rango = Number.isFinite(edad)
        ? getAgeRange(edad)
        : 'Sin especificar'

      accumulator[rango] = (accumulator[rango] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort(
      (first, second) =>
        ageOrder.indexOf(first.label) - ageOrder.indexOf(second.label)
    )
}

export function buildSectorChart(
  formularios: FormularioSector[],
  catalogo: CatalogItem[]
): ChartItem[] {
  const sectorMap = new Map(
    catalogo.map((sector) => [sector.id, sector.descripcion])
  )

  return Object.entries(
    formularios.reduce<Record<string, number>>((accumulator, formulario) => {
      const sector =
        formulario.id_sector === 19 && formulario.sector_otro?.trim()
          ? formulario.sector_otro.trim()
          : (sectorMap.get(formulario.id_sector) ?? 'Sin especificar')

      accumulator[sector] = (accumulator[sector] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)
}

export function buildParishChart(emprendedores: Emprendedor[]): ChartItem[] {
  return Object.entries(
    emprendedores.reduce<Record<string, number>>((accumulator, emprendedor) => {
      const rawParish = emprendedor.parroquia?.trim()

      const parroquia = rawParish
        ? normalizeParishName(rawParish)
        : 'Sin especificar'

      accumulator[parroquia] = (accumulator[parroquia] ?? 0) + 1

      return accumulator
    }, {})
  )
    .map(([label, value]) => ({
      label,
      value,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 5)
}
