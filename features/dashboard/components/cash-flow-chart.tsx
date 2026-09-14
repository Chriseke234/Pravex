"use client";

import { useState, useMemo } from "react";
import { TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { formatCurrency } from "@/lib/utils/formatters";
import { useWallet } from "@/hooks/use-wallet";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CashFlowChart() {
  const { transactions } = useWallet();
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("6M");

  const { chartData, totalInflow, totalOutflow, netSurplus } = useMemo(() => {
    // Generate last 6 months buckets
    const now = new Date();
    const months: { month: string; inflow: number; outflow: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: MONTH_NAMES[d.getMonth()],
        inflow: 0,
        outflow: 0,
      });
    }

    let inSum = 0;
    let outSum = 0;

    if (transactions && transactions.length > 0) {
      transactions.forEach((tx) => {
        const txDate = new Date(tx.created_at);
        const monthName = MONTH_NAMES[txDate.getMonth()];
        const bucket = months.find((m) => m.month === monthName);

        const isDeposit = tx.type?.toLowerCase() === "deposit" || tx.type?.toLowerCase() === "credit";
        const amt = Number(tx.amount) || 0;

        if (isDeposit) {
          inSum += amt;
          if (bucket) bucket.inflow += amt;
        } else {
          outSum += amt;
          if (bucket) bucket.outflow += amt;
        }
      });
    }

    return {
      chartData: months,
      totalInflow: inSum,
      totalOutflow: outSum,
      netSurplus: inSum - outSum,
    };
  }, [transactions]);

  return (
    <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Cash Flow &amp; Liquidity Analysis</h3>
              <p className="text-xs text-slate-400">Money In vs. Money Out (Real Settlement Flows)</p>
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-[#080F1A] p-1 rounded-xl border border-[#17293F] self-stretch sm:self-auto justify-between sm:justify-start">
          {(["1M", "3M", "6M", "1Y"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === period
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#080F1A]/70 border border-[#17293F] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Inflow</span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{formatCurrency(totalInflow)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#080F1A]/70 border border-[#17293F] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Outflow</span>
            <p className="text-base font-bold text-slate-300 font-mono mt-0.5">{formatCurrency(totalOutflow)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#080F1A]/70 border border-[#17293F] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Net Flow</span>
            <p className="text-base font-bold text-amber-400 font-mono mt-0.5">
              {netSurplus >= 0 ? "+" : ""}{formatCurrency(netSurplus)}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#17293F" vertical={false} opacity={0.6} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0C1A2E",
                borderColor: "#17293F",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString()}`,
                name === "inflow" ? "Money In (Inflow)" : "Money Out (Outflow)",
              ]}
            />
            <Bar dataKey="inflow" fill="#D4A72C" radius={[6, 6, 0, 0]} maxBarSize={28} />
            <Bar dataKey="outflow" fill="#1C3254" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
