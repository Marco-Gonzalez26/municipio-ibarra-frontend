import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { ReportDefinition } from '@/features/reportes/types/report.type'

export function ReportesView({ reports }: { reports: ReportDefinition[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Link key={report.slug} href={`/reportes/${report.slug}`}>
          <Card className="group h-full border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 transition-transform duration-200 group-hover:scale-105">
                <report.icon className="size-5 text-blue-600" aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium">{report.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>

              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
