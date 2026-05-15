"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { Shield, Zap, TrendingUp, Globe } from "lucide-react";

const DATA = [
  { name: "Bitcoin", value: 45, color: "var(--primary)" },
  { name: "Ethereum", value: 30, color: "#3b82f6" },
  { name: "Stablecoins", value: 15, color: "#10b981" },
  { name: "Equities", value: 10, color: "#8b5cf6" },
];

export function AnalyticsWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Asset Allocation Pie Chart */}
      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold">Asset Distribution</h3>
          <p className="text-sm text-muted-foreground">Portfolio weight by asset class.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {DATA.map((entry, index) => (
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
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Risk & Performance Metrics */}
      <div className="space-y-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sharpe Ratio</p>
              <h4 className="text-2xl font-bold text-gradient">2.45</h4>
              <p className="text-xs text-emerald-400 font-bold">+0.12 vs last month</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Excellent risk-adjusted returns compared to institutional benchmarks.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Volatility (30D)</p>
              <h4 className="text-2xl font-bold">12.8%</h4>
              <p className="text-xs text-muted-foreground">Stable Institutional Range</p>
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
              <div className="h-full bg-blue-500 w-[45%]" />
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
