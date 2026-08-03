import Link from "next/link";
import { ArrowRight, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TradeFinancePage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Globe className="w-4 h-4" /> Global Trade Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">International Trade Finance</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Mitigate cross-border trade risk with Letters of Credit (LC), Bank Guarantees (BG), and Import/Export Documentary Collections.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Apply for Trade Facility <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-amber-400">Irrevocable Letters of Credit</h3>
            <p className="text-xs text-slate-400">Guaranteed payment to international suppliers upon compliant presentation of shipping documents.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-amber-400">Standby Letters of Credit (SBLC)</h3>
            <p className="text-xs text-slate-400">Financial backing ensuring contract performance and buyer obligation fulfillment.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-amber-400">Supply Chain Financing</h3>
            <p className="text-xs text-slate-400">Optimize working capital by extending supplier payment terms while offering early settlement discounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
