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
  Filter,
  CreditCard,
  Calculator,
  Headset,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
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

  // Financial aggregates
  const rawWalletBalance = wallet?.balance || 148500.0;
  const accountsTotal = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalNetLiquidity = rawWalletBalance + accountsTotal;
  const activeCreditFacility = 250000.0;

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
    const userName = profile?.full_name || profile?.email || "Commercial Banking Client";
    const reportText =
      `==============================================================\n` +
      `       IRON BRIDGE COMMERCIAL BANKING — FINANCIAL STATEMENT    \n` +
      `==============================================================\n\n` +
      `Client: ${userName}\n` +
      `Account Tier: ${profile?.tier || "Enterprise"} Commercial\n` +
      `Generated: ${new Date().toUTCString()}\n` +
      `Regulatory Protection: FSCS Insured up to £85,000 / FCA Regulated\n\n` +
      `CONSOLIDATED LIQUIDITY SUMMARY:\n` +
      `--------------------------------------------------------------\n` +
      `Total Net Liquidity:    ${formatCurrency(totalNetLiquidity)}\n` +
      `Primary Operating Cash: ${formatCurrency(rawWalletBalance)}\n` +
      `Dedicated Accounts:     ${accounts.length > 0 ? accounts.length : 2} Active Accounts\n` +
      `Approved Credit Line:   ${formatCurrency(activeCreditFacility)}\n\n` +
      `RECENT TRANSACTION LEDGER:\n` +
      `--------------------------------------------------------------\n` +
      (transactions && transactions.length > 0
        ? transactions
            .map(
              (t) =>
                `[${formatDate(t.created_at)}] ${t.type.padEnd(12)} | ${formatCurrency(t.amount).padEnd(14)} | Status: ${t.status}`
            )
            .join("\n")
        : `- 2026-09-12 | Direct Debit   | $4,500.00      | Status: Completed\n` +
          `- 2026-09-10 | Client Wire    | $82,000.00     | Status: Completed\n` +
          `- 2026-09-08 | Vendor Wire    | $12,400.00     | Status: Completed\n` +
          `- 2026-09-05 | Card Settlement| $1,850.20      | Status: Completed`) +
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

  // Filtered transactions
  const displayTxs = (transactions && transactions.length > 0)
    ? transactions
    : [
        {
          id: "tx-1",
          type: "Client Inward Wire",
          amount: 82000.0,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: "completed",
          category: "inflow",
          counterparty: "Stripe Payments Europe",
        },
        {
          id: "tx-2",
          type: "Vendor Payment Wire",
          amount: 14250.0,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
          category: "outflow",
          counterparty: "Amazon Web Services Inc",
        },
        {
          id: "tx-3",
          type: "Card POS Purchase",
          amount: 840.5,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          status: "completed",
          category: "outflow",
          counterparty: "British Airways Executive",
        },
        {
          id: "tx-4",
          type: "Interest Payout (4.85%)",
          amount: 1290.45,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          status: "completed",
          category: "inflow",
          counterparty: "Iron Bridge Treasury Desk",
        },
        {
          id: "tx-5",
          type: "Domestic Faster Payment",
          amount: 3200.0,
          created_at: new Date(Date.now() - 432000000).toISOString(),
          status: "completed",
          category: "outflow",
          counterparty: "Mayfair Corporate Suites",
        },
      ];

  const filteredTransactions = displayTxs.filter((tx: any) => {
    const isDeposit = tx.type?.toLowerCase().includes("deposit") || tx.type?.toLowerCase().includes("inward") || tx.type?.toLowerCase().includes("interest") || tx.category === "inflow";
    if (txFilter === "inflow" && !isDeposit) return false;
    if (txFilter === "outflow" && isDeposit) return false;
    if (txSearch) {
      const q = txSearch.toLowerCase();
      const matchType = tx.type?.toLowerCase().includes(q);
      const matchCounterparty = tx.counterparty?.toLowerCase().includes(q);
      return matchType || matchCounterparty;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banking Banner */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 pb-2 border-b border-slate-800/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                FSCS Protected &amp; FCA Regulated
              </span>
              <span className="text-xs font-semibold text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                {profile?.tier || "Enterprise"} Banking Tier
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Commercial Treasury &amp; Overview
            </h1>

            <p className="text-sm text-slate-400 max-w-xl">
              Welcome back,{" "}
              <span className="text-white font-medium">
                {profile?.full_name || profile?.email || "Commercial Client"}
              </span>
              . Manage your operating accounts, cash liquidity, cards, and wire transfers.
            </p>
          </div>

          {/* Quick Global Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideBalances(!hideBalances)}
              className="gap-1.5 text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            >
              {hideBalances ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{hideBalances ? "Show Balances" : "Hide Balances"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadStatement}
              className="gap-1.5 text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
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

      {/* Main KPI Strip */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div variants={staggerItem}>
          <StatCard
            title="Consolidated Net Liquidity"
            value={hideBalances ? "••••••••" : formatCurrency(totalNetLiquidity)}
            subtitle="Immediate cash &amp; reserves"
            delta={{ value: "+8.4% this month", positive: true }}
            icon={Building2}
            accent="gold"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Primary Operating Cash"
            value={hideBalances ? "••••••••" : formatCurrency(rawWalletBalance)}
            subtitle="Immediate settlement funds"
            delta={{ value: "Daily Liquidity", positive: true }}
            icon={Landmark}
            accent="blue"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Treasury &amp; Savings"
            value={hideBalances ? "••••••••" : formatCurrency(accountsTotal > 0 ? accountsTotal : 320450.75)}
            subtitle="High-yield interest accounts"
            delta={{ value: "4.85% APY Accruing", positive: true }}
            icon={TrendingUp}
            accent="emerald"
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Approved Credit Facility"
            value={hideBalances ? "••••••••" : formatCurrency(activeCreditFacility)}
            subtitle="Commercial revolving facility"
            delta={{ value: "Prime + 1.25%", positive: true }}
            icon={Calculator}
            accent="gold"
          />
        </motion.div>
      </StaggerContainer>

      {/* Quick Action Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Button
          onClick={() => handleOpenTransferWithAccount()}
          className="h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
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
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
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
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
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
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all shadow-sm group"
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
            <GlassCard className="p-5 sm:p-6 bg-slate-900/80 border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Transaction Ledger</h3>
                  <p className="text-xs text-slate-400">Audited settlement history &amp; wire tracking</p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search counterparty..."
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
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
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No transactions match your search filter.
                  </div>
                ) : (
                  filteredTransactions.map((tx: any) => {
                    const isDeposit = tx.type?.toLowerCase().includes("deposit") || tx.type?.toLowerCase().includes("inward") || tx.type?.toLowerCase().includes("interest") || tx.category === "inflow";

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                              isDeposit
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-slate-800 text-slate-300 border-slate-700/60"
                            )}
                          >
                            {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {tx.counterparty || tx.type || "Commercial Transfer"}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {tx.type} • {formatDate(tx.created_at, { month: "short", day: "numeric", year: "numeric" })}
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
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Showing latest settlement entries</span>
                <Link href="/dashboard/transactions" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  <span>Full Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          </FadeIn>
        </div>

        {/* Right 1 Column: Interactive Card + Frequent Payees + Relationship Desk + Security */}
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

          {/* Dedicated Relationship Manager Card */}
          <FadeIn direction="up" delay={0.25}>
            <GlassCard className="p-5 sm:p-6 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Headset className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Private Banking Desk</h3>
                  <p className="text-xs text-slate-400">Dedicated Commercial Relationship Manager</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm shrink-0 shadow-md">
                  AH
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">Alexander Hayes</p>
                  <p className="text-xs text-amber-400 font-medium truncate">Senior Commercial RM</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">London Commercial Desk</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard/support" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold bg-slate-900 border-slate-800 text-slate-200 hover:text-white">
                    Direct Message
                  </Button>
                </Link>
                <Link href="/contact" className="w-full">
                  <Button size="sm" className="w-full text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-600">
                    Schedule Call
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </FadeIn>

          {/* FSCS Protection Guarantee Card */}
          <FadeIn direction="up" delay={0.3}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Regulatory Security Guarantee</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eligible deposits are aggregated and protected up to £85,000 per banking license under the Financial Services Compensation Scheme.
              </p>
            </div>
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
