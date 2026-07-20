import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/features/auth/constants'

const PUBLIC_ROUTES = new Set(['/', '/iniciar-sesion', '/registro'])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE)
  const isPublicRoute = PUBLIC_ROUTES.has(pathname)

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url))
  }

  if (hasSession && pathname === '/iniciar-sesion') {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
}
