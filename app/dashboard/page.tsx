"use client";

import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Activity,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Download,
  Send,
  Plus,
  Landmark,
  Calculator,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useWallet } from "@/hooks/use-wallet";
import { useProfile } from "@/hooks/use-profile";
import { useTransfers } from "@/hooks/use-transfers";
import { useAccounts } from "@/hooks/use-accounts";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/toast";

export default function DashboardOverview() {
  const { wallet, transactions, isLoading: isLoadingWallet } = useWallet();
  const { profile } = useProfile();
  const { accounts } = useAccounts();
  const { createTransfer } = useTransfers();
  const { showToast } = useToast();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const walletBalance = wallet?.balance || 0;
  const recentTxs = transactions?.slice(0, 5) || [];
  const accountCount = accounts?.length || 1;

  // Chart data simulation from recent transactions
  const chartData = [
    { name: "Mon", amount: 1200 },
    { name: "Tue", amount: 2400 },
    { name: "Wed", amount: 1800 },
    { name: "Thu", amount: 3900 },
    { name: "Fri", amount: 3100 },
    { name: "Sat", amount: 4800 },
    { name: "Sun", amount: walletBalance || 5200 },
  ];

  const handleSendTransfer = async () => {
    if (!amount || isNaN(Number(amount)) || !recipient || !accountNum) return;
    setIsSubmitting(true);
    try {
      await createTransfer.mutateAsync({
        recipient_name: recipient,
        recipient_account: accountNum,
        bank_name: bankName || "Commercial Bank",
        amount: Number(amount),
        currency: "USD",
        type: "domestic",
        description: "Dashboard Transfer",
      });
      showToast({
        type: "success",
        title: "Transfer Transmitted",
        description: `Sent ${formatCurrency(Number(amount))} to ${recipient}`,
      });
      setShowTransferModal(false);
      setAmount("");
      setRecipient("");
      setAccountNum("");
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Transfer Failed",
        description: e.message || "Failed to process transfer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    const reportText =
      `IRON BRIDGE BANKING — ACCOUNT STATEMENT\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Client: ${profile?.full_name || profile?.email || "Unknown User"}\n` +
      `Account Tier: ${profile?.tier || "Starter"}\n` +
      `Primary Wallet Balance: ${formatCurrency(walletBalance)}\n` +
      `==========================================\n` +
      `Recent Transaction Log:\n` +
      (transactions
        ?.map(
          (t) =>
            `- ${formatDate(t.created_at)} | ${t.type} | ${formatCurrency(t.amount)} | [${t.status}]`
        )
        .join("\n") || "No transactions recorded.") +
      `\n==========================================\nStatus: FSCS PROTECTED & VERIFIED`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ironbridge_statement_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400 mb-1">
              Iron Bridge Digital Banking
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Financial Overview
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back,{" "}
              <span className="text-white font-medium">
                {profile?.full_name || profile?.email || "Valued Client"}
              </span>
              . Here is your account summary.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadReport}>
              <Download className="w-4 h-4" />
              Download Statement
            </Button>
            <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold" onClick={() => setShowTransferModal(true)}>
              <Send className="w-4 h-4" />
              Quick Transfer
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* KPI Stats */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div variants={staggerItem}>
          <StatCard
            title="Wallet Balance"
            value={formatCurrency(walletBalance)}
            subtitle="Primary liquid funds"
            delta={{ value: "+4.2% this month", positive: true }}
            icon={Wallet}
            accent="gold"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Bank Accounts"
            value={accountCount}
            subtitle="Checking &amp; Savings"
            delta={{ value: "Active & Secured", positive: true }}
            icon={Landmark}
            accent="blue"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Account Status"
            value="Verified"
            subtitle={`${profile?.tier || "Starter"} Tier`}
            icon={ShieldCheck}
            accent="emerald"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard
            title="Total Flows"
            value={transactions?.length || 0}
            subtitle="Recorded movements"
            delta={{ value: "FSCS Protected", positive: true }}
            icon={Activity}
            accent="gold"
          />
        </motion.div>
      </StaggerContainer>

      {/* Quick Action Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Button
          onClick={() => setShowTransferModal(true)}
          className="h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all"
        >
          <Send className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-sm">Send Money</span>
        </Button>
        <Link href="/dashboard/wallet" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all"
          >
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Top Up Wallet</span>
          </Button>
        </Link>
        <Link href="/dashboard/loans" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all"
          >
            <Calculator className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Apply for Loan</span>
          </Button>
        </Link>
        <Link href="/dashboard/accounts" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-white rounded-2xl transition-all"
          >
            <Plus className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Open Account</span>
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <FadeIn direction="up" className="lg:col-span-2">
          <GlassCard className="p-6 h-full space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Wallet Balance Trajectory</h2>
                <p className="text-xs text-slate-400">Weekly activity &amp; liquidity movements</p>
              </div>
              <Link href="/dashboard/wallet">
                <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                  Wallet Details
                </Button>
              </Link>
            </div>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A72C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D4A72C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Balance"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#D4A72C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Recent Transactions */}
        <FadeIn direction="up" delay={0.15}>
          <GlassCard className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <Link href="/dashboard/transactions">
                <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              {recentTxs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No recent transaction history recorded.
                </div>
              ) : (
                recentTxs.map((tx: any) => {
                  const isDeposit = tx.type?.toLowerCase() === "deposit";
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            isDeposit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          )}
                        >
                          {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{tx.type || "Transaction"}</p>
                          <p className="text-xs text-slate-500">{formatDate(tx.created_at, { month: "short", day: "numeric" })}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("text-sm font-bold", isDeposit ? "text-emerald-400" : "text-slate-200")}>
                          {isDeposit ? "+" : "-"}{formatCurrency(tx.amount)}
                        </p>
                        <StatusBadge status={tx.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Quick Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Execute Wire Transfer"
        description="Send funds to domestic or international bank accounts."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Recipient Name
            </label>
            <Input
              placeholder="e.g. Acme Corp or John Doe"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Account Number / IBAN
            </label>
            <Input
              placeholder="e.g. GB29IBB1029384756"
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Recipient Bank Name
            </label>
            <Input
              placeholder="e.g. Barclays Bank or Chase"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Transfer Amount ($)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" className="flex-1" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600"
              onClick={handleSendTransfer}
              disabled={!amount || !recipient || !accountNum || isSubmitting}
            >
              {isSubmitting ? "Transmitting..." : "Confirm & Send"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
