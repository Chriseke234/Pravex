"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

const MOCK_DATA = [
  { date: "May 01", value: 1120000 },
  { date: "May 03", value: 1145000 },
  { date: "May 05", value: 1130000 },
  { date: "May 07", value: 1160000 },
  { date: "May 09", value: 1190000 },
  { date: "May 11", value: 1185000 },
  { date: "May 13", value: 1210000 },
  { date: "May 15", value: 1245682 },
];

const TIMEFRAMES = ["1D", "1W", "1M", "1Y", "ALL"];

export function PortfolioChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1M");

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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA}>
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
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
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
      </div>
    </GlassCard>
  );
}
