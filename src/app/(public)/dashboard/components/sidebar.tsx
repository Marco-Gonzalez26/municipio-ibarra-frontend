'use client'

import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, GraduationCap, ChartBar, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"

const items = [
  { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { label: "Emprendedores", url: "/dashboard/emprendedores", icon: Users },
  { label: "Asesorías", url: "/dashboard/asesorias", icon: GraduationCap },
  { label: "Reportes", url: "/dashboard/reportes", icon: ChartBar },
  { label: "Usuarios", url: "/dashboard/usuarios", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup key="Dashboard" />
          <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
          © 2026 Municipalidad de Ibarra
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}