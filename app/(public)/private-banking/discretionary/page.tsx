import Link from "next/link";
import { ArrowRight, PieChart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiscretionaryPortfoliosPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <PieChart className="w-4 h-4" /> Discretionary Wealth
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Discretionary Portfolio Management</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Delegate investment management to our seasoned portfolio managers while maintaining full control over your risk appetite and objectives.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Schedule Mandate Review <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-xl font-bold text-amber-400">Capital Preservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Low-volatility mandates prioritizing capital protection via sovereign bonds, high-grade fixed income, and defensive equities.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-xl font-bold text-amber-400">Balanced Growth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Balanced multi-asset allocation targeting steady capital growth alongside regular dividend and coupon income.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-xl font-bold text-amber-400">Global Tactical</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Aggressive capital appreciation strategies accessing global equities, private market opportunities, and alternative assets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
