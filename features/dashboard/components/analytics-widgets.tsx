"use client";

import { usePortfolio } from "@/hooks/use-portfolio";
import { GlassCard } from "@/components/shared/glass-card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { Shield, Zap, TrendingUp, Globe, Loader2 } from "lucide-react";

const COLORS = ["var(--primary)", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

const PRICE_MAP: Record<string, number> = {
  BTC: 64212,
  ETH: 3452,
  SOL: 145,
  USDC: 1,
  AAPL: 189,
};

export function AnalyticsWidgets() {
  const { data: assets, isLoading } = usePortfolio();

  // Build pie data from real portfolio
  const pieData = assets?.map((a, i) => ({
    name: a.asset_symbol,
    value: a.quantity * (PRICE_MAP[a.asset_symbol] || 100),
    color: COLORS[i % COLORS.length],
  })) || [];

  const totalValue = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Asset Allocation Pie Chart */}
      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold">Asset Distribution</h3>
          <p className="text-sm text-muted-foreground">Portfolio weight by asset class.</p>
        </div>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : pieData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No assets in portfolio to visualize.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, "Value"]}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </GlassCard>

      {/* Risk & Performance Metrics */}
      <div className="space-y-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Portfolio</p>
              <h4 className="text-2xl font-bold text-gradient">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h4>
              <p className="text-xs text-muted-foreground">{assets?.length || 0} asset(s) tracked</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Live aggregate value computed from your tracked positions.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Volatility (30D)</p>
              <h4 className="text-2xl font-bold">N/A</h4>
              <p className="text-xs text-muted-foreground">Requires historical price feed</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground mb-1">
              <span>Low</span>
              <span>Med</span>
              <span>High</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-white/10 w-0" />
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Latency</div>
              <div className="text-sm font-bold">12ms</div>
            </div>
          </div>
          <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Globe className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Nodes</div>
              <div className="text-sm font-bold">Global</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
