"use client";

import { useState } from "react";
import { TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { formatCurrency } from "@/lib/utils/formatters";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const MONTHLY_FLOWS = [
  { month: "Jan", inflow: 42000, outflow: 28500 },
  { month: "Feb", inflow: 58000, outflow: 34200 },
  { month: "Mar", inflow: 64000, outflow: 41000 },
  { month: "Apr", inflow: 51000, outflow: 39500 },
  { month: "May", inflow: 78000, outflow: 46000 },
  { month: "Jun", inflow: 92000, outflow: 52000 },
  { month: "Jul", inflow: 88500, outflow: 49800 },
];

export function CashFlowChart() {
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("6M");

  const totalInflow = MONTHLY_FLOWS.reduce((acc, curr) => acc + curr.inflow, 0);
  const totalOutflow = MONTHLY_FLOWS.reduce((acc, curr) => acc + curr.outflow, 0);
  const netSurplus = totalInflow - totalOutflow;

  return (
    <GlassCard className="p-5 sm:p-6 bg-slate-900/80 border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Cash Flow &amp; Liquidity Analysis</h3>
              <p className="text-xs text-slate-400">Money In vs. Money Out (Inflows &amp; Expenditures)</p>
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
          {(["1M", "3M", "6M", "1Y"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === period
                  ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
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
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Inflow</span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{formatCurrency(totalInflow)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Outflow</span>
            <p className="text-base font-bold text-slate-300 font-mono mt-0.5">{formatCurrency(totalOutflow)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Net Surplus</span>
            <p className="text-base font-bold text-amber-400 font-mono mt-0.5">+{formatCurrency(netSurplus)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_FLOWS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
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
                backgroundColor: "#0b0f17",
                borderColor: "#1e293b",
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
            <Bar dataKey="outflow" fill="#334155" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
