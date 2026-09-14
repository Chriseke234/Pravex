"use client";

import { useState } from "react";
import Link from "next/link";
import { Landmark, Copy, Check, Plus, ArrowUpRight, ShieldCheck, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { useAccounts } from "@/hooks/use-accounts";
import { formatCurrency } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BankAccountsCard({ onOpenTransferModal }: { onOpenTransferModal?: (accountNum?: string) => void }) {
  const { accounts, isLoading } = useAccounts();
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({
      type: "success",
      title: "Copied to Clipboard",
      description: `${label} copied to clipboard.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Default mock fallback account if user hasn't created one yet
  const displayAccounts = accounts.length > 0 ? accounts : [
    {
      id: "primary-checking",
      account_name: "Corporate Operating Account",
      account_number: "IBB4920194821",
      account_type: "checking",
      currency: "USD",
      balance: 148500.0,
      interest_rate: 0.5,
      status: "active",
      is_primary: true,
    },
    {
      id: "treasury-savings",
      account_name: "High-Yield Treasury Reserve",
      account_number: "IBB7830219402",
      account_type: "savings",
      currency: "USD",
      balance: 320450.75,
      interest_rate: 4.85,
      status: "active",
      is_primary: false,
    },
  ];

  return (
    <GlassCard className="p-5 sm:p-6 bg-slate-900/80 border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Bank Accounts</h3>
            <p className="text-xs text-slate-400">Operating &amp; High-Yield Accounts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/accounts">
            <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Items */}
      <div className="space-y-3">
        {displayAccounts.map((acc: any) => {
          const isSavings = acc.account_type === "savings" || acc.account_type === "fixed_deposit" || acc.account_type === "notice_deposit";
          const apy = isSavings ? "4.85% APY" : "Daily Liquidity";

          return (
            <div
              key={acc.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Account Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {acc.account_name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        isSavings
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}
                    >
                      {acc.account_type}
                    </span>
                  </div>

                  {/* Account Number & Copy */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-slate-300 font-medium tracking-wide">
                      {acc.account_number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.account_number, "Account Number", acc.id)}
                      className="text-slate-400 hover:text-amber-400 transition-colors p-0.5 rounded"
                      title="Copy Account Number"
                      aria-label="Copy Account Number"
                    >
                      {copiedId === acc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400 font-medium">{apy}</span>
                  </div>
                </div>

                {/* Balance & Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/50">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Available Balance</p>
                    <p className="text-lg font-bold text-white font-mono">
                      {formatCurrency(acc.balance, acc.currency || "USD")}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenTransferModal?.(acc.account_number)}
                    className="h-8 px-2.5 text-xs font-semibold bg-slate-900 border-slate-800 text-slate-200 hover:text-white hover:border-amber-500/40 gap-1"
                  >
                    <span>Send</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Open Account Bar */}
      <Link href="/dashboard/accounts" className="block">
        <div className="p-3 rounded-xl border border-dashed border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/30 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-all cursor-pointer">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Open Dedicated High-Yield or Multi-Currency Account</span>
        </div>
      </Link>
    </GlassCard>
  );
}
