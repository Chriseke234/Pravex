"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Ban, 
  UserCheck,
  PlusCircle,
  Receipt,
  History,
  Edit,
  Loader2,
  X,
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

export type UserWithWallet = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  tier: string;
  risk_score?: string;
  suspended: boolean;
  created_at: string;
  wallets: { id: string; balance: number } | null;
};

export type WalletTx = {
  id: string;
  wallet_id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "credit" | "debit";
  status: "pending" | "completed" | "failed";
  reference: string | null;
  description: string | null;
  created_at: string;
};

interface UserTableProps {
  isAdminOnly?: boolean;
}

export function UserTable({ isAdminOnly = false }: UserTableProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null);
  const [showIncreaseBalanceModal, setShowIncreaseBalanceModal] = useState(false);
  const [showCreateTxModal, setShowCreateTxModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingTx, setEditingTx] = useState<WalletTx | null>(null);

  // Form States - Increase Balance
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [increaseReason, setIncreaseReason] = useState("");

  // Form States - Create Transaction
  const [txType, setTxType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [txAmount, setTxAmount] = useState("");
  const [txStatus, setTxStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [txReference, setTxReference] = useState("");
  const [txDescription, setTxDescription] = useState("");

  // Form States - Edit Transaction
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [editStatus, setEditStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [editReference, setEditReference] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Common UI states
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Query Users & Wallets
  const usersQuery = useQuery<UserWithWallet[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          role,
          tier,
          risk_score,
          suspended,
          created_at,
          wallets:wallets ( id, balance )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data as any[]).map(u => ({
        ...u,
        suspended: !!u.suspended,
        wallets: Array.isArray(u.wallets) ? u.wallets[0] || null : u.wallets || null
      })) as UserWithWallet[];
    }
  });

  // Query User Transactions for History Modal
  const userTxQuery = useQuery<WalletTx[]>({
    queryKey: ["user-wallet-transactions", selectedUser?.wallets?.id],
    enabled: !!selectedUser?.wallets?.id && showHistoryModal,
    queryFn: async () => {
      if (!selectedUser?.wallets?.id) return [];
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", selectedUser.wallets.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WalletTx[];
    }
  });

  // Helper: Ensure user wallet exists
  const ensureWallet = async (userId: string) => {
    const { data: existing } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) return existing;

    const { data: created, error: createErr } = await supabase
      .from("wallets")
      .insert([{ user_id: userId, balance: 0.00 }])
      .select()
      .single();

    if (createErr) throw createErr;
    return created;
  };

  // Action Handler: Increase Balance
  const handleIncreaseBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = Number(increaseAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Please enter a valid positive number.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const wallet = await ensureWallet(selectedUser.id);
      const { data: { session } } = await supabase.auth.getSession();

      const ref = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
      const desc = increaseReason.trim() || "Account balance increase by administrator";

      // Insert transaction - DB trigger handle_new_wallet_transaction updates balance when completed
      const { error: txErr } = await supabase
        .from("wallet_transactions")
        .insert([{
          wallet_id: wallet.id,
          amount: val,
          type: "credit",
          status: "completed",
          reference: ref,
          description: desc
        }]);

      if (txErr) throw txErr;

      // Audit Log
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: "balance_increase",
        target: selectedUser.id,
        metadata: { amount: val, description: desc, reference: ref }
      }]);

      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setShowIncreaseBalanceModal(false);
      setIncreaseAmount("");
      setIncreaseReason("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to increase user balance.");
    } finally {
      setSubmitting(false);
    }
  };

  // Action Handler: Create Transaction History
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = Number(txAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Please enter a valid positive transaction amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const wallet = await ensureWallet(selectedUser.id);
      const { data: { session } } = await supabase.auth.getSession();

      const ref = txReference.trim() || `TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const desc = txDescription.trim() || `Administrative ${txType} entry`;

      const { error: txErr } = await supabase
        .from("wallet_transactions")
        .insert([{
          wallet_id: wallet.id,
          amount: val,
          type: txType,
          status: txStatus,
          reference: ref,
          description: desc
        }]);

      if (txErr) throw txErr;

      // Audit Log
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: "create_transaction",
        target: selectedUser.id,
        metadata: { amount: val, type: txType, status: txStatus, reference: ref }
      }]);

      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setShowCreateTxModal(false);
      setTxAmount("");
      setTxReference("");
      setTxDescription("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create transaction record.");
    } finally {
      setSubmitting(false);
    }
  };

  // Action Handler: Edit Transaction History
  const handleEditTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !editingTx || !selectedUser.wallets) return;
    const newAmt = Number(editAmount);
    if (isNaN(newAmt) || newAmt <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // 1. Update the wallet transaction record
      const { error: updateErr } = await supabase
        .from("wallet_transactions")
        .update({
          amount: newAmt,
          type: editType,
          status: editStatus,
          reference: editReference.trim() || null,
          description: editDescription.trim() || null
        })
        .eq("id", editingTx.id);

      if (updateErr) throw updateErr;

      // 2. Adjust balance if status or amount/type changed
      let balanceDelta = 0;
      // Revert old effect if old tx was completed
      if (editingTx.status === "completed") {
        if (editingTx.type === "deposit" || editingTx.type === "credit") {
          balanceDelta -= Number(editingTx.amount);
        } else {
          balanceDelta += Number(editingTx.amount);
        }
      }
      // Apply new effect if new status is completed
      if (editStatus === "completed") {
        if (editType === "deposit" || editType === "credit") {
          balanceDelta += newAmt;
        } else {
          balanceDelta -= newAmt;
        }
      }

      if (balanceDelta !== 0) {
        const { data: currWallet } = await supabase
          .from("wallets")
          .select("balance")
          .eq("id", selectedUser.wallets.id)
          .single();

        if (currWallet) {
          const updatedBal = Math.max(0, Number(currWallet.balance) + balanceDelta);
          await supabase
            .from("wallets")
            .update({ balance: updatedBal, updated_at: new Date().toISOString() })
            .eq("id", selectedUser.wallets.id);
        }
      }

      // Audit Log
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: "edit_transaction",
        target: selectedUser.id,
        metadata: { tx_id: editingTx.id, old_amount: editingTx.amount, new_amount: newAmt }
      }]);

      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      queryClient.invalidateQueries({ queryKey: ["user-wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setEditingTx(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  // Suspension Toggle Mutation
  const toggleSuspensionMutation = useMutation({
    mutationFn: async ({ userId, suspended }: { userId: string; suspended: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase
        .from("profiles")
        .update({ suspended })
        .eq("id", userId);
      if (error) throw error;

      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: suspended ? "user_suspension" : "user_activation",
        target: userId,
        metadata: { suspended }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    }
  });

  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const filteredUsers = usersQuery.data?.filter(u => 
    (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="bg-black/20 border-white/10 rounded-xl pl-10 text-xs focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Total Accounts: {filteredUsers.length}
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Account</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Balance</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No registered user accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-sm text-amber-400">
                          {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{user.full_name || "Account User"}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
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
                        {user.tier || "Starter"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-white">
                      ${user.wallets?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-bold text-sm",
                        (user.risk_score || "Low") === "Low" ? "text-emerald-500" : 
                        user.risk_score === "Medium" ? "text-amber-500" : 
                        "text-rose-500"
                      )}>
                        {user.risk_score || "Low"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                        !user.suspended ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {!user.suspended ? <ShieldCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {!user.suspended ? "Active" : "Suspended"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* Increase Balance Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 gap-1 text-xs border border-emerald-500/20"
                          onClick={() => {
                            setSelectedUser(user);
                            setIncreaseAmount("");
                            setIncreaseReason("");
                            setErrorMsg("");
                            setShowIncreaseBalanceModal(true);
                          }}
                          title="Increase Account Balance"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Increase Balance</span>
                        </Button>

                        {/* Create Transaction Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 gap-1 text-xs border border-blue-500/20"
                          onClick={() => {
                            setSelectedUser(user);
                            setTxAmount("");
                            setTxReference("");
                            setTxDescription("");
                            setErrorMsg("");
                            setShowCreateTxModal(true);
                          }}
                          title="Create Transaction Record"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Add History</span>
                        </Button>

                        {/* View & Edit Transaction History Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 gap-1 text-xs border border-amber-500/20"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowHistoryModal(true);
                          }}
                          title="View and Edit Transaction History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </Button>

                        {/* Suspension Toggle */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(
                            "h-8 w-8 rounded-lg border border-white/5",
                            user.suspended ? "text-emerald-400 hover:bg-emerald-500/10" : "text-rose-400 hover:bg-rose-500/10"
                          )}
                          onClick={() => toggleSuspensionMutation.mutate({ userId: user.id, suspended: !user.suspended })}
                          title={user.suspended ? "Activate User Account" : "Suspend User Account"}
                        >
                          {user.suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── MODAL 1: INCREASE BALANCE DIRECTLY ────────────────────── */}
      {showIncreaseBalanceModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-6 relative border-emerald-500/30">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-emerald-400">
                <PlusCircle className="w-5 h-5" /> Increase Account Balance
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowIncreaseBalanceModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleIncreaseBalance} className="space-y-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs space-y-1">
                <p className="text-slate-300">Target User: <strong className="text-white">{selectedUser.full_name || selectedUser.email}</strong></p>
                <p className="text-slate-300">Current Balance: <strong className="text-emerald-400">${selectedUser.wallets?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</strong></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount to Add (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 50000.00"
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(e.target.value)}
                    className="pl-9 bg-black/40 border-white/10 rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reason / Description</label>
                <Input
                  type="text"
                  placeholder="e.g. Executive Credit Boost / Direct Wire Approval"
                  value={increaseReason}
                  onChange={(e) => setIncreaseReason(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowIncreaseBalanceModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold" disabled={submitting}>
                  {submitting ? "Processing..." : "Confirm Increase"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ── MODAL 2: CREATE TRANSACTION HISTORY ───────────────────── */}
      {showCreateTxModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-6 relative border-blue-500/30">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-blue-400">
                <Receipt className="w-5 h-5" /> Create Transaction Record
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowCreateTxModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-xs">
                <p className="text-slate-300">Account: <strong className="text-white">{selectedUser.full_name || selectedUser.email}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  >
                    <option value="deposit">Deposit (Credit)</option>
                    <option value="withdrawal">Withdrawal (Debit)</option>
                    <option value="credit">Direct Credit</option>
                    <option value="debit">Direct Debit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                  <select
                    value={txStatus}
                    onChange={(e) => setTxStatus(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  >
                    <option value="completed">Completed (Updates Balance)</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference Code (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. TX-98421"
                  value={txReference}
                  onChange={(e) => setTxReference(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Input
                  type="text"
                  placeholder="e.g. SWIFT Wire Deposit from Barclays"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowCreateTxModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold" disabled={submitting}>
                  {submitting ? "Saving..." : "Create Record"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ── MODAL 3: VIEW & EDIT TRANSACTION HISTORY ────────────────── */}
      {showHistoryModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-3xl w-full p-6 space-y-6 relative border-amber-500/30 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2 text-amber-400">
                  <History className="w-5 h-5" /> Account Transaction History
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  User: <strong>{selectedUser.full_name || selectedUser.email}</strong>
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowHistoryModal(false); setEditingTx(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Editing Sub-form if active */}
            {editingTx ? (
              <form onSubmit={handleEditTransactionSubmit} className="p-4 bg-white/[0.03] border border-amber-500/30 rounded-2xl space-y-4 shrink-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit Transaction ({editingTx.id.substring(0, 8)}...)
                  </h3>
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setEditingTx(null)}>
                    Cancel Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground">Type</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="w-full h-8 px-2 bg-black/60 border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground">Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="h-8 bg-black/60 border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full h-8 px-2 bg-black/60 border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground">Reference</label>
                    <Input
                      type="text"
                      value={editReference}
                      onChange={(e) => setEditReference(e.target.value)}
                      className="h-8 bg-black/60 border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground">Description</label>
                    <Input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="h-8 bg-black/60 border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingTx(null)}>Cancel</Button>
                  <Button type="submit" variant="premium" size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold" disabled={submitting}>
                    {submitting ? "Updating..." : "Save Transaction Changes"}
                  </Button>
                </div>
              </form>
            ) : null}

            {/* Transactions List */}
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {userTxQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              ) : !userTxQuery.data || userTxQuery.data.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No transaction history records found for this account.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase">Type</th>
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase">Amount</th>
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase">Ref & Description</th>
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase">Date</th>
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase">Status</th>
                      <th className="px-3 py-2 text-[9px] font-bold text-muted-foreground uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userTxQuery.data.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-2.5 text-xs font-bold capitalize text-white">{tx.type}</td>
                        <td className="px-3 py-2.5 text-xs font-mono font-bold text-white">
                          ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          <div className="font-mono text-[10px] text-muted-foreground">{tx.reference || "N/A"}</div>
                          <div className="text-[11px] text-slate-300 truncate max-w-[180px]">{tx.description || "—"}</div>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] text-muted-foreground">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                            tx.status === "completed" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                            tx.status === "pending" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                            tx.status === "failed" && "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg gap-1"
                            onClick={() => {
                              setEditingTx(tx);
                              setEditAmount(String(tx.amount));
                              setEditType(tx.type);
                              setEditStatus(tx.status);
                              setEditReference(tx.reference || "");
                              setEditDescription(tx.description || "");
                              setErrorMsg("");
                            }}
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
