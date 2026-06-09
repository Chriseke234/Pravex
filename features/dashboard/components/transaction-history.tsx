"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionHistory({ limit }: { limit?: number }) {
  const { transactions, isLoading } = useTransactions();
  const displayedTransactions = transactions ? (limit ? transactions.slice(0, limit) : transactions) : [];

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">Detailed log of all financial activities.</p>
        </div>
        {!limit && (
          <div className="flex gap-2">
            <Button variant="glass" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button variant="glass" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : displayedTransactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No transactions found in the audit log.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedTransactions.map((tx) => {
                const dateObj = new Date(tx.created_at);
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === "Deposit" && "bg-emerald-500/10 text-emerald-500",
                          tx.type === "Withdrawal" && "bg-rose-500/10 text-rose-500",
                          tx.type === "Transfer" && "bg-blue-500/10 text-blue-500",
                          tx.type === "Trade" && "bg-primary/10 text-primary"
                        )}>
                          {tx.type === "Deposit" && <ArrowDownLeft className="w-5 h-5" />}
                          {tx.type === "Withdrawal" && <ArrowUpRight className="w-5 h-5" />}
                          {tx.type === "Transfer" && <ArrowRightLeft className="w-5 h-5" />}
                          {tx.type === "Trade" && <RefreshCw className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{tx.type}</div>
                          <div className="text-xs text-muted-foreground">{tx.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm">{tx.asset}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{tx.amount} {tx.asset.split('/')[0]}</div>
                      <div className="text-xs text-muted-foreground">${tx.amount_usd?.toLocaleString() || "0.00"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{dateStr}</div>
                      <div className="text-xs text-muted-foreground">{timeStr}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                        tx.status === "Completed" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        tx.status === "Pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        tx.status === "Failed" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                        tx.status === "Cancelled" && "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      )}>
                        {tx.status === "Completed" && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === "Pending" && <Clock className="w-3 h-3" />}
                        {(tx.status === "Failed" || tx.status === "Cancelled") && <XCircle className="w-3 h-3" />}
                        {tx.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {limit && displayedTransactions.length > 0 && (
        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
          <Button variant="link" className="text-sm text-primary">View Full History</Button>
        </div>
      )}
    </GlassCard>
  );
}
