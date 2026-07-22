import { SidebarTrigger } from '@/components/ui/sidebar'

export default function ModeloMarketingPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-sm font-medium">Asesorías · Modelo de marketing</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Próximamente.
        </div>
      </div>
    </>
  )
}
