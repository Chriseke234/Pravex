"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Search, 
  PlusCircle, 
  Edit, 
  Loader2, 
  X, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

type FullTx = {
  id: string;
  wallet_id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "credit" | "debit";
  status: "pending" | "completed" | "failed";
  reference: string | null;
  description: string | null;
  created_at: string;
  wallets: {
    id: string;
    user_id: string;
    profiles: {
      full_name: string | null;
      email: string;
    } | null;
  } | null;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string;
  wallets: { id: string; balance: number } | null;
};

export default function AdminTransactionsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTx, setEditingTx] = useState<FullTx | null>(null);

  // Form - Create
  const [targetUserId, setTargetUserId] = useState("");
  const [createType, setCreateType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [createAmount, setCreateAmount] = useState("");
  const [createStatus, setCreateStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [createRef, setCreateRef] = useState("");
  const [createDesc, setCreateDesc] = useState("");

  // Form - Edit
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [editStatus, setEditStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [editRef, setEditRef] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Users list for user selector
  const usersQuery = useQuery<UserProfile[]>({
    queryKey: ["admin-users-list-selector"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          wallets:wallets ( id, balance )
        `);
      if (error) throw error;
      return (data as any[]).map(u => ({
        ...u,
        wallets: Array.isArray(u.wallets) ? u.wallets[0] || null : u.wallets || null
      }));
    }
  });

  // Fetch all transactions across all accounts
  const txQuery = useQuery<FullTx[]>({
    queryKey: ["admin-all-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select(`
          id,
          wallet_id,
          amount,
          type,
          status,
          reference,
          description,
          created_at,
          wallets:wallets (
            id,
            user_id,
            profiles:profiles ( full_name, email )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as any[]).map(t => ({
        ...t,
        wallets: Array.isArray(t.wallets) ? t.wallets[0] || null : t.wallets || null
      })) as FullTx[];
    }
  });

  // Ensure wallet exists for user
  const ensureWallet = async (uId: string) => {
    const { data: existing } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", uId)
      .maybeSingle();

    if (existing) return existing;

    const { data: created, error } = await supabase
      .from("wallets")
      .insert([{ user_id: uId, balance: 0.00 }])
      .select()
      .single();

    if (error) throw error;
    return created;
  };

  // Action: Create Transaction
  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) {
      setErrorMsg("Please select a target user account.");
      return;
    }
    const amt = Number(createAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const wallet = await ensureWallet(targetUserId);
      const { data: { session } } = await supabase.auth.getSession();
      const reference = createRef.trim() || `TX-${Math.floor(100000 + Math.random() * 900000)}`;

      const { error: insertErr } = await supabase
        .from("wallet_transactions")
        .insert([{
          wallet_id: wallet.id,
          amount: amt,
          type: createType,
          status: createStatus,
          reference,
          description: createDesc.trim() || `Admin manual ${createType} record`
        }]);

      if (insertErr) throw insertErr;

      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: "create_transaction",
        target: targetUserId,
        metadata: { amount: amt, type: createType, status: createStatus, reference }
      }]);

      queryClient.invalidateQueries({ queryKey: ["admin-all-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      setShowCreateModal(false);
      setCreateAmount("");
      setCreateRef("");
      setCreateDesc("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  // Action: Edit Transaction
  const handleEditTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    const amt = Number(editAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid positive amount.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { error: updateErr } = await supabase
        .from("wallet_transactions")
        .update({
          amount: amt,
          type: editType,
          status: editStatus,
          reference: editRef.trim() || null,
          description: editDesc.trim() || null
        })
        .eq("id", editingTx.id);

      if (updateErr) throw updateErr;

      let balanceDelta = 0;
      if (editingTx.status === "completed") {
        if (editingTx.type === "deposit" || editingTx.type === "credit") balanceDelta -= Number(editingTx.amount);
        else balanceDelta += Number(editingTx.amount);
      }
      if (editStatus === "completed") {
        if (editType === "deposit" || editType === "credit") balanceDelta += amt;
        else balanceDelta -= amt;
      }

      if (balanceDelta !== 0 && editingTx.wallet_id) {
        const { data: w } = await supabase.from("wallets").select("balance").eq("id", editingTx.wallet_id).single();
        if (w) {
          const newBal = Math.max(0, Number(w.balance) + balanceDelta);
          await supabase.from("wallets").update({ balance: newBal, updated_at: new Date().toISOString() }).eq("id", editingTx.wallet_id);
        }
      }

      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "admin",
        action: "edit_transaction",
        target: editingTx.wallets?.user_id || "system",
        metadata: { tx_id: editingTx.id, old_amount: editingTx.amount, new_amount: amt }
      }]);

      queryClient.invalidateQueries({ queryKey: ["admin-all-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      setEditingTx(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTx = txQuery.data?.filter(t => {
    const userEmail = t.wallets?.profiles?.email || "";
    const userName = t.wallets?.profiles?.full_name || "";
    const matchesSearch = 
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.reference || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  // Helper: open edit modal
  const openEdit = (tx: FullTx) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount));
    setEditType(tx.type);
    setEditStatus(tx.status);
    setEditRef(tx.reference || "");
    setEditDesc(tx.description || "");
    setErrorMsg("");
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500" /> Platform Transaction Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create, inspect, and edit transaction history records across all platform user accounts.
          </p>
        </div>
        <Button 
          variant="premium" 
          size="sm" 
          className="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl w-full sm:w-auto"
          onClick={() => {
            setTargetUserId("");
            setCreateAmount("");
            setCreateRef("");
            setCreateDesc("");
            setErrorMsg("");
            setShowCreateModal(true);
          }}
        >
          <PlusCircle className="w-4 h-4" /> Create New Transaction
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user email, reference, or description..."
            className="bg-black/20 border-white/10 rounded-xl pl-10 text-xs focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {txQuery.isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      )}

      {!txQuery.isLoading && (
        <>
          {/* ── DESKTOP TABLE (lg+) ──────────────────────────────────── */}
          <GlassCard className="hidden lg:block p-0 overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account User</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount ($)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference &amp; Description</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date &amp; Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTx.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-xs text-muted-foreground">
                        No transaction history records match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-white">
                            {tx.wallets?.profiles?.full_name || "Account User"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {tx.wallets?.profiles?.email || "Unknown Email"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                            (tx.type === "deposit" || tx.type === "credit") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          )}>
                            {(tx.type === "deposit" || tx.type === "credit") ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-white">
                          ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <div className="font-mono text-[10px] text-muted-foreground">{tx.reference || "N/A"}</div>
                          <div className="text-[11px] text-slate-300 max-w-xs truncate">{tx.description || "—"}</div>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-muted-foreground">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                            tx.status === "completed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                            tx.status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                            tx.status === "failed" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          )}>
                            {tx.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                            {tx.status === "pending" && <Clock className="w-3 h-3" />}
                            {tx.status === "failed" && <XCircle className="w-3 h-3" />}
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg gap-1"
                            onClick={() => openEdit(tx)}
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* ── MOBILE / TABLET CARDS (< lg) ──────────────────────────── */}
          <div className="lg:hidden space-y-3">
            {filteredTx.length === 0 ? (
              <GlassCard className="p-6 text-center text-xs text-muted-foreground border-white/5">
                No transaction history records match your search query.
              </GlassCard>
            ) : (
              filteredTx.map((tx) => (
                <GlassCard key={tx.id} className="p-4 space-y-3 border-white/5">
                  {/* User + amount row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {tx.wallets?.profiles?.full_name || "Account User"}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {tx.wallets?.profiles?.email || "Unknown Email"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm font-bold text-white">
                        ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Type + Status row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                      (tx.type === "deposit" || tx.type === "credit") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {(tx.type === "deposit" || tx.type === "credit") ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {tx.type}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                      tx.status === "completed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                      tx.status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      tx.status === "failed" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {tx.status === "completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {tx.status === "pending" && <Clock className="w-2.5 h-2.5" />}
                      {tx.status === "failed" && <XCircle className="w-2.5 h-2.5" />}
                      {tx.status}
                    </span>
                  </div>

                  {/* Reference + description */}
                  <div className="bg-white/[0.02] rounded-lg px-3 py-2 space-y-0.5">
                    <div className="font-mono text-[10px] text-muted-foreground">{tx.reference || "N/A"}</div>
                    <div className="text-[11px] text-slate-300">{tx.description || "—"}</div>
                  </div>

                  {/* Edit button */}
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-xl gap-1.5"
                      onClick={() => openEdit(tx)}
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Transaction
                    </Button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </>
      )}

      {/* ── CREATE TRANSACTION MODAL ─────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-6 relative border-rose-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-rose-400">
                <PlusCircle className="w-5 h-5" /> Create Transaction Record
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select User Account</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-rose-500"
                >
                  <option value="">-- Choose Account User --</option>
                  {usersQuery.data?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || "User"} ({u.email}) - Bal: ${u.wallets?.balance.toFixed(2) || "0.00"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                  <select
                    value={createType}
                    onChange={(e) => setCreateType(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                  <select
                    value={createStatus}
                    onChange={(e) => setCreateStatus(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="completed">Completed (Updates Balance)</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={createAmount}
                  onChange={(e) => setCreateAmount(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference Code</label>
                <Input
                  type="text"
                  placeholder="e.g. REF-77123"
                  value={createRef}
                  onChange={(e) => setCreateRef(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Input
                  type="text"
                  placeholder="e.g. Approved Wire Transfer Deposit"
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
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
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold" disabled={submitting}>
                  {submitting ? "Saving..." : "Create Transaction"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ── EDIT TRANSACTION MODAL ───────────────────────────────────── */}
      {editingTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-6 relative border-amber-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-amber-400">
                <Edit className="w-5 h-5" /> Edit Transaction ({editingTx.id.substring(0, 8)}...)
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setEditingTx(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleEditTx} className="space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs">
                <p className="text-slate-300">User: <strong className="text-white">{editingTx.wallets?.profiles?.full_name || editingTx.wallets?.profiles?.email || "Account User"}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference Code</label>
                <Input
                  type="text"
                  value={editRef}
                  onChange={(e) => setEditRef(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <Input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
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
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setEditingTx(null)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
