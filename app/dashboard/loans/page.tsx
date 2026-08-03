"use client";

import { useState } from "react";
import { Calculator, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import { useLoans } from "@/hooks/use-loans";
import { LoanType } from "@/types/supabase";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function MyLoansPage() {
  const { loans, isLoading, applyForLoan } = useLoans();
  const { showToast } = useToast();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [loanType, setLoanType] = useState<LoanType>("personal");
  const [amount, setAmount] = useState("25000");
  const [duration, setDuration] = useState("36");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    if (!amount || !purpose) return;
    setIsSubmitting(true);
    try {
      await applyForLoan.mutateAsync({
        loan_type: loanType,
        amount: Number(amount),
        purpose,
        duration_months: Number(duration),
      });

      showToast({
        type: "success",
        title: "Application Submitted",
        description: "Your credit application is now under review by our underwriting desk.",
      });

      setShowApplyModal(false);
      setPurpose("");
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Application Failed",
        description: e.message || "Failed to submit loan application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">My Loans &amp; Credit Facilities</h1>
          </div>
          <p className="text-slate-400 text-sm">View active loan repayments or apply for a new mortgage or property facility.</p>
        </div>
        <Button onClick={() => setShowApplyModal(true)} className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
          <Plus className="w-4 h-4" /> Apply for Loan
        </Button>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-4 border-2 border-dashed border-slate-800 rounded-3xl">
            <Calculator className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No Credit Facilities Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Apply for a mortgage, property loan, or personal credit facility online.</p>
            </div>
            <Button onClick={() => setShowApplyModal(true)} className="bg-amber-500 text-slate-950 font-bold">
              Submit Credit Application
            </Button>
          </div>
        ) : (
          loans.map((loan) => (
            <GlassCard key={loan.id} className="p-6 bg-slate-900/80 border-slate-800 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {loan.loan_type} Loan
                  </span>
                  <h3 className="text-xl font-bold text-white pt-2">{formatCurrency(loan.amount)}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{loan.purpose}</p>
                </div>
                <StatusBadge status={loan.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block">Monthly</span>
                  <span className="font-bold text-white">{formatCurrency(loan.monthly_payment || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interest Rate</span>
                  <span className="font-bold text-amber-400">{loan.interest_rate}% APY</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Term</span>
                  <span className="font-bold text-white">{loan.duration_months} Months</span>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Credit &amp; Loan Application"
        description="Submit your funding parameters for underwriting review."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Loan Facility Type
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as LoanType)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="personal">Personal Loan (Unsecured)</option>
              <option value="mortgage">Residential Mortgage (4.5% APY)</option>
              <option value="property">Commercial Property Loan (5.8% APY)</option>
              <option value="business">Business Line of Credit (6.5% APY)</option>
              <option value="portfolio_secured">Portfolio-Secured Loan (4.0% APY)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Requested Amount ($)
            </label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Duration (Months)
            </label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Purpose of Funds
            </label>
            <Input placeholder="e.g. Home Purchase or Equipment Acquisition" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600" onClick={handleApply} disabled={!amount || !purpose || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
