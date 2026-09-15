import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calculator, Home, Building, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const loanProducts = [
  { title: "Mortgage Loans", href: "/loans-and-credits/mortgage", icon: Home, desc: "Competitive residential & buy-to-let mortgages with fixed or variable interest rates." },
  { title: "Property Loans", href: "/loans-and-credits/property", icon: Building, desc: "Commercial real estate loans, bridging finance, and development funding." },
  { title: "Loan & Mortgage Calculator", href: "/loans-and-credits/calculator", icon: Calculator, desc: "Calculate your monthly payments, total interest, and amortization schedule instantly." },
];

export default function LoansAndCreditsLanding() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Smart Credit &amp; <span className="text-gradient-gold">Mortgage Financing</span>.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Flexible lending solutions for homebuyers, real estate investors, and commercial developers with fast approvals and competitive rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/loans-and-credits/calculator">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-md shadow-amber-500/20 gap-2">
                Use Loan Calculator <Calculator className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[380px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&q=80"
            alt="Loans and Mortgages"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      </section>

      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Credit &amp; Mortgage Products</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Engineered to power your property purchases and business liquidity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loanProducts.map((s) => (
              <div key={s.title} className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 hover:border-amber-500/40 transition-all group flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link href={s.href} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-sm">
                    Access Tool / Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
