import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, Wallet, PiggyBank, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const subProducts = [
  {
    title: "Savings Account",
    href: "/personal-banking/savings",
    desc: "Earn high-yield interest on your everyday funds with zero lock-in period and instant withdrawals.",
    rate: "4.85% APY",
    icon: PiggyBank,
  },
  {
    title: "Current Account",
    href: "/personal-banking/current",
    desc: "Full-featured day-to-day transactional banking with contactless debit cards and instant transfers.",
    rate: "Free Account",
    icon: Wallet,
  },
  {
    title: "Fixed Deposit Account",
    href: "/personal-banking/fixed-deposit",
    desc: "Lock in guaranteed top-tier interest rates for fixed terms from 6 to 36 months.",
    rate: "Up to 5.75% APY",
    icon: Clock,
  },
  {
    title: "Notice Deposit Account",
    href: "/personal-banking/notice-deposit",
    desc: "Enjoy higher interest rates by committing to a 35-day or 95-day withdrawal notice period.",
    rate: "Up to 5.25% APY",
    icon: CreditCard,
  },
];

export default function PersonalBankingLanding() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Personal Banking Services
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            Personal Banking Designed for <span className="text-gradient-gold">Your Financial Freedom</span>.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage your daily funds, grow your savings with top-tier deposit yields, and enjoy seamless digital management backed by £85,000 FSCS deposit protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600 gap-2">
                Open Personal Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-[380px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0a67daf4005a?w=1000&q=80"
            alt="Personal Banking"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
      </section>

      {/* Sub Products Grid */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold">Personal Account Solutions</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Explore our range of personal savings, checking, and term deposit options.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subProducts.map((p) => (
              <div key={p.title} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-5 hover:border-amber-500/40 transition-all group flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <p.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {p.rate}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <Link href={p.href} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm">
                    View Product Details &amp; Apply <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-serif font-bold">Why Open a Personal Account?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg">FSCS Deposit Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Your personal funds are protected up to £85,000 under the Financial Services Compensation Scheme.</p>
          </div>
          <div className="space-y-3 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg">Zero Hidden Maintenance Fees</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Transparent pricing with no surprise monthly ledger fees or hidden charges.</p>
          </div>
          <div className="space-y-3 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-lg">24/7 Digital Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Access your account, transfer funds, or manage standing orders anytime via Web &amp; Mobile.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
