import { FeaturesSection } from '@/features/landing/components/features-section'
import { Footer } from '@/features/landing/components/footer'
import { Header } from '@/features/landing/components/header'
import { Hero } from '@/features/landing/components/hero'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  )
}
