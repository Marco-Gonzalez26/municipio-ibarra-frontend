import { EmptyChart } from '@/features/dashboard/components/empty-chart'
import type { ChartItem } from '@/features/dashboard/types/dashboard.type'

export function VerticalBarChart({ data }: { data: ChartItem[] }) {
  if (data.length === 0) {
    return <EmptyChart />
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="relative flex min-h-72 items-end justify-between gap-2 pt-5">
      {data.map((item) => {
        const heightPercentage = (item.value / maxValue) * 100

        return (
          <div
            key={item.label}
            className="group/bar relative z-10 flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="rounded-md bg-background px-2 py-0.5 text-xs font-semibold shadow-sm ring-1 ring-border transition-colors group-hover/bar:text-primary">
              {item.value}
            </span>

            <div className="relative flex h-52 w-full items-end justify-center overflow-hidden rounded-lg border bg-muted/20 px-2">
              <div
                className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-primary to-primary/70 transition-all duration-500 group-hover/bar:brightness-110"
                style={{
                  height: `${Math.max(
                    heightPercentage,
                    item.value > 0 ? 8 : 0
                  )}%`,
                }}
                role="img"
                aria-label={`${item.label}: ${item.value}`}
              />
            </div>

            <span
              className="min-h-8 max-w-full text-center text-xs leading-tight text-muted-foreground"
              title={item.label}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
