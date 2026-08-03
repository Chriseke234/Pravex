import Link from "next/link";
import { ArrowRight, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvestorVisaPortfoliosPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Globe className="w-4 h-4" /> Global Mobility
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Investor Visa Portfolios</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Specialized investment portfolios structured specifically to meet government criteria for residency and citizenship by investment programs.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Consult Immigration Specialist <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">Program Compliant Structures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-400">UK &amp; European Golden Visas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Qualifying government bonds, commercial real estate funds, and active trading company investments.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-400">Caribbean &amp; Pacific Residency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Escrow accounts, government fund contributions, and approved resort development equity holdings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
