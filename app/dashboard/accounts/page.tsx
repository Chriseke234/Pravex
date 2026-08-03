"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/shared/glass-card";
import { Landmark, Plus, ShieldCheck, Loader2, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { AccountType } from "@/types/supabase";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function BankAccountsPage() {
  const { accounts, isLoading, createAccount } = useAccounts();
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("checking");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!accountName) return;
    setIsCreating(true);
    try {
      await createAccount.mutateAsync({
        account_name: accountName,
        account_type: accountType,
        currency: "USD",
      });
      showToast({
        type: "success",
        title: "Account Created",
        description: `Your new ${accountType} account "${accountName}" is ready.`,
      });
      setShowModal(false);
      setAccountName("");
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Creation Failed",
        description: e.message || "Failed to create bank account.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">My Bank Accounts</h1>
          </div>
          <p className="text-slate-400 text-sm">Manage your checking, savings, fixed, and notice deposit accounts.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          <Plus className="w-4 h-4" /> Open New Account
        </Button>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-4 border-2 border-dashed border-slate-800 rounded-3xl">
            <Landmark className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No Additional Accounts Created</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Open a dedicated savings, checking, or term deposit account to manage your wealth.</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="bg-amber-500 text-slate-950 font-bold">
              Open Your First Account
            </Button>
          </div>
        ) : (
          accounts.map((acc) => (
            <GlassCard key={acc.id} className="p-6 bg-slate-900/80 border-slate-800 space-y-5 hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {acc.account_type}
                  </span>
                  <h3 className="text-lg font-bold text-white pt-2">{acc.account_name}</h3>
                  <p className="text-xs font-mono text-slate-500">{acc.account_number}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400">Current Balance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(acc.balance, acc.currency)}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                <span>Status: <span className="text-emerald-400 font-semibold uppercase">{acc.status}</span></span>
                <span>Opened: {formatDate(acc.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Account Info Banner */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">FSCS Deposit Protection Guarantee</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          All eligible deposits across your Iron Bridge personal and business accounts are aggregated and protected up to £85,000 under the Financial Services Compensation Scheme.
        </p>
      </div>

      {/* Open Account Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Open New Bank Account"
        description="Select an account type to generate your new dedicated account number."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Account Label / Name
            </label>
            <Input
              placeholder="e.g. Emergency Savings or Operating Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Account Type
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="checking">Checking Account (Daily Liquidity)</option>
              <option value="savings">Savings Account (4.85% APY)</option>
              <option value="business">Business Corporate Account</option>
              <option value="fixed_deposit">Fixed Deposit (5.65% APY)</option>
              <option value="notice_deposit">Notice Deposit (5.25% APY)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600"
              onClick={handleCreate}
              disabled={!accountName || isCreating}
            >
              {isCreating ? "Opening..." : "Confirm & Open Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
