"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ShieldAlert, 
  MoreHorizontal, 
  Mail, 
  ExternalLink,
  Ban,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const USERS = [
  { id: "USR-001", name: "Alice Johnson", email: "alice@institutional.com", status: "Verified", tier: "Professional", balance: "$1,240,500", risk: "Low" },
  { id: "USR-002", name: "Bob Smith", email: "bob@hedgefund.io", status: "Pending", tier: "Enterprise", balance: "$5,800,000", risk: "Medium" },
  { id: "USR-003", name: "Charlie Davis", email: "charlie@crypto-org.net", status: "Verified", tier: "Starter", balance: "$45,200", risk: "Low" },
  { id: "USR-004", name: "David Wilson", email: "david@vc-capital.com", status: "Suspended", tier: "Enterprise", balance: "$12,400,000", risk: "High" },
  { id: "USR-005", name: "Eve Miller", email: "eve@fintech-partners.org", status: "Verified", tier: "Professional", balance: "$890,000", risk: "Low" },
];

export function UserTable() {
  return (
    <GlassCard className="p-0 overflow-hidden border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tier</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Balance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk Score</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {USERS.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{user.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                    user.tier === "Enterprise" ? "bg-primary/10 text-primary border-primary/20" : 
                    user.tier === "Professional" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : 
                    "bg-muted/10 text-muted-foreground border-white/5"
                  )}>
                    {user.tier}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">{user.balance}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "font-bold text-sm",
                    user.risk === "Low" ? "text-emerald-500" : 
                    user.risk === "Medium" ? "text-amber-500" : 
                    "text-rose-500"
                  )}>
                    {user.risk}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                    user.status === "Verified" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    user.status === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    user.status === "Suspended" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  )}>
                    {user.status === "Verified" ? <ShieldCheck className="w-3 h-3" /> : 
                     user.status === "Suspended" ? <Ban className="w-3 h-3" /> : 
                     <ShieldAlert className="w-3 h-3" />}
                    {user.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-500">
                      <Ban className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
