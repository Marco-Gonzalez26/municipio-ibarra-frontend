import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/features/auth/constants'

const PUBLIC_ROUTES = new Set(['/', '/iniciar-sesion', '/registro'])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const hasSession = Boolean(sessionCookie)
  const isPublicRoute = PUBLIC_ROUTES.has(pathname)

  // Sesión con rol vencido: se borra la cookie para romper el loop
  // /iniciar-sesion -> /inicio -> /iniciar-sesion. El login la niega
  // con mensaje descriptivo.
  if (hasSession && isSessionRoleExpired(sessionCookie)) {
    const response = NextResponse.redirect(
      new URL('/iniciar-sesion', request.url)
    )
    response.cookies.delete(SESSION_COOKIE)
    return response
  }

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url))
  }

  if (hasSession && pathname === '/iniciar-sesion') {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return NextResponse.next()
}

function isSessionRoleExpired(sessionCookie: string | undefined): boolean {
  if (!sessionCookie) return false
  try {
    const session = JSON.parse(sessionCookie) as {
      usuario?: { rol?: unknown; rolVenceEl?: string | null }
    }
    if (!session.usuario?.rol) return false
    const venceEl = session.usuario.rolVenceEl
    if (!venceEl) return false
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return venceEl.slice(0, 10) < `${yyyy}-${mm}-${dd}`
  } catch {
    return false
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
}
