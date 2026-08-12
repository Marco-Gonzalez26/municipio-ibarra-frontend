'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Megaphone,
  LogOut,
  Store,
  UserCog,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { logoutAction } from '@/features/auth/actions/auth.actions'
import type { AuthUser } from '@/features/auth/types/auth.type'

const NAV_ITEMS = [
  {
    label: 'Principal',
    items: [
      { title: 'Inicio', url: '/inicio', icon: LayoutDashboard },
      { title: 'Emprendedores', url: '/emprendedores', icon: Users },
      { title: 'Emprendimientos', url: '/emprendimientos', icon: Store },
      { title: 'Reportes', url: '/reportes', icon: ClipboardList },
      { title: 'Usuarios', url: '/usuarios', icon: UserCog },
    ],
  },
  {
    label: 'Formularios',
    items: [
      {
        title: 'Ref. Generales',
        url: '/formularios/referencia',
        icon: FileText,
      },
      {
        title: 'Asistencia Técnica',
        url: '/formularios/asistencia',
        icon: ClipboardList,
      },
    ],
  },
  {
    label: 'Asesorías',
    items: [
      {
        title: 'Modelo de negocio',
        url: '/asesorias/modelo-negocio',
        icon: Briefcase,
      },
      {
        title: 'Modelo de marketing',
        url: '/asesorias/modelo-marketing',
        icon: Megaphone,
      },
    ],
  },
]

interface AppSidebarProps {
  user?: AuthUser
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const isAdmin = user?.rol?.codigo === 'ADMIN'
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/inicio">
                <img
                  className="flex size-8 items-center justify-center"
                  src="/images/escudo-ibarra.png"
                  alt="Logo Municipio de Ibarra"
                  width="100"
                  height="100"
                />

                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-xs font-semibold">
                    Municipalidad Ibarra
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Emprendedores
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items
                  .filter((item) => item.url !== '/usuarios' || isAdmin)
                  .map((item) => (
                    <SidebarMenuItem key={item.title} className="mt-1">
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <SidebarMenu>
            <SidebarMenuItem
              className="px-2 text-xs text-muted-foreground truncate"
              title={`Sesión: ${user.nombres}`}
            >
              Sesión: {user.nombres}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <form action={logoutAction}>
                <SidebarMenuButton type="submit" tooltip="Cerrar sesión">
                  <LogOut />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        <div className="px-2 py-1 text-[10px] text-muted-foreground/70 leading-tight truncate">
          © 2026 Municipalidad de Ibarra
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
