"use client";

import { useState } from "react";
import { useVaults } from "@/hooks/use-vaults";
import { useTransactions } from "@/hooks/use-transactions";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw,
  Shield,
  CreditCard,
  Building,
  TrendingUp,
  Loader2,
  X
} from "lucide-react";

export function WalletOverview() {
  const { vaults, isLoading } = useVaults();
  const { createTransaction } = useTransactions();

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"Deposit" | "Withdrawal">("Deposit");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("USDC");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive wallet balances from vaults
  const totalBalance = vaults?.reduce((sum, v) => sum + Number(v.balance_usd || 0), 0) || 0;
  const vaultBalance = vaults
    ?.filter(v => v.threshold_m > 1)
    .reduce((sum, v) => sum + Number(v.balance_usd || 0), 0) || 0;
  const spotBalance = totalBalance - vaultBalance;

  const openModal = (action: "Deposit" | "Withdrawal") => {
    setModalAction(action);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setIsSubmitting(true);
    try {
      await createTransaction.mutateAsync({
        type: modalAction,
        asset,
        amount: Number(amount),
        amount_usd: Number(amount) * (asset === "BTC" ? 64000 : asset === "ETH" ? 3400 : asset === "SOL" ? 140 : 1),
        status: modalAction === "Withdrawal" ? "Pending" : "Completed",
      });
      setShowModal(false);
      setAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
            <h3 className="text-3xl font-bold">${spotBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Single-signature accounts
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="premium" size="sm" className="flex-1 gap-2" onClick={() => openModal("Deposit")}>
              <Plus className="w-4 h-4" /> Deposit
            </Button>
            <Button variant="glass" size="sm" className="flex-1 gap-2" onClick={() => openModal("Withdrawal")}>
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
            <h3 className="text-3xl font-bold">${vaultBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Multi-signature protection active
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="glass" size="sm" className="w-full gap-2" onClick={() => openModal("Deposit")}>
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
            <h3 className="text-3xl font-bold">$0.00</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              No active staking positions
            </p>
          </div>
          <div className="flex gap-2 mt-8">
            <Button variant="glass" size="sm" className="w-full gap-2">
              Stake More
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Deposit / Withdraw Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-primary/20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{modalAction}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset</label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              {modalAction === "Withdrawal" && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-500 font-medium">
                    Withdrawals require multi-signature approval and will be routed to the Action Required queue.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <Button variant="glass" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button
                variant="premium"
                className="flex-1"
                onClick={handleSubmit}
                disabled={!amount || isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Confirm ${modalAction}`}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
