"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (withdrawData: {
    amount: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
  }) => Promise<void>;
  maxBalance: number;
  isLoading: boolean;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  onSubmit,
  maxBalance,
  isLoading,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg("Please enter a valid withdrawal amount.");
      return;
    }
    if (numericAmount > maxBalance) {
      setErrorMsg(`Insufficient available balance (${formatCurrency(maxBalance)}).`);
      return;
    }
    if (!bankName.trim() || !accountName.trim() || !accountNumber.trim()) {
      setErrorMsg("Please fill in all receiving bank details.");
      return;
    }

    try {
      await onSubmit({
        amount: numericAmount,
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
      });
      setSuccessMsg("Withdrawal request submitted! Awaiting institutional approval.");
      setAmount("");
      setBankName("");
      setAccountName("");
      setAccountNumber("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit withdrawal request.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close withdrawal modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Withdraw Fiat Funds</h3>
        <p className="text-sm text-slate-400 mb-2">
          Request outbound wire settlement to verified corporate bank account.
        </p>
        <div className="text-xs text-amber-400/90 font-medium mb-6">
          Available: {formatCurrency(maxBalance)}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Withdrawal Amount (USD)
            </label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Bank Name
            </label>
            <Input
              type="text"
              placeholder="e.g. JPMorgan Chase Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Account Beneficiary Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Iron Bridge Finance Capital Holdings"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Account Number / IBAN
            </label>
            <Input
              type="text"
              placeholder="e.g. US98 1234 5678 9012"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2 border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-1/2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Withdrawal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
