"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { BarChart3, TrendingUp, Users, DollarSign, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils/formatters";

export default function AdminReportsPage() {
  const supabase = createClient();

  const reportsQuery = useQuery({
    queryKey: ["admin-reports-data"],
    queryFn: async () => {
      const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { data: walletsData } = await supabase.from("wallets").select("balance");
      const totalBalance = walletsData?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;

      const { data: depositsData } = await supabase.from("deposits").select("amount").eq("status", "completed");
      const totalDeposits = depositsData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      return {
        usersCount: usersCount || 0,
        totalBalance,
        totalDeposits,
      };
    },
  });

  const chartData = [
    { month: "Jan", volume: 1200000, revenue: 18000 },
    { month: "Feb", volume: 1900000, revenue: 28500 },
    { month: "Mar", volume: 2400000, revenue: 36000 },
    { month: "Apr", volume: 3100000, revenue: 46500 },
    { month: "May", volume: 4200000, revenue: 63000 },
    { month: "Jun", volume: 5800000, revenue: 87000 },
  ];

  const handleExportCsv = () => {
    const csvContent =
      "Month,Volume,Revenue\n" +
      chartData.map((d) => `"${d.month}","${d.volume}","${d.revenue}"`).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IBB_Analytics_Report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const data = reportsQuery.data || { usersCount: 0, totalBalance: 0, totalDeposits: 0 };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Reports &amp; Platform Analytics</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Financial volume, growth curves, and revenue metrics</p>
        </div>
        <Button onClick={handleExportCsv} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export Report CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/5 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Total Client Deposits</span>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(data.totalDeposits)}</p>
        </GlassCard>
        <GlassCard className="p-6 border-white/5 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Total Custody Balances</span>
          <p className="text-3xl font-bold text-amber-400">{formatCurrency(data.totalBalance)}</p>
        </GlassCard>
        <GlassCard className="p-6 border-white/5 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-bold">Total Platform Users</span>
          <p className="text-3xl font-bold text-white">{data.usersCount}</p>
        </GlassCard>
      </div>

      {/* Chart */}
      <GlassCard className="p-6 border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white">Monthly Transaction Volume &amp; Wire Fees ($)</h2>
        <div className="h-[320px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }} />
              <Area type="monotone" dataKey="volume" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
