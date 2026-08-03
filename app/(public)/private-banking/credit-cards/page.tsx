import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, CheckCircle2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreditCardServicesPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <CreditCard className="w-4 h-4" /> Private Credit Cards
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Bespoke Credit Card Services</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            High-limit Metal &amp; Diamond credit cards crafted for private clients with 24/7 global lifestyle concierge access.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Request Invitation <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Metal Card Tier</div>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold">Iron Bridge Black Metal Card</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Up to $250,000 flexible credit limit</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Global Airport Lounge key access (1,400+ lounges)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Zero foreign transaction fees worldwide</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Comprehensive travel &amp; medical insurance</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-start">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diamond Tier</div>
              <Star className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold">Private Reserve Card</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Custom credit facility based on portfolio collateral</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Dedicated 24/7 Lifestyle &amp; Jet Charter Concierge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Multi-currency card billing (USD, EUR, GBP)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Supplementary cards for family office members</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
