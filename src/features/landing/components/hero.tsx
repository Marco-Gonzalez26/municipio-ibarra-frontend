import { Button } from '@/components/ui/button'
import { Session } from '@/features/auth/types/auth.type'
import { LayoutDashboard, LogIn, Search, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface HeroProps {
  session: Session | null
}
export function Hero({ session }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(226,17,26,0.08)_100%)]" />

      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Impulsamos tu Emprendimiento
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Regístrate en nuestra plataforma y accede a asesoramiento técnico,
          capacitación y recursos para hacer crecer tu negocio.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/registro">
            <Button size="lg" className="hover:cursor-pointer">
              <UserPlus className="size-4" />
              Registrar Emprendimiento
            </Button>
          </Link>
          {session ? (
            <Link href="/inicio">
              <Button
                size="lg"
                variant="outline"
                className="hover:cursor-pointer"
              >
                <LayoutDashboard className="size-4" />
                Ir al Panel de Control
              </Button>
            </Link>
          ) : (
            <Link href="/iniciar-sesion">
              <Button
                size="lg"
                variant="outline"
                className="hover:cursor-pointer"
              >
                <LogIn className="size-4" />
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-md rounded-xl border bg-card p-6 text-left shadow-sm">
          <h3 className="font-semibold text-card-foreground">
            ¿Ya tienes una solicitud?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta el estado de tu solicitud de registro o asesoría.
          </p>
          <Button
            variant="secondary"
            className="mt-4 w-full hover:cursor-pointer"
            size="lg"
          >
            <Search className="size-4" />
            Consultar Estado de Solicitud
          </Button>
        </div>
      </div>
    </section>
  )
}
