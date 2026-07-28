import { Card, CardContent } from '@/components/ui/card'
import type {
  DashboardIconProps,
  DashboardTone,
} from '@/features/dashboard/types/dashboard.type'
import type { ComponentType } from 'react'

interface DashboardCardProps {
  title: string
  value: number
  description: string
  tone: DashboardTone
  icon: ComponentType<DashboardIconProps>
}

const dashboardToneStyles: Record<
  DashboardTone,
  {
    accent: string
    iconContainer: string
    icon: string
    value: string
  }
> = {
  blue: {
    accent: 'bg-blue-500',
    iconContainer: 'border-blue-100 bg-blue-50',
    icon: 'text-blue-600',
    value: 'text-blue-700',
  },
  green: {
    accent: 'bg-emerald-500',
    iconContainer: 'border-emerald-100 bg-emerald-50',
    icon: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  violet: {
    accent: 'bg-violet-500',
    iconContainer: 'border-violet-100 bg-violet-50',
    icon: 'text-violet-600',
    value: 'text-violet-700',
  },
  amber: {
    accent: 'bg-amber-500',
    iconContainer: 'border-amber-100 bg-amber-50',
    icon: 'text-amber-600',
    value: 'text-amber-700',
  },
  rose: {
    accent: 'bg-rose-500',
    iconContainer: 'border-rose-100 bg-rose-50',
    icon: 'text-rose-600',
    value: 'text-rose-700',
  },
}

export function DashboardCard({
  title,
  value,
  description,
  tone,
  icon: Icon,
}: DashboardCardProps) {
  const toneStyles = dashboardToneStyles[tone]

  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${toneStyles.accent}`}
        aria-hidden="true"
      />

      <CardContent className="flex min-h-36 items-center gap-4 p-5">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${toneStyles.iconContainer}`}
        >
          <Icon className={`size-5 ${toneStyles.icon}`} aria-hidden={true} />
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-tight text-muted-foreground">{title}</p>

          <p
            className={`mt-1.5 text-3xl font-bold tracking-tight ${toneStyles.value}`}
          >
            {value.toLocaleString('es-EC')}
          </p>

          <p className="mt-1.5 text-xs leading-tight text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
