import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Landmark, ShieldCheck, CheckCircle2, CreditCard, PieChart, Globe, Zap, Percent, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const privateServices = [
  { title: "Credit Card Services", href: "/private-banking/credit-cards", icon: CreditCard, desc: "Bespoke high-limit Metal & Diamond cards with luxury concierge access." },
  { title: "Discretionary Portfolios", href: "/private-banking/discretionary", icon: PieChart, desc: "Tailored portfolio management by senior private wealth directors." },
  { title: "Investor Visa Portfolios", href: "/private-banking/investor-visa", icon: Globe, desc: "Government-approved investment structures for golden visa & residency programs." },
  { title: "Execution Only Portfolios", href: "/private-banking/execution-only", icon: Zap, desc: "Direct market execution across multi-asset classes for self-directed investors." },
  { title: "Portfolio Secured Lending", href: "/private-banking/portfolio-lending", icon: Percent, desc: "Leverage your liquid investment portfolio for immediate capital liquidity." },
  { title: "Property Loans", href: "/private-banking/property-loans", icon: Home, desc: "Bespoke high-net-worth residential & commercial real estate financing." },
  { title: "Notice Deposit Account", href: "/private-banking/notice-deposit", icon: Clock, desc: "Bespoke institutional rate tiers for liquid cash treasuries." },
];

export default function PrivateBankingLanding() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Landmark className="w-4 h-4" /> Private Wealth Management
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Excellence in <span className="text-gradient-gold">Private Banking</span>.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Unrivalled financial stewardship, bespoke wealth creation, and dedicated relationship managers for high-net-worth individuals and family offices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600 gap-2">
                Request Private Consultation <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[420px] rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/10">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
            alt="Private Banking"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-5 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Exclusive Threshold</p>
            <p className="text-sm font-semibold text-white">Private Banking Services require a minimum relationship threshold of $500,000.</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold">Private Client Sub-Services</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Tailored wealth solutions designed for sophisticated individual and institutional capital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateServices.map((s) => (
              <div key={s.title} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-5 hover:border-amber-500/40 transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <Link href={s.href} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm">
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
