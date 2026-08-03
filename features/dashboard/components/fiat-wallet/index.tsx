"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useNotifications } from "@/hooks/use-notifications";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { DepositModal } from "./DepositModal";
import { WithdrawalModal } from "./WithdrawalModal";
import { GlassCard } from "@/components/shared/glass-card";
import { formatDate, formatCurrency, getStatusBadgeStyle } from "@/lib/utils/formatters";
import { ArrowUpRight, ArrowDownLeft, Clock, Loader2, Bell, Check } from "lucide-react";

export function FiatWallet() {
  const { wallet, transactions, isLoading, requestDeposit, requestWithdrawal } = useWallet();
  const { notifications, markAsRead } = useNotifications();

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleDepositSubmit = async (data: { amount: number; provider: string; reference: string }) => {
    await requestDeposit.mutateAsync(data);
  };

  const handleWithdrawSubmit = async (data: {
    amount: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
  }) => {
    await requestWithdrawal.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Primary Balance Header */}
      <WalletBalanceCard
        balance={wallet?.balance || 0}
        currency={wallet?.currency || "USD"}
        onOpenDeposit={() => setShowDepositModal(true)}
        onOpenWithdraw={() => setShowWithdrawModal(true)}
      />

      {/* Notifications Bar if any */}
      {notifications && notifications.length > 0 && (
        <GlassCard className="p-4 bg-slate-900/60 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{notifications[0].title}</p>
              <p className="text-xs text-slate-400">{notifications[0].message}</p>
            </div>
          </div>
          <button
            onClick={() => markAsRead.mutate(notifications[0].id)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg"
          >
            <Check className="w-3.5 h-3.5" />
            Dismiss
          </button>
        </GlassCard>
      )}

      {/* Recent Fiat Activity */}
      <GlassCard className="p-6 bg-slate-900/80 border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          Recent Fiat Transactions
        </h3>

        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            No recent fiat transaction history recorded.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            {transactions.map((tx: any) => {
              const isDeposit = tx.type?.toLowerCase() === "deposit";
              const badgeStyle = getStatusBadgeStyle(tx.status);
              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between min-w-[500px] hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isDeposit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {isDeposit ? "Fiat Deposit" : "Fiat Withdrawal"}
                      </div>
                      <div className="text-xs text-slate-400">{formatDate(tx.created_at)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      {tx.status || "Pending"}
                    </span>

                    <div className={`text-sm font-bold ${isDeposit ? "text-emerald-400" : "text-slate-200"}`}>
                      {isDeposit ? "+" : "-"}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSubmit={handleDepositSubmit}
        isLoading={requestDeposit.isPending}
      />

      <WithdrawalModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onSubmit={handleWithdrawSubmit}
        maxBalance={wallet?.balance || 0}
        isLoading={requestWithdrawal.isPending}
      />
    </div>
  );
}
