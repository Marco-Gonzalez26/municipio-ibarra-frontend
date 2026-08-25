import { FeaturesSection } from '@/features/landing/components/features-section'
import { Footer } from '@/features/landing/components/footer'
import { Header } from '@/features/landing/components/header'
import { Hero } from '@/features/landing/components/hero'
import { getSession } from '@/features/auth/services/session.service'
export default async function Home() {
  const session = await getSession()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <Hero session={session} />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
