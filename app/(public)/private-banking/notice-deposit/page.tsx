import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivateNoticeDepositPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Clock className="w-4 h-4" /> Treasury Yield
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Private Notice Deposit Accounts</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Enhanced yield notice accounts tailored for significant private liquidity balances with 35-day, 60-day, or 120-day notice terms.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Discuss Yield Tiers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
