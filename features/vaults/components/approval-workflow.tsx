"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const PENDING_TX = [
  { 
    id: "REQ-442", 
    vault: "Treasury Fund 1", 
    type: "Withdrawal", 
    asset: "BTC", 
    amount: "1.5000", 
    approvals: 1, 
    required: 3, 
    requester: "Admin Root",
    expiresIn: "14h 22m"
  },
  { 
    id: "REQ-443", 
    vault: "Cold Storage B", 
    type: "Key Rotation", 
    asset: "N/A", 
    amount: "N/A", 
    approvals: 2, 
    required: 5, 
    requester: "Security Officer",
    expiresIn: "42h 10m"
  },
];

export function ApprovalWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-xl font-bold">Action Required</h2>
          <p className="text-sm text-muted-foreground">Transactions awaiting your authorization.</p>
        </div>
        <Button variant="ghost" size="sm">View Queue</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PENDING_TX.map((tx) => (
          <GlassCard key={tx.id} className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{tx.type} Request</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{tx.id}</span>
                  </div>
                  <h4 className="text-lg font-bold">{tx.vault}</h4>
                  <p className="text-sm text-muted-foreground">
                    Requester: <span className="text-white font-medium">{tx.requester}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-6 border-l border-white/5 hidden lg:flex">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Asset & Amount</p>
                  <div className="font-mono text-sm">{tx.amount} {tx.asset}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Approvals</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(tx.required)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center",
                            i < tx.approvals ? "bg-emerald-500" : "bg-white/10"
                          )}
                        >
                          {i < tx.approvals && <UserCheck className="w-3 h-3 text-white" />}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold">{tx.approvals}/{tx.required}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" className="flex-1 lg:flex-none text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 h-10 px-6">
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button variant="premium" className="flex-1 lg:flex-none h-10 px-8">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Authorize
                </Button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" />
                Expires in {tx.expiresIn}
              </div>
              <Button variant="link" size="sm" className="text-xs h-auto p-0 gap-1 text-primary">
                View Policy <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
