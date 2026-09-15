import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, ShieldCheck, CheckCircle2, Globe, FileText, Home, Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const businessServices = [
  { title: "Business Account", href: "/business-banking/account", icon: Building2, desc: "Multi-currency corporate checking accounts with multi-user approval workflows." },
  { title: "Trade Finance", href: "/business-banking/trade-finance", icon: Globe, desc: "Letters of credit, bank guarantees, and cross-border trade facilities." },
  { title: "Property Loans", href: "/business-banking/property-loans", icon: Home, desc: "Commercial property acquisition, refinance, and development loans." },
  { title: "Direct Lending", href: "/business-banking/direct-lending", icon: Percent, desc: "Custom corporate debt, revolving credit facilities, and term loans." },
  { title: "Notice Deposit Account", href: "/business-banking/notice-deposit", icon: Clock, desc: "Corporate treasury liquidity management with top-tier deposit yields." },
];

export default function BusinessBankingLanding() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Corporate Banking Engineered for <span className="text-gradient-gold">Global Expansion</span>.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Multi-currency accounts, international trade finance, commercial debt facilities, and corporate treasury management for growing businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-md shadow-amber-500/20 gap-2">
                Open Business Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80"
            alt="Business Banking"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      </section>

      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Business Banking Pillars</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Scalable corporate financial services built for modern enterprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessServices.map((s) => (
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
                    Learn More <ArrowRight className="w-4 h-4" />
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
