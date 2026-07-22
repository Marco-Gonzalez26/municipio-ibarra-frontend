import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { DashboardIconProps } from '@/features/dashboard/types/dashboard.type'
import type { ComponentType, ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description: string
  icon: ComponentType<DashboardIconProps>
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  icon: Icon,
  children,
}: ChartCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>

            <CardDescription className="mt-1">{description}</CardDescription>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/10 transition-transform duration-200 group-hover:scale-105">
            <Icon className="size-4 text-primary" aria-hidden={true} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}
