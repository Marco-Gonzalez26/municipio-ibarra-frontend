import { Footer } from '@/features/landing/components/footer'
import { Header } from '@/features/landing/components/header'
import { Login } from '@/features/auth/components/login-form'

interface LoginPageProps {
  searchParams: Promise<{ redirect_url?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect_url } = await searchParams
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <section className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(226,17,26,0.08)_100%)]" />
          <div className="container mx-auto px-4 pt-8 pb-20">
            <Login redirect_url={redirect_url} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
