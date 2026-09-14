"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Globe, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  Filter,
  Calendar,
  Layers,
  Zap,
  ShieldAlert
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { cn } from "@/lib/utils";

const CORRELATION_DATA = [
  { asset: "BTC/USD", correlation: 0.92, status: "High" },
  { asset: "ETH/USD", correlation: 0.88, status: "High" },
  { asset: "S&P 500", correlation: 0.45, status: "Medium" },
  { asset: "GOLD", correlation: -0.12, status: "Low" },
  { asset: "DXY", correlation: -0.65, status: "Inverse" },
];

const SECTOR_ALLOCATION = [
  { name: "DeFi", value: 400, color: "#3b82f6" },
  { name: "Layer 1", value: 300, color: "#6366f1" },
  { name: "Stablecoins", value: 200, color: "#10b981" },
  { name: "Gaming/AI", value: 100, color: "#f59e0b" },
];

const PREDICTIVE_DATA = [
  { time: "00:00", actual: 100, pred: 100 },
  { time: "04:00", actual: 110, pred: 108 },
  { time: "08:00", actual: 105, pred: 112 },
  { time: "12:00", actual: 120, pred: 118 },
  { time: "16:00", actual: 125, pred: 130 },
  { time: "20:00", actual: null, pred: 135 },
  { time: "23:59", actual: null, pred: 140 },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleCycleTimeframe = () => {
    const frames = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Year to Date (YTD)"];
    const currentIndex = frames.indexOf(timeframe);
    const nextIndex = (currentIndex + 1) % frames.length;
    setTimeframe(frames[nextIndex]);
  };

  const handleExportReport = () => {
    const reportContent =
      "IRON BRIDGE BANKING — INSTITUTIONAL ANALYTICS & INTELLIGENCE REPORT\n" +
      `Generated: ${new Date().toUTCString()}\n` +
      `Timeframe: ${timeframe}\n` +
      `============================================================\n` +
      `RISK METRICS:\n` +
      `- Sharpe Ratio: 3.42\n` +
      `- Volatility (30d): 12.8%\n` +
      `- Max Drawdown: -4.2%\n` +
      `- Alpha Generation: +1.85\n\n` +
      `ASSET CORRELATIONS:\n` +
      CORRELATION_DATA.map((c) => `- ${c.asset}: ${(c.correlation * 100).toFixed(0)}% (${c.status})`).join("\n") +
      `\n\nSECTOR ALLOCATION:\n` +
      SECTOR_ALLOCATION.map((s) => `- ${s.name}: ${s.value} USD Units`).join("\n") +
      `\n============================================================\n` +
      `STATUS: VERIFIED BY QUANTITATIVE TREASURY ENGINE`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ironbridge_analytics_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = (title: string, impact: string) => {
    setActiveScenario(`${title}: Projected PnL ${impact}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground">Institutional-grade intelligence and performance modeling.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" size="sm" className="gap-2" onClick={handleCycleTimeframe}>
            <Calendar className="w-4 h-4" /> {timeframe}
          </Button>
          <Button variant="premium" size="sm" className="gap-2" onClick={handleExportReport}>
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Predictive Modeling */}
        <GlassCard className="lg:col-span-2 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold">Predictive Performance</h2>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-primary rounded-full" /> Actual
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-white/20 rounded-full border border-dashed border-white/40" /> Forecast
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREDICTIVE_DATA}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="actual" stroke="var(--primary)" strokeWidth={3} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="pred" stroke="#ffffff40" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Risk Metrics */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold">Risk Management</h2>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-xl font-bold text-emerald-400">3.42</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-sm text-muted-foreground">Volatility ({timeframe})</div>
              <div className="text-xl font-bold">12.8%</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
              <div className="text-xl font-bold text-rose-400">-4.2%</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-sm text-muted-foreground">Alpha</div>
              <div className="text-xl font-bold text-emerald-400">+1.85</div>
            </div>
          </div>
        </GlassCard>

        {/* Market Correlation */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold">Asset Correlation</h2>
          </div>
          <div className="space-y-4">
            {CORRELATION_DATA.map((item) => (
              <div key={item.asset} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.asset}</span>
                  <span className={cn(
                    item.correlation > 0.8 ? "text-rose-400" : 
                    item.correlation < 0 ? "text-emerald-400" : "text-muted-foreground"
                  )}>
                    {(item.correlation * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      item.correlation > 0.8 ? "bg-rose-500" : 
                      item.correlation < 0 ? "bg-emerald-500" : "bg-indigo-500"
                    )} 
                    style={{ width: `${Math.abs(item.correlation) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Sector Allocation */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold">Exposure by Sector</h2>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SECTOR_ALLOCATION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SECTOR_ALLOCATION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTOR_ALLOCATION.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Intelligence Feed */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Institutional Intelligence</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Market Pulse</span>
                  <span className="text-[10px] text-muted-foreground">2h ago</span>
                </div>
                <h4 className="text-sm font-bold mb-1">Global Liquidity Inflow: Tier 1 Banks</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Whale alerts indicate a 400% increase in institutional OTC desk activity for ETH...
                </p>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full text-xs h-9"
            onClick={() => {
              const el = document.getElementById("stress-test-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Full Terminal
          </Button>
        </GlassCard>

      </div>

      {/* Scenario Simulator */}
      <section id="stress-test-section" className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Stress Test &amp; Scenario Simulator</h2>
          </div>
          {activeScenario && (
            <span className="text-xs font-semibold px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
              Active Simulation: {activeScenario}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Market Correction", risk: "High", impact: "-15.2%", color: "text-rose-400" },
            { title: "Stagnant Growth", risk: "Low", impact: "+2.1%", color: "text-amber-400" },
            { title: "Bull Expansion", risk: "Medium", impact: "+24.5%", color: "text-emerald-400" },
          ].map((scenario) => (
            <GlassCard 
              key={scenario.title} 
              onClick={() => handleRunSimulation(scenario.title, scenario.impact)}
              className="p-6 space-y-4 group hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{scenario.title}</h3>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10", scenario.color)}>
                  {scenario.risk} Risk
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-3xl font-bold", scenario.color)}>{scenario.impact}</span>
                <span className="text-xs text-muted-foreground">Projected PnL</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-amber-400">Run Simulation</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
