import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FixedDepositPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Clock className="w-4 h-4" /> Guaranteed Returns
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Fixed Deposit Account</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Lock in guaranteed high-yield interest rates for fixed periods from 6 to 36 months. Protect your capital against market fluctuations.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Open Fixed Deposit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Fixed Term Rates Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Guaranteed Rate Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">6 Months</div>
              <div className="text-3xl font-bold text-amber-400">5.15%</div>
              <div className="text-[11px] text-slate-500">Fixed Rate APY</div>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">12 Months</div>
              <div className="text-3xl font-bold text-amber-400">5.45%</div>
              <div className="text-[11px] text-slate-500">Fixed Rate APY</div>
            </div>
            <div className="p-5 bg-slate-950 border border-amber-500/30 bg-amber-500/5 rounded-2xl text-center space-y-2 relative">
              <span className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">Most Popular</span>
              <div className="text-xs text-slate-400 font-semibold uppercase">24 Months</div>
              <div className="text-3xl font-bold text-amber-400">5.65%</div>
              <div className="text-[11px] text-slate-500">Fixed Rate APY</div>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase">36 Months</div>
              <div className="text-3xl font-bold text-amber-400">5.75%</div>
              <div className="text-[11px] text-slate-500">Fixed Rate APY</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">Why Choose Fixed Deposits?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Guaranteed Return Rate</h3>
                <p className="text-xs text-slate-400 mt-1">Your interest rate is locked in from day one, immune to central bank interest rate drops.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Flexible Payout Options</h3>
                <p className="text-xs text-slate-400 mt-1">Choose to receive interest payouts monthly into your current account or compound upon term maturity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
