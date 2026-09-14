"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Landmark,
  ShieldCheck,
  Download,
  Send,
  Plus,
  Eye,
  EyeOff,
  Search,
  CreditCard,
  Calculator,
  TrendingUp,
  Receipt,
  FileCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  QrCode,
  Wallet as WalletIcon,
  CreditCard as PaymentIcon,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { useWallet } from "@/hooks/use-wallet";
import { useProfile } from "@/hooks/use-profile";
import { useAccounts } from "@/hooks/use-accounts";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { BankCardWidget } from "@/features/dashboard/components/bank-card-widget";
import { BankAccountsCard } from "@/features/dashboard/components/bank-accounts-card";
import { QuickPayees, Payee } from "@/features/dashboard/components/quick-payees";
import { CashFlowChart } from "@/features/dashboard/components/cash-flow-chart";
import { WireTransferModal } from "@/features/dashboard/components/wire-transfer-modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const { wallet, transactions, isLoading: isLoadingWallet } = useWallet();
  const { profile } = useProfile();
  const { accounts } = useAccounts();
  const { showToast } = useToast();

  const [showWireModal, setShowWireModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [selectedSourceAccount, setSelectedSourceAccount] = useState<string | undefined>(undefined);
  const [hideBalances, setHideBalances] = useState(false);
  const [txFilter, setTxFilter] = useState<"all" | "inflow" | "outflow">("all");
  const [txSearch, setTxSearch] = useState("");

  // Real financial aggregates from Supabase
  const totalNetLiquidity = wallet?.balance || 0;

  // Extract user's first name for greeting
  const firstName =
    profile?.full_name?.trim().split(" ")[0] ||
    (profile as any)?.first_name ||
    "there";

  const handleOpenTransferWithPayee = (payee: Payee) => {
    setSelectedPayee(payee);
    setShowWireModal(true);
  };

  const handleOpenTransferWithAccount = (accountNum?: string) => {
    setSelectedPayee(null);
    setSelectedSourceAccount(accountNum);
    setShowWireModal(true);
  };

  const handleActionToast = (actionName: string) => {
    showToast({
      type: "info",
      title: actionName,
      description: `${actionName} feature is ready. Select an account or recipient to continue.`,
    });
  };

  const handleDownloadStatement = () => {
    const userName = profile?.full_name || "Valued Client";
    const reportText =
      `==============================================================\n` +
      `                   ACCOUNT FINANCIAL STATEMENT                 \n` +
      `==============================================================\n\n` +
      `Client: ${userName}\n` +
      `Generated: ${new Date().toUTCString()}\n\n` +
      `SUMMARY OF HOLDINGS:\n` +
      `--------------------------------------------------------------\n` +
      `Total Balance:          ${formatCurrency(totalNetLiquidity)}\n` +
      `Available Cash:         ${formatCurrency(totalNetLiquidity)}\n\n` +
      `RECENT TRANSACTIONS:\n` +
      `--------------------------------------------------------------\n` +
      (transactions && transactions.length > 0
        ? transactions
            .map(
              (t) =>
                `[${formatDate(t.created_at)}] ${t.type.padEnd(14)} | ${formatCurrency(t.amount).padEnd(14)} | Status: ${t.status}`
            )
            .join("\n")
        : "No transaction records available.") +
      `\n\n==============================================================\n` +
      `End of Statement`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Statement_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      title: "Statement Downloaded",
      description: "Financial statement generated successfully.",
    });
  };

  // Filter transactions
  const realTransactions = transactions || [];
  const filteredTransactions = realTransactions.filter((tx: any) => {
    const isDeposit =
      tx.type?.toLowerCase().includes("deposit") ||
      tx.type?.toLowerCase().includes("inward") ||
      tx.type?.toLowerCase().includes("credit");
    if (txFilter === "inflow" && !isDeposit) return false;
    if (txFilter === "outflow" && isDeposit) return false;
    if (txSearch) {
      const q = txSearch.toLowerCase();
      const matchType = tx.type?.toLowerCase().includes(q);
      const matchDesc = tx.description?.toLowerCase().includes(q);
      const matchRef = tx.reference?.toLowerCase().includes(q);
      return matchType || matchDesc || matchRef;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner with Hello Greeting */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-[#17293F]">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Hello, {firstName}!
            </h1>
            <p className="text-sm text-slate-400">
              Here is your financial summary and quick account actions.
            </p>
          </div>

          {/* Global Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideBalances(!hideBalances)}
              className="gap-1.5 text-xs bg-[#0C1A2E] border-[#17293F] text-slate-300 hover:text-white hover:bg-[#122140]"
            >
              {hideBalances ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{hideBalances ? "Show Balances" : "Hide Balances"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadStatement}
              className="gap-1.5 text-xs bg-[#0C1A2E] border-[#17293F] text-slate-300 hover:text-white hover:bg-[#122140]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Statement</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Featured Hero Total Balance Card (Inspired by reference design) */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#132A4A] via-[#0C1A2E] to-[#080F1A] border border-amber-500/30 p-6 sm:p-8 shadow-xl shadow-amber-500/5">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Balance & Trend Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Total Balance
                </span>
                <button
                  type="button"
                  onClick={() => setHideBalances(!hideBalances)}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Toggle Balance Visibility"
                >
                  {hideBalances ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-baseline gap-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-white tracking-tight">
                  {hideBalances ? "••••••••" : formatCurrency(totalNetLiquidity)}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +24% Last week
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Combined balance across all active accounts
              </p>
            </div>

            {/* Embedded Primary Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleOpenTransferWithAccount()}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0A1628]/90 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 text-white transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform mb-1.5">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Send</span>
              </button>

              <button
                type="button"
                onClick={() => handleActionToast("Request Payment")}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0A1628]/90 border border-[#17293F] hover:border-amber-500/30 hover:bg-[#122140] text-white transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform mb-1.5">
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Request</span>
              </button>

              <button
                type="button"
                onClick={() => handleActionToast("Bill Payment")}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0A1628]/90 border border-[#17293F] hover:border-amber-500/30 hover:bg-[#122140] text-white transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5">
                  <PaymentIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Payment</span>
              </button>

              <button
                type="button"
                onClick={() => handleActionToast("Withdraw Cash")}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0A1628]/90 border border-[#17293F] hover:border-amber-500/30 hover:bg-[#122140] text-white transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform mb-1.5">
                  <ArrowUpCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white">Withdraw</span>
              </button>
            </div>
          </div>
        </div>
      </FadeIn>



      {/* Recent Activity / Transactions Ledger */}
      <FadeIn direction="up">
        <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Recent Activity</h3>
              <p className="text-xs text-slate-400">Your latest transactions and transfers</p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full bg-[#080F1A] border border-[#17293F] rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex bg-[#080F1A] p-0.5 rounded-xl border border-[#17293F]">
                <button
                  type="button"
                  onClick={() => setTxFilter("all")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                    txFilter === "all" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter("inflow")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                    txFilter === "inflow" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  In
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter("outflow")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                    txFilter === "outflow" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Out
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table / List */}
          <div className="space-y-2">
            {isLoadingWallet ? (
              <div className="text-center py-8 text-xs text-slate-400">Loading activity...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                <Receipt className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-semibold text-slate-300">No Recent Activity</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Inward and outward transfers will appear here automatically.
                </p>
              </div>
            ) : (
              filteredTransactions.map((tx: any) => {
                const isDeposit =
                  tx.type?.toLowerCase().includes("deposit") ||
                  tx.type?.toLowerCase().includes("inward") ||
                  tx.type?.toLowerCase().includes("credit");

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#080F1A]/70 border border-[#17293F] hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                          isDeposit
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-[#122140] text-slate-300 border-[#17293F]"
                        )}
                      >
                        {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                          {tx.description || tx.type || "Transfer"}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {tx.reference ? `Ref: ${tx.reference} • ` : ""}
                          {formatDate(tx.created_at, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p
                        className={cn(
                          "text-sm font-bold font-mono",
                          isDeposit ? "text-emerald-400" : "text-slate-200"
                        )}
                      >
                        {isDeposit ? "+" : "-"}{hideBalances ? "••••" : formatCurrency(tx.amount)}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", tx.status === "completed" ? "bg-emerald-400" : "bg-amber-400")} />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {tx.status || "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View all link */}
          <div className="pt-2 border-t border-[#17293F] flex items-center justify-between text-xs text-slate-400">
            <span>Complete history log</span>
            <Link href="/dashboard/transactions" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <span>View All Transactions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Wire & Transfer Modal */}
      <WireTransferModal
        isOpen={showWireModal}
        onClose={() => setShowWireModal(false)}
        defaultPayee={selectedPayee}
        defaultSourceAccount={selectedSourceAccount}
      />
    </div>
  );
}
