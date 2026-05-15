import { Hero } from "@/features/cms/components/hero"
import { FeaturesGrid } from "@/features/cms/components/features-grid"
import homepageData from "@/data/cms/homepage.json"

export default function Homepage() {
  return (
    <div className="space-y-0">
      <Hero data={homepageData.hero} />
      <FeaturesGrid data={homepageData.features} />
      
      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-primary/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-12">
            Trusted by World-Class Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos would go here - Using placeholder text for now as per rules I should use generate_image but for logos text is cleaner */}
            <span className="text-2xl font-bold">BINANCE</span>
            <span className="text-2xl font-bold">COINBASE</span>
            <span className="text-2xl font-bold">KRAKEN</span>
            <span className="text-2xl font-bold">GEMINI</span>
            <span className="text-2xl font-bold">FIREBLOCKS</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
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
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
