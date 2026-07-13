import { EmptyChart } from '@/features/dashboard/components/empty-chart'
import type { ChartItem } from '@/features/dashboard/types/dashboard.type'

const palette = [
  'var(--primary)',
  'var(--muted-foreground)',
  'var(--accent-foreground)',
  'var(--secondary-foreground)',
]

export function PieChart({ data }: { data: ChartItem[] }) {
  const visibleData = data.filter((item) => item.value > 0)

  const total = visibleData.reduce(
    (accumulator, item) => accumulator + item.value,
    0
  )

  if (total === 0) {
    return <EmptyChart />
  }

  const { segments: gradientSegments } = visibleData.reduce<{
    accumulated: number
    segments: string[]
  }>(
    (result, item, index) => {
      const percentage = (item.value / total) * 100
      const start = result.accumulated
      const end = start + percentage

      return {
        accumulated: end,
        segments: [
          ...result.segments,
          `${palette[index % palette.length]} ${start}% ${end}%`,
        ],
      }
    },
    {
      accumulated: 0,
      segments: [],
    }
  )

  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-6">
      <div className="relative">
        <div
          className="size-48 rounded-full shadow-sm ring-1 ring-border"
          style={{
            background: `conic-gradient(${gradientSegments.join(', ')})`,
          }}
          role="img"
          aria-label="Distribución de emprendedores por género"
        />

        <div className="absolute inset-0 m-auto flex size-28 flex-col items-center justify-center rounded-full border bg-card shadow-sm">
          <span className="text-3xl font-bold tracking-tight">{total}</span>

          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {visibleData.map((item, index) => {
          const percentage = Math.round((item.value / total) * 100)

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: palette[index % palette.length],
                  }}
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </div>

              <span className="font-semibold">
                {item.value} ({percentage}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
