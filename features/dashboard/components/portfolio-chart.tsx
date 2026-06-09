"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useVaults } from "@/hooks/use-vaults";
import { GlassCard } from "@/components/shared/glass-card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMEFRAMES = ["1D", "1W", "1M", "1Y", "ALL"];

export function PortfolioChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");
  const { transactions, isLoading } = useTransactions();
  const { vaults } = useVaults();

  const currentTotal = vaults?.reduce((sum, v) => sum + Number(v.balance_usd || 0), 0) || 0;

  // Build chart data from transaction history (cumulative running total)
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Sort transactions oldest-first
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let runningTotal = 0;
    const points = sorted.map((tx) => {
      const usd = Number(tx.amount_usd || 0);
      if (tx.type === "Deposit") runningTotal += usd;
      else if (tx.type === "Withdrawal") runningTotal -= usd;
      
      return {
        date: new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Math.max(0, runningTotal),
      };
    });

    // Add current state as the final point
    points.push({
      date: "Now",
      value: currentTotal,
    });

    return points;
  }, [transactions, currentTotal]);

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground">Total growth across all accounts.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                activeTimeframe === tf 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="text-muted-foreground text-sm">
              No transaction history yet. Execute a trade to see your portfolio growth here.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }}
                tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
                itemStyle={{ color: 'var(--primary)' }}
                labelStyle={{ color: '#888', marginBottom: '4px' }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Value"]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}
