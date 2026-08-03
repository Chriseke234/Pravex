import Link from "next/link";
import { ArrowRight, Percent, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortfolioSecuredLendingPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Percent className="w-4 h-4" /> Liquidity Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Portfolio Secured Lending</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Unlock instant capital without liquidating your investments. Borrow against your stocks, bonds, and funds at competitive interest margins.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Calculate Credit Limit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase">LTV Ratios</div>
            <div className="text-4xl font-bold text-amber-400">Up to 80%</div>
            <p className="text-xs text-slate-500">Based on asset quality</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase">Margin Rates</div>
            <div className="text-4xl font-bold text-white">SOFR + 1.5%</div>
            <p className="text-xs text-slate-500">Competitive private pricing</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase">Tax Efficiency</div>
            <div className="text-4xl font-bold text-emerald-400">No Tax Event</div>
            <p className="text-xs text-slate-500">Avoid capital gains trigger</p>
          </div>
        </div>
      </div>
    </div>
  );
}
