import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getSession, requireSession } from '@/features/auth/services/session.service'
import { getReportDefinition } from '@/features/reportes/config/reports.config'
import { ReportFiltersForm } from '@/features/reportes/components/report-filters-form'

interface ReportPageProps {
  params: Promise<{ slug: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params
  await requireSession()

  const report = getReportDefinition(slug)
  if (!report) {
    notFound()
  }

  let entityOptions: { value: string; label: string }[] | undefined
  let entitySelector:
    | { paramName: string; label: string; placeholder: string }
    | undefined

  if (report.entitySelector) {
    const session = await getSession()
    if (session) {
      try {
        entityOptions = await report.entitySelector.fetchOptions(session.token)
      } catch {
        entityOptions = []
      }
    }
    entitySelector = {
      paramName: report.entitySelector.paramName,
      label: report.entitySelector.label,
      placeholder: report.entitySelector.placeholder,
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">{report.title}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Link
          href="/reportes"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a reportes
        </Link>

        <p className="text-sm text-muted-foreground">{report.description}</p>

        <ReportFiltersForm
          slug={report.slug}
          entitySelector={entitySelector}
          entityOptions={entityOptions}
        />
      </div>
    </>
  )
}
