
import Hero from "@/components/layouts/Hero"
import Features from "@/components/layouts/Features"
import Footer from "@/components/layouts/Footer"
import Navbar from "@/components/layouts/Navbar"

export default function Home() {
  return (
   <div className="relative min-h-screen w-full overflow-x-hidden">
      <div >
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  )
}

