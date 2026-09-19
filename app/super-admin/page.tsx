"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { 
  Users, 
  Activity, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Percent, 
  ShieldAlert,
  Loader2,
  TrendingUp,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const supabase = createClient();

  // Query platform statistics — each query is wrapped in try/catch
  // so that missing tables or RLS-blocked tables return 0 gracefully
  // instead of crashing the component.
  const statsQuery = useQuery({
    queryKey: ["super-admin-metrics"],
    queryFn: async () => {
      // 1. Total Profiles
      let totalUsers = 0;
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        if (!error) totalUsers = count || 0;
      } catch (_) {}

      // 2. Online Sessions
      let onlineUsers = 0;
      try {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count, error } = await supabase
          .from("user_sessions")
          .select("*", { count: "exact", head: true })
          .eq("status", "online")
          .gt("last_activity", fiveMinsAgo);
        if (!error) onlineUsers = count || 0;
      } catch (_) {}

      // 3. Vaults (institutional products)
      let productsCount = 0;
      try {
        const { count, error } = await supabase
          .from("vaults")
          .select("*", { count: "exact", head: true });
        if (!error) productsCount = count || 0;
      } catch (_) {}

      // 4. Transactions count
      let ordersCount = 0;
      try {
        const { count, error } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true });
        if (!error) ordersCount = count || 0;
      } catch (_) {}

      // 5. Cash Balances (wallet_transactions / wallets)
      let totalWalletBalance = 0;
      try {
        const { data, error } = await supabase
          .from("wallets")
          .select("balance");
        if (!error && data) {
          totalWalletBalance = data.reduce((sum, w) => sum + Number(w.balance), 0);
        }
      } catch (_) {}

      // 6. Deposits
      let totalDeposits = 0;
      try {
        const { data, error } = await supabase
          .from("deposits")
          .select("amount")
          .eq("status", "completed");
        if (!error && data) {
          totalDeposits = data.reduce((sum, d) => sum + Number(d.amount), 0);
        }
      } catch (_) {}

      // 7. Withdrawals
      let totalWithdrawals = 0;
      try {
        const { data, error } = await supabase
          .from("withdrawals")
          .select("amount")
          .eq("status", "approved");
        if (!error && data) {
          totalWithdrawals = data.reduce((sum, w) => sum + Number(w.amount), 0);
        }
      } catch (_) {}

      // 8. Revenue (0.15% fee on deposits + withdrawals)
      const revenue = (totalDeposits + totalWithdrawals) * 0.0015;

      return {
        totalUsers,
        onlineUsers,
        productsCount,
        ordersCount,
        totalWalletBalance,
        totalDeposits,
        totalWithdrawals,
        revenue,
      };
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  if (statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const stats = statsQuery.data ?? {
    totalUsers: 0,
    onlineUsers: 0,
    productsCount: 0,
    ordersCount: 0,
    totalWalletBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    revenue: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Super Admin Overview
        </h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
          Platform Control Room
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px] -z-10 group-hover:bg-purple-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Total Profiles</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
            <p className="text-[10px] text-slate-500">Registered accounts</p>
          </div>
        </GlassCard>

        {/* Online Sessions */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[30px] -z-10 group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mt-1.5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Online Users</p>
            <h3 className="text-3xl font-bold text-white">{stats.onlineUsers}</h3>
            <p className="text-[10px] text-slate-500">Active session heartbeats</p>
          </div>
        </GlassCard>

        {/* Revenue */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[30px] -z-10 group-hover:bg-amber-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Percent className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-400 font-bold">0.15% fee</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Platform Revenue</p>
            <h3 className="text-3xl font-bold text-white">
              ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-slate-500">Calculated wire/transfer fees</p>
          </div>
        </GlassCard>

        {/* Total Wallet Balances */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[30px] -z-10 group-hover:bg-blue-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Cash Pool</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Total Custody Balances</p>
            <h3 className="text-3xl font-bold text-white">
              ${stats.totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-slate-500">Sum of all fiat balances</p>
          </div>
        </GlassCard>
      </div>

      {/* Deposits & Withdrawals Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        {/* Deposits Summary */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white">Funding Inflows</h3>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-400 uppercase font-bold">Total Approved Deposits</span>
            <span className="font-mono font-bold text-lg text-emerald-500">
              +${stats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </GlassCard>

        {/* Withdrawals Summary */}
        <GlassCard className="p-5 sm:p-6 space-y-4 border-white/5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white">Funding Outflows</h3>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-400 uppercase font-bold">Total Approved Withdrawals</span>
            <span className="font-mono font-bold text-lg text-rose-500">
              -${stats.totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Authority Banner */}
      <GlassCard className="p-5 sm:p-6 border-amber-600/20 bg-amber-900/5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-amber-600/20 rounded-2xl border border-amber-600/30 shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">Full Administrator Capabilities Enabled</div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              As a Super Administrator, you have complete read/write access to user roles, database auditing,
              deposits/withdrawals queues, and security policies. All actions are permanently logged in the audit trail.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
