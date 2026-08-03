"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";

interface WalletBalanceCardProps {
  balance: number;
  currency: string;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export function WalletBalanceCard({
  balance,
  currency,
  onOpenDeposit,
  onOpenWithdraw,
}: WalletBalanceCardProps) {
  return (
    <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-navy/90 to-slate-950/90 border border-amber-500/20 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <WalletIcon className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium tracking-wide uppercase">Total Available Fiat Balance</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {formatCurrency(balance, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Protected by Iron Bridge Institutional Multi-Custodial Security
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onOpenDeposit}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Deposit Funds
          </Button>

          <Button
            onClick={onOpenWithdraw}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800/80 hover:text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
            Withdraw
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
