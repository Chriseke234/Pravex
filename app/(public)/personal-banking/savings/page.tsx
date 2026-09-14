import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, PiggyBank, Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavingsAccountPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <PiggyBank className="w-4 h-4" /> Personal Savings
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">High-Yield Savings Account</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Earn 4.85% APY on your money with total liquidity. Withdraw anytime without penalty.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Apply for Savings Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Rate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Standard APY</div>
            <div className="text-4xl font-bold text-amber-400">4.85%</div>
            <p className="text-xs text-slate-500">Calculated daily, paid monthly</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Minimum Opening</div>
            <div className="text-4xl font-bold text-white">$100</div>
            <p className="text-xs text-slate-500">No maximum balance cap</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Access Level</div>
            <div className="text-4xl font-bold text-emerald-400">Instant</div>
            <p className="text-xs text-slate-500">24/7 online transfers</p>
          </div>
        </div>

        {/* Details & Features */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">Key Benefits &amp; Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Tier-1 Security</h3>
                <p className="text-xs text-slate-400 mt-1">High-yield deposits are safeguarded with institutional banking grade risk controls.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Automated Savings Rules</h3>
                <p className="text-xs text-slate-400 mt-1">Set up recurring monthly transfers or round-up rules directly inside your customer dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">No Lock-in Period</h3>
                <p className="text-xs text-slate-400 mt-1">Move money between your Savings and Current account instantly whenever you need it.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Multi-Currency Savings</h3>
                <p className="text-xs text-slate-400 mt-1">Hold savings pots in USD, EUR, or GBP to protect against currency market swings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
