"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Users, 
  History, 
  ArrowRight,
  Lock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultCardProps {
  id: string;
  name: string;
  balance: string;
  threshold: string;
  signers: number;
  pendingActions: number;
  type: "Hot" | "Cold" | "Institutional";
}

export function VaultCard({ id, name, balance, threshold, signers, pendingActions, type }: VaultCardProps) {
  return (
    <GlassCard className="p-6 space-y-6 group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 transition-all group-hover:opacity-100 opacity-50",
        type === "Institutional" ? "bg-primary/20" : 
        type === "Cold" ? "bg-blue-500/20" : "bg-amber-500/20"
      )} />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl border",
            type === "Institutional" ? "bg-primary/10 border-primary/20 text-primary" : 
            type === "Cold" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : 
            "bg-amber-500/10 border-amber-500/20 text-amber-500"
          )}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{id}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Threshold</span>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-xs font-bold">
            <Users className="w-3 h-3" />
            {threshold}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Value</p>
        <div className="text-2xl font-bold">{balance}</div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {type} Storage
          </div>
          <div className="flex items-center gap-1">
            <History className="w-3 h-3" />
            {signers} Signers
          </div>
        </div>
        
        {pendingActions > 0 && (
          <div className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
            {pendingActions} PENDING APPROVAL
          </div>
        )}
      </div>

      <Button variant="ghost" size="sm" className="w-full mt-2 group/btn justify-between hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20">
        Manage Vault
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </GlassCard>
  );
}
