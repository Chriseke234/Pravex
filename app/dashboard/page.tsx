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
  const primaryOperatingBalance = wallet?.balance || 0;
  const dedicatedAccountsTotal = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalNetLiquidity = primaryOperatingBalance + dedicatedAccountsTotal;
  const activeAccountsCount = accounts.length + 1; // Primary wallet + dedicated sub-accounts

  const handleOpenTransferWithPayee = (payee: Payee) => {
    setSelectedPayee(payee);
    setShowWireModal(true);
  };

  const handleOpenTransferWithAccount = (accountNum?: string) => {
    setSelectedPayee(null);
    setSelectedSourceAccount(accountNum);
    setShowWireModal(true);
  };

  const handleDownloadStatement = () => {
    const userName = profile?.full_name || "Valued Client";
    const reportText =
      `==============================================================\n` +
      `       IRON BRIDGE COMMERCIAL BANKING — FINANCIAL STATEMENT    \n` +
      `==============================================================\n\n` +
      `Client: ${userName}\n` +
      `Generated: ${new Date().toUTCString()}\n\n` +
      `CONSOLIDATED LIQUIDITY SUMMARY:\n` +
      `--------------------------------------------------------------\n` +
      `Total Net Liquidity:    ${formatCurrency(totalNetLiquidity)}\n` +
      `Primary Operating Cash: ${formatCurrency(primaryOperatingBalance)}\n` +
      `Dedicated Accounts:     ${accounts.length} Sub-Accounts\n\n` +
      `TRANSACTION LEDGER AUDIT:\n` +
      `--------------------------------------------------------------\n` +
      (transactions && transactions.length > 0
        ? transactions
            .map(
              (t) =>
                `[${formatDate(t.created_at)}] ${t.type.padEnd(14)} | ${formatCurrency(t.amount).padEnd(14)} | Status: ${t.status}`
            )
            .join("\n")
        : "No transaction records on file.") +
      `\n\n==============================================================\n` +
      `End of Official Statement • Iron Bridge Banking PLC`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IronBridge_Statement_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      title: "Statement Downloaded",
      description: "Official financial statement generated successfully.",
    });
  };

  // Real filtered transactions from Supabase
  const realTransactions = transactions || [];
  const filteredTransactions = realTransactions.filter((tx: any) => {
    const isDeposit = tx.type?.toLowerCase().includes("deposit") || tx.type?.toLowerCase().includes("inward") || tx.type?.toLowerCase().includes("credit");
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
      {/* Top Banking Banner */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 pb-2 border-b border-[#17293F]">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Commercial Treasury &amp; Overview
            </h1>

            <p className="text-sm text-slate-400 max-w-xl">
              Welcome back,{" "}
              <span className="text-white font-medium">
                {profile?.full_name || "Valued Client"}
              </span>
              . Manage your operating accounts, cash liquidity, payment cards, and wire transfers.
            </p>
          </div>

          {/* Quick Global Actions */}
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

            <Button
              size="sm"
              onClick={() => handleOpenTransferWithAccount()}
              className="gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Wire</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Main KPI Strip with Real Supabase Data */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div variants={staggerItem}>
          <StatCard
            title="Consolidated Net Liquidity"
            value={hideBalances ? "••••••••" : formatCurrency(totalNetLiquidity)}
            subtitle="Immediate cash &amp; reserves"
            delta={{ value: "Aggregated Holdings", positive: true }}
            icon={Building2}
            accent="gold"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Primary Operating Balance"
            value={hideBalances ? "••••••••" : formatCurrency(primaryOperatingBalance)}
            subtitle="Liquid settlement cash"
            delta={{ value: "Available Now", positive: true }}
            icon={Landmark}
            accent="blue"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Dedicated Accounts"
            value={hideBalances ? "••••" : String(activeAccountsCount)}
            subtitle="Checking &amp; high-yield reserves"
            delta={{ value: "Active & Verified", positive: true }}
            icon={TrendingUp}
            accent="emerald"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Security Status"
            value={profile?.mfa_enabled ? "2FA Active" : "Verified"}
            subtitle="Encrypted &amp; Protected"
            delta={{ value: "Active", positive: true }}
            icon={ShieldCheck}
            accent="gold"
          />
        </motion.div>
      </StaggerContainer>

      {/* Quick Action Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Button
          onClick={() => handleOpenTransferWithAccount()}
          className="h-14 flex items-center justify-center gap-3 bg-[#0C1A2E] border border-[#17293F] hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <Send className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-bold text-xs sm:text-sm text-white">Send Wire</p>
            <p className="text-[10px] text-slate-400 hidden sm:block">SWIFT / ACH Wire</p>
          </div>
        </Button>

        <Link href="/dashboard/accounts" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-[#0C1A2E] border border-[#17293F] hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xs sm:text-sm text-white">My Accounts</p>
              <p className="text-[10px] text-slate-400 hidden sm:block">Checking &amp; Savings</p>
            </div>
          </Button>
        </Link>

        <Link href="/dashboard/cards" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-[#0C1A2E] border border-[#17293F] hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xs sm:text-sm text-white">Payment Cards</p>
              <p className="text-[10px] text-slate-400 hidden sm:block">Visa Corporate</p>
            </div>
          </Button>
        </Link>

        <Link href="/dashboard/loans" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-[#0C1A2E] border border-[#17293F] hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
          >
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xs sm:text-sm text-white">Credit &amp; Loans</p>
              <p className="text-[10px] text-slate-400 hidden sm:block">Commercial Facilities</p>
            </div>
          </Button>
        </Link>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Bank Accounts + Cash Flow Chart + Transaction Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Bank Accounts List */}
          <FadeIn direction="up">
            <BankAccountsCard onOpenTransferModal={handleOpenTransferWithAccount} />
          </FadeIn>

          {/* Cash Flow Analytics */}
          <FadeIn direction="up" delay={0.1}>
            <CashFlowChart />
          </FadeIn>

          {/* Banking Activity / Transaction Ledger */}
          <FadeIn direction="up" delay={0.2}>
            <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Transaction Ledger</h3>
                  <p className="text-xs text-slate-400">Audited settlement history &amp; wire tracking</p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
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
                  <div className="text-center py-8 text-xs text-slate-400">Loading transaction ledger...</div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                    <Receipt className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="font-semibold text-slate-300">No Transactions Recorded</p>
                    <p className="text-[11px] max-w-xs mx-auto">
                      Inward and outward transfers will automatically appear here once initiated.
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((tx: any) => {
                    const isDeposit = tx.type?.toLowerCase().includes("deposit") || tx.type?.toLowerCase().includes("inward") || tx.type?.toLowerCase().includes("credit");

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
                              {tx.description || tx.type || "Wire Transfer"}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {tx.reference ? `Ref: ${tx.reference} • ` : ""}{formatDate(tx.created_at, { month: "short", day: "numeric", year: "numeric" })}
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
                              {tx.status || "CLEARED"}
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
                <span>Audited clearing ledger</span>
                <Link href="/dashboard/transactions" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  <span>Full Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          </FadeIn>
        </div>

        {/* Right 1 Column: Interactive Card + Frequent Payees + Security */}
        <div className="space-y-6">
          {/* Visual Interactive Visa Card */}
          <FadeIn direction="up" delay={0.05}>
            <BankCardWidget />
          </FadeIn>

          {/* Frequent Payees & Fast Wires */}
          <FadeIn direction="up" delay={0.15}>
            <QuickPayees
              onSelectPayee={handleOpenTransferWithPayee}
              onAddPayee={() => handleOpenTransferWithAccount()}
            />
          </FadeIn>

          {/* Verification & KYC Status Shortcut */}
          <FadeIn direction="up" delay={0.25}>
            <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Compliance &amp; KYC</h3>
                  <p className="text-xs text-slate-400">Verified Corporate Standing</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080F1A]/70 border border-[#17293F] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Identity Verification</span>
                  <span className="text-emerald-400 font-bold uppercase">Approved</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Daily Transfer Limit</span>
                  <span className="text-white font-mono font-bold">$250,000.00</span>
                </div>
              </div>

              <Link href="/dashboard/documents" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold bg-[#0A1628] border-[#17293F] text-slate-300 hover:text-white hover:bg-[#122140]">
                  View Compliance Documents
                </Button>
              </Link>
            </GlassCard>
          </FadeIn>
        </div>
      </div>

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
