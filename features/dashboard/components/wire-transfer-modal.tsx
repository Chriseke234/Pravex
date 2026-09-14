"use client";

import { useState } from "react";
import { Send, Globe, Building2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransfers } from "@/hooks/use-transfers";
import { useAccounts } from "@/hooks/use-accounts";
import { formatCurrency } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";
import { Payee } from "./quick-payees";

interface WireTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPayee?: Payee | null;
  defaultSourceAccount?: string;
}

export function WireTransferModal({
  isOpen,
  onClose,
  defaultPayee,
  defaultSourceAccount,
}: WireTransferModalProps) {
  const { createTransfer } = useTransfers();
  const { accounts } = useAccounts();
  const { showToast } = useToast();

  const [wireType, setWireType] = useState<"domestic" | "international">("domestic");
  const [recipient, setRecipient] = useState(defaultPayee?.name || "");
  const [accountNum, setAccountNum] = useState(defaultPayee?.accountNumber || "");
  const [bankName, setBankName] = useState(defaultPayee?.bankName || "");
  const [routingCode, setRoutingCode] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [selectedSource, setSelectedSource] = useState(defaultSourceAccount || accounts?.[0]?.account_number || "Primary Checking");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when defaultPayee changes
  const handleSetPayee = (payee: Payee) => {
    setRecipient(payee.name);
    setAccountNum(payee.accountNumber);
    setBankName(payee.bankName);
  };

  const wireFee = wireType === "domestic" ? 0.0 : 15.0;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !recipient || !accountNum) {
      showToast({
        type: "error",
        title: "Incomplete Wire Information",
        description: "Please fill in all mandatory wire transfer fields.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransfer.mutateAsync({
        recipient_name: recipient,
        recipient_account: accountNum,
        bank_name: bankName || (wireType === "domestic" ? "Domestic Clearing Bank" : "International Correspondent Bank"),
        amount: Number(amount),
        currency: "USD",
        type: wireType,
        description: reference ? `${reference} (Routing: ${routingCode || "N/A"})` : "Commercial Settlement Wire",
      });

      showToast({
        type: "success",
        title: "Wire Transmitted",
        description: `Successfully dispatched ${formatCurrency(Number(amount))} to ${recipient}.`,
      });

      onClose();
      setAmount("");
      setRecipient("");
      setAccountNum("");
      setBankName("");
      setRoutingCode("");
      setReference("");
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Wire Transfer Failed",
        description: err.message || "Failed to transmit wire instruction.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Commercial Wire &amp; Payment Transfer"
      description="Initiate domestic Faster Payments/ACH or international SWIFT wire instructions."
      maxWidth="lg"
    >
      <form onSubmit={handleSend} className="space-y-5">
        {/* Wire Type Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setWireType("domestic")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              wireType === "domestic"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Domestic Wire / ACH ($0 fee)</span>
          </button>
          <button
            type="button"
            onClick={() => setWireType("international")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              wireType === "international"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>International SWIFT / IBAN</span>
          </button>
        </div>

        {/* Source Account Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            Debit Source Account
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <option key={acc.id} value={acc.account_number}>
                  {acc.account_name} ({acc.account_number}) — {formatCurrency(acc.balance, acc.currency)}
                </option>
              ))
            ) : (
              <option value="primary">Primary Commercial Checking (IBB4920194821) — $148,500.00</option>
            )}
          </select>
        </div>

        {/* Recipient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Beneficiary / Company Name *
            </label>
            <Input
              placeholder="e.g. Acme Global Logistics Ltd"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {wireType === "domestic" ? "Account Number / Sort Code" : "IBAN (International Account No.)"} *
            </label>
            <Input
              placeholder={wireType === "domestic" ? "e.g. 0899201948" : "e.g. GB29IBB1029384756"}
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Beneficiary Bank Name
            </label>
            <Input
              placeholder="e.g. Barclays Commercial or Chase Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              {wireType === "domestic" ? "Routing / Sort Code (Optional)" : "SWIFT / BIC Code *"}
            </label>
            <Input
              placeholder={wireType === "domestic" ? "e.g. 20-00-00" : "e.g. BARCGB22"}
              value={routingCode}
              onChange={(e) => setRoutingCode(e.target.value)}
            />
          </div>
        </div>

        {/* Amount and Memo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Transfer Amount ($ USD) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Payment Reference / Memo
            </label>
            <Input
              placeholder="e.g. Invoice #2026-889"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        {/* Fee & Compliance Notice */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted SWIFT/Fedwire protocol</span>
          </div>
          <span className="font-mono text-slate-200">
            Network Fee: <span className="text-amber-400 font-bold">${wireFee.toFixed(2)}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2"
            disabled={!amount || !recipient || !accountNum || isSubmitting}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Transmitting Wire..." : "Authorize & Send Wire"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
