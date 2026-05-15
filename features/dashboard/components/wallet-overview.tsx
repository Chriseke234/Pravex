"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Shield,
  CreditCard,
  Building
} from "lucide-react";

export function WalletOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Spot Wallet */}
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10 group-hover:bg-primary/20 transition-all" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-primary/20 rounded-xl">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Spot Balance</p>
            <h3 className="text-3xl font-bold">$842,560.12</h3>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +2.4% ($19,230.00)
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="premium" size="sm" className="flex-1 gap-2">
              <Plus className="w-4 h-4" /> Deposit
            </Button>
            <Button variant="glass" size="sm" className="flex-1 gap-2">
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        </GlassCard>

        {/* Institutional Vault */}
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -z-10 group-hover:bg-blue-500/20 transition-all" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Building className="w-5 h-5 text-blue-500" />
            </div>
            <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tighter">
              Secured
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Vault Balance</p>
            <h3 className="text-3xl font-bold">$403,122.30</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Multi-signature protection active
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="glass" size="sm" className="w-full gap-2">
              Manage Vault Assets
            </Button>
          </div>
        </GlassCard>

        {/* Staked / Yield */}
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -z-10 group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter">
              Yield Active
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Staked Assets</p>
            <h3 className="text-3xl font-bold">$125,440.00</h3>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              8.5% Avg. APY
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="glass" size="sm" className="w-full gap-2">
              Stake More
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

import { TrendingUp } from "lucide-react";
