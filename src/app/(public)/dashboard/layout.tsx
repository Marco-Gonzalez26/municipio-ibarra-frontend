import { DashboardSidebar } from "./components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <div className="p-4 flex items-center gap-2">
          <SidebarTrigger />
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <h1 className="text-sm font-medium">Módulo Administrativo</h1>
            </header>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}