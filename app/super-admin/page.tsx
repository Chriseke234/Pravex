"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
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
  History
} from "lucide-react";

export default function SuperAdminDashboard() {
  const supabase = createClient();

  // Query platform statistics
  const statsQuery = useQuery({
    queryKey: ["super-admin-metrics"],
    queryFn: async () => {
      // 1. Total Profiles
      const { count: usersCount, error: usersErr } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (usersErr) throw usersErr;

      // 2. Online Sessions
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: onlineCount, error: sessionsErr } = await supabase
        .from("user_sessions")
        .select("*", { count: "exact", head: true })
        .eq("status", "online")
        .gt("last_activity", fiveMinsAgo);
      if (sessionsErr) throw sessionsErr;

      // 3. Vaults (representing institutional products)
      const { count: productsCount, error: vaultsErr } = await supabase
        .from("vaults")
        .select("*", { count: "exact", head: true });
      if (vaultsErr) throw vaultsErr;

      // 4. Transactions (representing orders/trades)
      const { count: ordersCount, error: ordersErr } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });
      if (ordersErr) throw ordersErr;

      // 5. Cash Balances
      const { data: walletsData, error: walletsErr } = await supabase
        .from("wallets")
        .select("balance");
      if (walletsErr) throw walletsErr;
      const totalWalletBalance = walletsData?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;

      // 6. Deposits
      const { data: depositsData, error: depositsErr } = await supabase
        .from("deposits")
        .select("amount")
        .eq("status", "completed");
      if (depositsErr) throw depositsErr;
      const totalDeposits = depositsData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      // 7. Withdrawals
      const { data: withdrawalsData, error: withdrawalsErr } = await supabase
        .from("withdrawals")
        .select("amount")
        .eq("status", "approved");
      if (withdrawalsErr) throw withdrawalsErr;
      const totalWithdrawals = withdrawalsData?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

      // 8. Revenue (simulated: 0.15% fee on all deposits & withdrawals)
      const revenue = (totalDeposits + totalWithdrawals) * 0.0015;

      return {
        totalUsers: usersCount || 0,
        onlineUsers: onlineCount || 0,
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        totalWalletBalance,
        totalDeposits,
        totalWithdrawals,
        revenue,
      };
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time monitoring
  });

  if (statsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const stats = statsQuery.data || {
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Super Admin Overview</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Platform Control Room</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <GlassCard className="p-6 space-y-4 border-white/5 relative overflow-hidden group">
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
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Total Profiles</p>
            <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
            <p className="text-[10px] text-muted-foreground">Registered institutions</p>
          </div>
        </GlassCard>

        {/* Online Sessions */}
        <GlassCard className="p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[30px] -z-10 group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mt-1.5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Online Users</p>
            <h3 className="text-3xl font-bold">{stats.onlineUsers}</h3>
            <p className="text-[10px] text-muted-foreground">Active session heartbeats</p>
          </div>
        </GlassCard>

        {/* Revenue */}
        <GlassCard className="p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[30px] -z-10 group-hover:bg-purple-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <Percent className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-[10px] text-purple-400 font-bold">0.15% fee</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Platform Revenue</p>
            <h3 className="text-3xl font-bold">${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-muted-foreground">Calculated wire/transfer fees</p>
          </div>
        </GlassCard>

        {/* Total Wallet Balances */}
        <GlassCard className="p-6 space-y-4 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[30px] -z-10 group-hover:bg-blue-500/10 transition-all" />
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Coins className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">Cash Pool</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Total Custody Balances</p>
            <h3 className="text-3xl font-bold">${stats.totalWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-muted-foreground">Sum of all fiat balances</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposits Summary */}
        <GlassCard className="p-6 space-y-4 border-white/5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h3 className="font-bold">Funding Inflows</h3>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Approved Deposits</span>
            <span className="font-mono font-bold text-lg text-emerald-500">
              +${stats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </GlassCard>

        {/* Withdrawals Summary */}
        <GlassCard className="p-6 space-y-4 border-white/5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <h3 className="font-bold">Funding Outflows</h3>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Approved Withdrawals</span>
            <span className="font-mono font-bold text-lg text-rose-500">
              -${stats.totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Quick Alerts */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold px-2">Core Node Operations</h3>
        <GlassCard className="p-6 border-purple-600/20 bg-purple-900/5 relative overflow-hidden flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-600/30 shrink-0">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">Full Administrator Capabilities Enabled</div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                As a Super Administrator, you have complete read/write access to user roles, database auditing, deposits/withdrawals queues, and security policies. Actions are permanently logged in the audit trail.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

