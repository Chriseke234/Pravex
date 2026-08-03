import Link from "next/link";
import { ArrowRight, Wallet, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CurrentAccountPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Wallet className="w-4 h-4" /> Personal Checking
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Personal Current Account</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your everyday financial hub. Contactless Visa debit card, real-time transaction notifications, and instant SEPA/Faster Payments.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Open Current Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Monthly Account Fee</div>
            <div className="text-4xl font-bold text-emerald-400">$0</div>
            <p className="text-xs text-slate-500">Free standard maintenance</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Debit Card</div>
            <div className="text-4xl font-bold text-amber-400">Included</div>
            <p className="text-xs text-slate-500">Virtual &amp; Physical Visa</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Transfer Speed</div>
            <div className="text-4xl font-bold text-white">Instant</div>
            <p className="text-xs text-slate-500">SEPA Instant &amp; FPS</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Personalized IBAN &amp; Account Number</h3>
                <p className="text-xs text-slate-400 mt-1">Receive salary, direct debits, and transfers directly to your dedicated account number.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Contactless Card Controls</h3>
                <p className="text-xs text-slate-400 mt-1">Freeze/unfreeze your card, adjust spending limits, or enable online transactions with one tap.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Zero Overseas Transaction Markups</h3>
                <p className="text-xs text-slate-400 mt-1">Pay abroad in foreign currencies at interbank rates without hidden FX surcharges.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Instant Push Alerts</h3>
                <p className="text-xs text-slate-400 mt-1">Get immediate notifications for every inbound deposit or outbound debit card charge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
