import { SidebarTrigger } from '@/components/ui/sidebar'
import { ReportesView } from '@/features/reportes/components/reportes-view'
import { REPORTS } from '@/features/reportes/config/reports.config'

export default async function DashboardReportesPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Reportes y Exportación</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-sm text-muted-foreground">
          Genera reportes personalizados y expórtalos en diferentes formatos.
        </p>

        <ReportesView reports={REPORTS} />
      </div>
    </>
  )
}
