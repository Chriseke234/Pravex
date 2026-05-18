import { Metadata } from "next";
import { AcademyGrid } from "@/features/cms/components/academy-grid";
import { Button } from "@/components/ui/button";
import { Search, GraduationCap, Sparkles, BookMarked } from "lucide-react";

export const metadata: Metadata = {
  title: "Pavex Academy",
  description: "Master digital asset infrastructure with our institutional resources and guides.",
  alternates: {
    canonical: "/academy",
  },
};

export default function AcademyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <main className="max-w-7xl mx-auto px-4 space-y-20">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Intelligence Hub
            </div>
            <h1 className="text-6xl font-bold tracking-tight">
              Pavex <span className="text-gradient">Academy</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Master the complexities of digital asset infrastructure. Professional resources, deep-dive market insights, and technical guides for the institutional investor.
            </p>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search articles, guides, whitepapers..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="glassmorphism p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
              <div className="p-4 bg-primary/20 w-fit rounded-2xl">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">New: Institutional Custody Masterclass</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enroll in our 12-module certification program designed for compliance officers and fund managers.
              </p>
              <Button variant="premium" className="w-full">Enroll for Free</Button>
            </div>
          </div>
        </section>

        {/* Featured Grid */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Featured Resources</h2>
              <p className="text-muted-foreground">Handpicked intelligence from our global team.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="glass" size="sm">Articles</Button>
              <Button variant="glass" size="sm">Guides</Button>
              <Button variant="glass" size="sm">Videos</Button>
            </div>
          </div>
          <AcademyGrid />
        </section>

        {/* Newsletter / CTA */}
        <section className="py-20 rounded-[3rem] bg-primary/[0.03] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             {/* Abstract grid lines or something could go here */}
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
            <div className="p-4 bg-white/5 w-fit mx-auto rounded-2xl border border-white/10">
              <BookMarked className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl font-bold">Stay Ahead of the Curve</h2>
            <p className="text-lg text-muted-foreground">
              Subscribe to the Pavex Institutional newsletter and receive weekly market analysis and platform updates directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-6 focus:outline-none"
              />
              <Button variant="premium">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
