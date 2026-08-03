import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessAccountPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Building2 className="w-4 h-4" /> Corporate Checking
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Commercial Business Account</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Multi-currency corporate accounts with multi-user access permissions, automated batch payments, and seamless Xero/QuickBooks API integration.
          </p>
          <div className="pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2">
                Open Corporate Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-2xl font-bold">Enterprise Account Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Multi-Signer Approval Workflows</h3>
                <p className="text-xs text-slate-400 mt-1">Set custom dual or tri-signatory rules for outbound wire payments above defined thresholds.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white">Bulk Payroll &amp; Supplier Batching</h3>
                <p className="text-xs text-slate-400 mt-1">Upload CSV or NACHA batch files to process hundreds of employee salaries or supplier invoices in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
