import { Metadata } from "next";
import { PricingCards } from "@/features/cms/components/pricing-cards";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle, ShieldCheck, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Institutional Pricing Plans",
  description: "Transparent, scalable pricing infrastructure for digital institutions.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <main className="max-w-7xl mx-auto px-4 space-y-24">
        {/* Header */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold tracking-tight text-gradient">
            Transparent Pricing for <br /> Digital Institutions
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the infrastructure that scales with your ambition. No hidden fees, no complexity.
          </p>
        </section>

        {/* Pricing Grid */}
        <PricingCards />

        {/* FAQ Preview / Trust markers */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="font-bold mb-2">Can I switch plans later?</h4>
                <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="font-bold mb-2">What is institutional-grade security?</h4>
                <p className="text-sm text-muted-foreground">Our infrastructure utilizes FIPS 140-2 Level 3 HSMs, multi-party computation (MPC), and 24/7 monitoring.</p>
              </div>
            </div>
            <Button variant="link" className="text-primary p-0 h-auto gap-2">
              View all FAQs <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="glassmorphism p-12 rounded-3xl border border-white/5 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Enterprise-Grade Security</h4>
                  <p className="text-sm text-muted-foreground">Soc2 Type II compliant infrastructure.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold">Global Compliance</h4>
                  <p className="text-sm text-muted-foreground">Regulatory-ready frameworks for all jurisdictions.</p>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5">
              <h4 className="text-xl font-bold mb-4">Need a custom solution?</h4>
              <p className="text-muted-foreground mb-6">Our experts can design a bespoke infrastructure tailored to your institution's unique requirements.</p>
              <Button variant="premium" size="lg">Talk to an Expert</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
