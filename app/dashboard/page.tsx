"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Activity,
  ShieldCheck,
  Zap,
  X,
  RefreshCw
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/use-transactions";
import { useProfile } from "@/hooks/use-profile";
import { useVaults } from "@/hooks/use-vaults";

export default function DashboardOverview() {
  const { transactions, createTransaction } = useTransactions();
  const { profile } = useProfile();
  const { vaults } = useVaults();
  
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<"Deposit" | "Withdrawal" | "Trade">("Deposit");
  const [tradeAsset, setTradeAsset] = useState("BTC");
  const [tradeAmount, setTradeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recentTxs = transactions?.slice(0, 6) || [];
  const totalValue = vaults?.reduce((sum, v) => sum + Number(v.balance_usd || 0), 0) || 0;

  const handleExecuteTrade = async () => {
    if (!tradeAmount || isNaN(Number(tradeAmount))) return;
    setIsSubmitting(true);
    
    try {
      const mockUsdValue = Number(tradeAmount) * (tradeAsset === "BTC" ? 64000 : tradeAsset === "ETH" ? 3400 : tradeAsset === "SOL" ? 140 : 1);
      
      await createTransaction.mutateAsync({
        type: tradeType,
        asset: tradeAsset,
        amount: Number(tradeAmount),
        amount_usd: mockUsdValue,
        status: tradeType === "Withdrawal" ? "Pending" : "Completed" // Withdrawals require approval in our mock system
      });
      
      setShowTradeModal(false);
      setTradeAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || profile?.email || "User"}. Here is your portfolio performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" size="sm">Download Report</Button>
          <Button variant="premium" size="sm" onClick={() => setShowTradeModal(true)}>Execute Trade</Button>
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
              <div className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
              <div className="text-sm text-muted-foreground">Active Transactions</div>
              <div className="text-2xl font-bold">{transactions?.length || 0}</div>
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
              <span className="text-xs font-bold text-muted-foreground">{profile?.tier || "Starter"}</span>
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
              {recentTxs.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground text-sm">No recent transactions.</div>
              ) : (
                recentTxs.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
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
                        {tx.type === "Trade" && <RefreshCw className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{tx.type}</div>
                        <div className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-bold", 
                        tx.type === "Deposit" ? "text-emerald-500" : tx.type === "Withdrawal" ? "text-rose-500" : "text-white"
                      )}>
                        {tx.type === "Deposit" ? "+" : tx.type === "Withdrawal" ? "-" : ""}{tx.amount} {tx.asset}
                      </div>
                      <div className="text-xs text-muted-foreground">{tx.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Execute Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-primary/20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Simulate Transaction</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTradeModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Deposit", "Withdrawal", "Trade"] as const).map(type => (
                    <Button 
                      key={type}
                      variant={tradeType === type ? "premium" : "outline"}
                      className="w-full text-xs"
                      onClick={() => setTradeType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset</label>
                <select 
                  value={tradeAsset}
                  onChange={(e) => setTradeAsset(e.target.value)}
                  className="w-full h-10 px-3 bg-black/20 border border-white/10 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="bg-white/5 border-white/10" 
                />
              </div>

              {tradeType === "Withdrawal" && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-500 font-medium">
                    Note: Withdrawals require multi-signature approval. This transaction will be marked as "Pending" and routed to the Action Required queue.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <Button variant="glass" className="flex-1" onClick={() => setShowTradeModal(false)}>Cancel</Button>
              <Button 
                variant="premium" 
                className="flex-1" 
                onClick={handleExecuteTrade}
                disabled={!tradeAmount || isSubmitting}
              >
                {isSubmitting ? "Executing..." : "Confirm"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
