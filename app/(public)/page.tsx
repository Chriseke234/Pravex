import { Hero } from "@/features/cms/components/hero"
import { FeaturesGrid } from "@/features/cms/components/features-grid"
import homepageData from "@/data/cms/homepage.json"
import { FadeIn } from "@/components/animations/fade-in"

export default function Homepage() {
  return (
    <div className="space-y-0">
      <Hero data={homepageData.hero} />
      <FeaturesGrid data={homepageData.features} />
      
      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-primary/[0.02] overflow-hidden">
        <div className="w-full">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-12">
            Trusted by World-Class Institutions
          </p>
          
          <div className="flex overflow-hidden group">
            {[...Array(2)].map((_, i) => (
              <div 
                key={i} 
                className="flex animate-marquee shrink-0 items-center justify-around gap-16 px-8 min-w-full opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
              >
                <span className="text-2xl font-bold tracking-widest">BINANCE</span>
                <span className="text-2xl font-bold tracking-widest">COINBASE</span>
                <span className="text-2xl font-bold tracking-widest">KRAKEN</span>
                <span className="text-2xl font-bold tracking-widest">GEMINI</span>
                <span className="text-2xl font-bold tracking-widest">FIREBLOCKS</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn direction="up">
            <div className="glassmorphism p-12 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
              <h2 className="text-4xl font-bold">Ready to Elevate Your Portfolio?</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of institutional investors who trust Pavex for their digital asset infrastructure.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/signup">
                  <Button variant="premium" size="lg">Open Account</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
