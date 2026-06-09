"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useNotifications } from "@/hooks/use-notifications";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  RefreshCw, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Wallet as WalletIcon,
  Bell,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FiatWallet() {
  const { wallet, transactions, isLoading, requestDeposit, requestWithdrawal } = useWallet();
  const { notifications, markAsRead } = useNotifications();

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositProvider, setDepositProvider] = useState("Bank Wire");
  const [depositReference, setDepositReference] = useState("");
  const [depositSuccessMsg, setDepositSuccessMsg] = useState("");

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setDepositSuccessMsg("");
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }
    if (!depositReference.trim()) {
      setErrorMsg("Please enter a deposit reference code.");
      return;
    }

    try {
      await requestDeposit.mutateAsync({
        amount: Number(depositAmount),
        provider: depositProvider,
        reference: depositReference.trim(),
      });
      setDepositSuccessMsg("Deposit request submitted! Awaiting admin verification.");
      setDepositAmount("");
      setDepositReference("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit deposit.");
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setWithdrawSuccessMsg("");
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }
    if (wallet && Number(withdrawAmount) > wallet.balance) {
      setErrorMsg("Insufficient balance.");
      return;
    }
    if (!bankName.trim() || !accountName.trim() || !accountNumber.trim()) {
      setErrorMsg("Please fill in all banking details.");
      return;
    }

    try {
      await requestWithdrawal.mutateAsync({
        amount: Number(withdrawAmount),
        bankName: bankName.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
      });
      setWithdrawSuccessMsg("Withdrawal request submitted! Awaiting admin approval.");
      setWithdrawAmount("");
      setBankName("");
      setAccountName("");
      setAccountNumber("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit withdrawal.");
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
    <div className="space-y-8">
      {/* Wallet Balance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <GlassCard className="p-8 relative overflow-hidden group lg:col-span-2 bg-gradient-to-br from-primary/10 via-black/40 to-blue-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-all" />
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <WalletIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Funding Balance</span>
              <div className="text-xs text-emerald-500 font-medium">Verified Account</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Available Cash Balance</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white">
              ${wallet?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </h2>
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="premium" className="flex-1 gap-2 py-6 rounded-2xl font-bold" onClick={() => { setShowDepositModal(true); setErrorMsg(""); setDepositSuccessMsg(""); }}>
              <Plus className="w-5 h-5" /> Deposit Funds
            </Button>
            <Button variant="glass" className="flex-1 gap-2 py-6 rounded-2xl font-bold" onClick={() => { setShowWithdrawModal(true); setErrorMsg(""); setWithdrawSuccessMsg(""); }}>
              <ArrowUpRight className="w-5 h-5" /> Withdraw Funds
            </Button>
          </div>
        </GlassCard>

        {/* Notifications Sidebar */}
        <GlassCard className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Wallet Notifications
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium uppercase">Recent</span>
          </div>

          <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No recent notifications</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={cn("p-3 rounded-xl border transition-all text-xs relative group", notif.read ? "bg-white/[0.01] border-white/5 text-muted-foreground" : "bg-primary/5 border-primary/20 text-white")}>
                  <div className="font-bold mb-1">{notif.title}</div>
                  <p className="leading-relaxed">{notif.message}</p>
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead.mutate(notif.id)} 
                      className="absolute top-2 right-2 text-primary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* Transactions History */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold px-2">Cash Transaction History</h3>
        <GlassCard className="p-0 overflow-hidden border-white/5">
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground space-y-2">
              <Clock className="w-8 h-8 mx-auto text-white/10" />
              <p className="text-sm">No transaction records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference / ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {tx.reference || tx.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                          tx.type === "deposit" || tx.type === "credit" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {tx.type === "deposit" || tx.type === "credit" ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold">
                        {tx.type === "deposit" || tx.type === "credit" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border",
                          tx.status === "completed" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          tx.status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                          tx.status === "failed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {tx.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : 
                           tx.status === "pending" ? <Clock className="w-3 h-3" /> : 
                           <AlertCircle className="w-3 h-3" />}
                          {tx.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </section>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-primary/20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6 text-primary" /> Deposit Cash
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDepositModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {depositSuccessMsg ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Request Submitted</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{depositSuccessMsg}</p>
                </div>
                <Button variant="premium" className="w-full" onClick={() => setShowDepositModal(false)}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Provider Method</label>
                  <select
                    value={depositProvider}
                    onChange={(e) => setDepositProvider(e.target.value)}
                    className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
                  >
                    <option value="Bank Wire">Bank Wire Transfer</option>
                    <option value="Stripe">Instant Credit Card (Stripe)</option>
                    <option value="FedWire">FedWire Settlement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deposit Transaction Reference</label>
                  <Input
                    type="text"
                    placeholder="e.g. WIRE-98319-X"
                    value={depositReference}
                    onChange={(e) => setDepositReference(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Provide the unique reference number from your wire transfer slip.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button type="button" variant="glass" className="flex-1 rounded-xl" onClick={() => setShowDepositModal(false)}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="premium"
                    className="flex-1 rounded-xl"
                    disabled={requestDeposit.isPending}
                  >
                    {requestDeposit.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-primary/20">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ArrowUpRight className="w-6 h-6 text-primary" /> Withdraw Cash
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowWithdrawModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {withdrawSuccessMsg ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Request Submitted</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{withdrawSuccessMsg}</p>
                </div>
                <Button variant="premium" className="w-full" onClick={() => setShowWithdrawModal(false)}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (USD)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Available: ${wallet?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bank Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. JPMorgan Chase"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Ironbridge Trust Ltd"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number (IBAN / ACH)</label>
                  <Input
                    type="text"
                    placeholder="e.g. US42 3918 2093 1029 39"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button type="button" variant="glass" className="flex-1 rounded-xl" onClick={() => setShowWithdrawModal(false)}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="premium"
                    className="flex-1 rounded-xl"
                    disabled={requestWithdrawal.isPending}
                  >
                    {requestWithdrawal.isPending ? "Submitting..." : "Submit Withdrawal"}
                  </Button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
