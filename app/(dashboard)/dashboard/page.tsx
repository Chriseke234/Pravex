"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Welcome back, John. Here is your portfolio performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" size="sm">Download Report</Button>
          <Button variant="premium" size="sm">Execute Trade</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={staggerItem}>
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-2xl font-bold">$1,245,682.42</div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -2.1%
              </span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Positions</div>
              <div className="text-2xl font-bold">24</div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +4.8%
              </span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">24h PnL</div>
              <div className="text-2xl font-bold">+$52,410.12</div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-xs font-bold text-muted-foreground">Institutional</span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Account Status</div>
              <div className="text-2xl font-bold">Verified</div>
            </div>
          </GlassCard>
        </motion.div>
      </StaggerContainer>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Activity Preview */}
        <FadeIn direction="up" className="lg:col-span-2">
          <GlassCard className="p-6 h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Market Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="text-muted-foreground text-sm italic">Analytics chart placeholder - Integration pending Phase 4.3</p>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Recent Transactions */}
        <FadeIn direction="up" delay={0.2}>
          <GlassCard className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Flows</h2>
              <Button variant="ghost" size="sm">View History</Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      i % 2 === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {i % 2 === 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{i % 2 === 0 ? "Deposit" : "Withdrawal"}</div>
                      <div className="text-xs text-muted-foreground">Today, 10:45 AM</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-sm font-bold", i % 2 === 0 ? "text-emerald-500" : "text-rose-500")}>
                      {i % 2 === 0 ? "+" : "-"}${ (Math.random() * 5000).toFixed(2) }
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}

