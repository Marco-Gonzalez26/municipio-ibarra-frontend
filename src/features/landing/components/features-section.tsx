import { Users, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Registro Simple',
    description:
      'Proceso de registro guiado paso a paso para registrar tu emprendimiento de manera fácil y rápida.',
  },
  {
    icon: TrendingUp,
    title: 'Asesoría Técnica',
    description:
      'Accede a asesoramiento en gestión de negocios, marketing, producción y más para impulsar tu emprendimiento.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            ¿Qué ofrecemos?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Acompañamiento integral para emprendedores del cantón
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <feature.icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
