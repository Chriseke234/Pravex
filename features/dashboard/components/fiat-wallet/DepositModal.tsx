"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (depositData: { amount: number; provider: string; reference: string }) => Promise<void>;
  isLoading: boolean;
}

export function DepositModal({ isOpen, onClose, onSubmit, isLoading }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("Bank Wire");
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid deposit amount.");
      return;
    }
    if (!reference.trim()) {
      setErrorMsg("Please enter your deposit reference or wire tracking code.");
      return;
    }

    try {
      await onSubmit({
        amount: Number(amount),
        provider,
        reference: reference.trim(),
      });
      setSuccessMsg("Deposit request submitted successfully! Awaiting verification.");
      setAmount("");
      setReference("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit deposit request.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close deposit modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Deposit Fiat Funds</h3>
        <p className="text-sm text-slate-400 mb-6">
          Submit wire transfer details for Iron Bridge Finance Treasury validation.
        </p>

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
              Deposit Amount (USD)
            </label>
            <Input
              type="number"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Transfer Provider / Method
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Bank Wire">Bank Wire (SWIFT / Fedwire)</option>
              <option value="ACH">ACH Transfer</option>
              <option value="SEPA">SEPA Instant</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Wire Reference / Tracking Code
            </label>
            <Input
              type="text"
              placeholder="e.g. TR-98234-IB"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Deposit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
