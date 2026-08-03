import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoticeDepositPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Clock className="w-4 h-4" /> Notice Deposits
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Notice Deposit Account</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Achieve higher interest rates than standard savings while maintaining access to your funds via a 35-day or 95-day withdrawal notice.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Open Notice Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">35-Day Notice Account</div>
            <div className="text-5xl font-bold text-amber-400">5.05% APY</div>
            <p className="text-xs text-slate-400">Request withdrawal 35 days in advance</p>
            <div className="pt-4">
              <Link href="/signup">
                <Button variant="outline" className="w-full">Select 35-Day Notice</Button>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 bg-amber-500/5 p-8 rounded-3xl space-y-4 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">95-Day Notice Account</div>
            <div className="text-5xl font-bold text-amber-400">5.25% APY</div>
            <p className="text-xs text-slate-400">Request withdrawal 95 days in advance</p>
            <div className="pt-4">
              <Link href="/signup">
                <Button className="w-full bg-amber-500 text-slate-950">Select 95-Day Notice</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">How Notice Accounts Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Higher Interest Than Flexible Savings</h3>
                <p className="text-xs text-slate-400 mt-1">Because you give notice before withdrawing, banks can deploy funds longer and return higher yields to you.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Multiple Active Notice Requests</h3>
                <p className="text-xs text-slate-400 mt-1">Submit multiple withdrawal notices for partial amounts without closing your entire balance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
