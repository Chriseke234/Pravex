"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Ban,
  UserCheck,
  PlusCircle,
  MinusCircle,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Receipt,
  Edit,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  XCircle,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */
type UserWithWallet = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  tier: string;
  suspended: boolean;
  created_at: string;
  wallets: { id: string; balance: number } | null;
};

type WalletTx = {
  id: string;
  wallet_id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "credit" | "debit";
  status: "pending" | "completed" | "failed";
  reference: string | null;
  description: string | null;
  created_at: string;
};

/* ─── Helpers ────────────────────────────────────────────────── */
function typeBadge(type: WalletTx["type"]) {
  const isIn = type === "deposit" || type === "credit";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
        isIn
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
      )}
    >
      {isIn ? <ArrowDownLeft className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
      {type}
    </span>
  );
}

function statusBadge(status: WalletTx["status"]) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
        status === "completed" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        status === "pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
        status === "failed" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
      )}
    >
      {status === "completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
      {status === "pending" && <Clock className="w-2.5 h-2.5" />}
      {status === "failed" && <XCircle className="w-2.5 h-2.5" />}
      {status}
    </span>
  );
}

/* ─── Component ──────────────────────────────────────────────── */
export default function SuperAdminUsersPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  /* Modal visibility */
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false); // transaction history modal
  const [fundsAction, setFundsAction] = useState<"credit" | "debit">("credit");

  /* Role form */
  const [targetRole, setTargetRole] = useState("user");

  /* Balance adjust form */
  const [fundsAmount, setFundsAmount] = useState("");
  const [fundsDescription, setFundsDescription] = useState("");

  /* Create transaction form */
  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [txStatus, setTxStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [txReference, setTxReference] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [showCreateTxForm, setShowCreateTxForm] = useState(false);

  /* Edit transaction form */
  const [editingTx, setEditingTx] = useState<WalletTx | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"deposit" | "withdrawal" | "credit" | "debit">("deposit");
  const [editStatus, setEditStatus] = useState<"completed" | "pending" | "failed">("completed");
  const [editReference, setEditReference] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Queries ─────────────────────────────────────────────── */

  // All users + wallets
  const usersQuery = useQuery<UserWithWallet[]>({
    queryKey: ["super-admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          role,
          tier,
          suspended,
          created_at,
          wallets:wallets ( id, balance )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]).map((u) => ({
        ...u,
        wallets: Array.isArray(u.wallets) ? u.wallets[0] || null : u.wallets || null,
      })) as UserWithWallet[];
    },
  });

  // Transactions for the selected user's wallet
  const txQuery = useQuery<WalletTx[]>({
    queryKey: ["super-admin-user-txs", selectedUser?.wallets?.id],
    enabled: showTxModal && !!selectedUser?.wallets?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", selectedUser!.wallets!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as WalletTx[];
    },
  });

  /* ── Mutations ───────────────────────────────────────────── */

  // Ensure wallet exists for a user (creates if missing)
  const ensureWallet = async (userId: string) => {
    const { data: existing } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return existing;
    const { data: created, error } = await supabase
      .from("wallets")
      .insert([{ user_id: userId, balance: 0 }])
      .select()
      .single();
    if (error) throw error;
    return created;
  };

  // Update role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
      if (error) throw error;
      try {
        await supabase.from("audit_logs").insert([{
          actor_id: session?.user?.id,
          actor_role: "superuser",
          action: "role_assignment",
          target: userId,
          metadata: { role },
        }]);
      } catch (_) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setShowRoleModal(false);
    },
  });

  // Suspend / Activate
  const toggleSuspensionMutation = useMutation({
    mutationFn: async ({ userId, suspended }: { userId: string; suspended: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("profiles").update({ suspended }).eq("id", userId);
      if (error) throw error;
      try {
        await supabase.from("audit_logs").insert([{
          actor_id: session?.user?.id,
          actor_role: "superuser",
          action: suspended ? "user_suspension" : "user_activation",
          target: userId,
          metadata: { suspended },
        }]);
      } catch (_) {}
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["super-admin-users"] }),
  });

  // Balance adjust (credit / debit) — directly updates wallet.balance AND creates tx record
  const adjustFundsMutation = useMutation({
    mutationFn: async ({
      walletId,
      userId,
      currentBalance,
      amount,
      type,
      description,
    }: {
      walletId: string;
      userId: string;
      currentBalance: number;
      amount: number;
      type: "credit" | "debit";
      description: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const reference = `ADJ-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Insert wallet_transactions record
      const { error: txErr } = await supabase.from("wallet_transactions").insert([{
        wallet_id: walletId,
        amount,
        type,
        status: "completed",
        reference,
        description,
      }]);
      if (txErr) throw txErr;

      // 2. Directly update wallet balance (fixes the bug where balance wasn't updating)
      const newBalance = type === "credit"
        ? currentBalance + amount
        : Math.max(0, currentBalance - amount);
      const { error: balErr } = await supabase
        .from("wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("id", walletId);
      if (balErr) throw balErr;

      // 3. Audit log
      try {
        await supabase.from("audit_logs").insert([{
          actor_id: session?.user?.id,
          actor_role: "superuser",
          action: type === "credit" ? "wallet_credit" : "wallet_debit",
          target: userId,
          metadata: { amount, description, reference },
        }]);
      } catch (_) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-user-txs"] });
      setShowFundsModal(false);
      setFundsAmount("");
      setFundsDescription("");
    },
  });

  // Create custom transaction (full fields)
  const createTxMutation = useMutation({
    mutationFn: async ({
      walletId,
      userId,
      currentBalance,
      amount,
      type,
      status,
      reference,
      description,
    }: {
      walletId: string;
      userId: string;
      currentBalance: number;
      amount: number;
      type: "deposit" | "withdrawal" | "credit" | "debit";
      status: "completed" | "pending" | "failed";
      reference: string;
      description: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();

      // Insert transaction record
      const { error: txErr } = await supabase.from("wallet_transactions").insert([{
        wallet_id: walletId,
        amount,
        type,
        status,
        reference: reference || `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        description,
      }]);
      if (txErr) throw txErr;

      // Update wallet balance only for completed transactions
      if (status === "completed") {
        const isIncoming = type === "deposit" || type === "credit";
        const newBalance = isIncoming
          ? currentBalance + amount
          : Math.max(0, currentBalance - amount);
        await supabase
          .from("wallets")
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq("id", walletId);
      }

      // Audit log
      try {
        await supabase.from("audit_logs").insert([{
          actor_id: session?.user?.id,
          actor_role: "superuser",
          action: "create_transaction",
          target: userId,
          metadata: { amount, type, status, reference },
        }]);
      } catch (_) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-user-txs"] });
      setShowCreateTxForm(false);
      setTxAmount("");
      setTxType("deposit");
      setTxStatus("completed");
      setTxReference("");
      setTxDescription("");
    },
  });

  // Edit existing transaction — applies balance delta
  const editTxMutation = useMutation({
    mutationFn: async ({
      tx,
      walletId,
      userId,
      currentBalance,
      newAmount,
      newType,
      newStatus,
      newReference,
      newDescription,
    }: {
      tx: WalletTx;
      walletId: string;
      userId: string;
      currentBalance: number;
      newAmount: number;
      newType: "deposit" | "withdrawal" | "credit" | "debit";
      newStatus: "completed" | "pending" | "failed";
      newReference: string;
      newDescription: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();

      // Update the transaction record
      const { error: updErr } = await supabase
        .from("wallet_transactions")
        .update({
          amount: newAmount,
          type: newType,
          status: newStatus,
          reference: newReference || null,
          description: newDescription || null,
        })
        .eq("id", tx.id);
      if (updErr) throw updErr;

      // Calculate balance delta: reverse old effect, apply new effect
      let delta = 0;
      if (tx.status === "completed") {
        const wasIncoming = tx.type === "deposit" || tx.type === "credit";
        delta -= wasIncoming ? Number(tx.amount) : -Number(tx.amount);
      }
      if (newStatus === "completed") {
        const isIncoming = newType === "deposit" || newType === "credit";
        delta += isIncoming ? newAmount : -newAmount;
      }

      if (delta !== 0) {
        const newBalance = Math.max(0, currentBalance + delta);
        await supabase
          .from("wallets")
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq("id", walletId);
      }

      // Audit log
      try {
        await supabase.from("audit_logs").insert([{
          actor_id: session?.user?.id,
          actor_role: "superuser",
          action: "edit_transaction",
          target: userId,
          metadata: { tx_id: tx.id, old_amount: tx.amount, new_amount: newAmount },
        }]);
      } catch (_) {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-user-txs"] });
      setEditingTx(null);
    },
  });

  /* ── Handlers ────────────────────────────────────────────── */

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await updateRoleMutation.mutateAsync({ userId: selectedUser.id, role: targetRole });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amt = Number(fundsAmount);
    if (!amt || amt <= 0) { setErrorMsg("Enter a valid amount."); return; }
    if (fundsAction === "debit" && (selectedUser.wallets?.balance || 0) < amt) {
      setErrorMsg("Insufficient balance for debit."); return;
    }
    if (!fundsDescription.trim()) { setErrorMsg("Description is required."); return; }

    setSubmitting(true);
    setErrorMsg("");
    try {
      // Ensure wallet exists
      const wallet = selectedUser.wallets || await ensureWallet(selectedUser.id);
      await adjustFundsMutation.mutateAsync({
        walletId: wallet.id,
        userId: selectedUser.id,
        currentBalance: wallet.balance,
        amount: amt,
        type: fundsAction,
        description: fundsDescription.trim(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to adjust balance.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amt = Number(txAmount);
    if (!amt || amt <= 0) { setErrorMsg("Enter a valid amount."); return; }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const wallet = selectedUser.wallets || await ensureWallet(selectedUser.id);
      await createTxMutation.mutateAsync({
        walletId: wallet.id,
        userId: selectedUser.id,
        currentBalance: wallet.balance,
        amount: amt,
        type: txType,
        status: txStatus,
        reference: txReference.trim(),
        description: txDescription.trim() || `Admin manual ${txType}`,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !selectedUser) return;
    const amt = Number(editAmount);
    if (!amt || amt <= 0) { setErrorMsg("Enter a valid amount."); return; }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await editTxMutation.mutateAsync({
        tx: editingTx,
        walletId: editingTx.wallet_id,
        userId: selectedUser.id,
        currentBalance: selectedUser.wallets?.balance || 0,
        newAmount: amt,
        newType: editType,
        newStatus: editStatus,
        newReference: editReference.trim(),
        newDescription: editDescription.trim(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditTx = (tx: WalletTx) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount));
    setEditType(tx.type);
    setEditStatus(tx.status);
    setEditReference(tx.reference || "");
    setEditDescription(tx.description || "");
    setErrorMsg("");
  };

  /* ── Derived ─────────────────────────────────────────────── */
  const filteredUsers = usersQuery.data?.filter((u) =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  /* ── Loading ─────────────────────────────────────────────── */
  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" /> User Directory
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
            Platform Account Controls · Balance & Transaction Management
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-black/20 border-white/10 rounded-xl pl-10 text-xs"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0">
          {filteredUsers.length} of {usersQuery.data?.length || 0} accounts
        </div>
      </div>

      {/* ── DESKTOP TABLE (lg+) ───────────────────────────────── */}
      <GlassCard className="hidden lg:block p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tier</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-sm text-amber-400 shrink-0">
                        {(user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{user.full_name || "New Account"}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                      user.role === "superuser" || user.role === "super_admin"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : user.role === "admin"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-white/5 text-slate-400 border-white/10"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-white">{user.tier}</td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-emerald-400">
                    ${(user.wallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase",
                      user.suspended
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}>
                      {user.suspended ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end items-center gap-1.5">
                      {/* Manage Transactions (NEW) */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg gap-1"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCreateTxForm(false);
                          setEditingTx(null);
                          setErrorMsg("");
                          setShowTxModal(true);
                        }}
                      >
                        <Receipt className="w-3 h-3" /> Transactions
                      </Button>
                      {/* Credit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-500"
                        title="Increase balance"
                        onClick={() => { setSelectedUser(user); setFundsAction("credit"); setFundsAmount(""); setFundsDescription(""); setErrorMsg(""); setShowFundsModal(true); }}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                      {/* Debit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-slate-500"
                        title="Decrease balance"
                        onClick={() => { setSelectedUser(user); setFundsAction("debit"); setFundsAmount(""); setFundsDescription(""); setErrorMsg(""); setShowFundsModal(true); }}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                      {/* Change Role */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 text-slate-500"
                        title="Assign role"
                        onClick={() => { setSelectedUser(user); setTargetRole(user.role); setErrorMsg(""); setShowRoleModal(true); }}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      {/* Suspend/Activate */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-lg text-slate-500",
                          user.suspended
                            ? "hover:bg-emerald-500/10 hover:text-emerald-400"
                            : "hover:bg-rose-500/10 hover:text-rose-500"
                        )}
                        title={user.suspended ? "Activate" : "Suspend"}
                        onClick={() => toggleSuspensionMutation.mutate({ userId: user.id, suspended: !user.suspended })}
                      >
                        {user.suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-500">
                    No accounts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── MOBILE / TABLET CARDS (< lg) ─────────────────────── */}
      <div className="lg:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <GlassCard className="p-6 text-center text-xs text-slate-500 border-white/5">
            No accounts match your search.
          </GlassCard>
        ) : (
          filteredUsers.map((user) => (
            <GlassCard key={user.id} className="p-4 space-y-4 border-white/5">
              {/* Identity + Balance */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-sm text-amber-400 shrink-0">
                  {(user.full_name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{user.full_name || "New Account"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-emerald-400">
                    ${(user.wallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] text-slate-500">balance</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                  user.role === "superuser" || user.role === "super_admin"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : user.role === "admin"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-white/5 text-slate-400 border-white/10"
                )}>
                  {user.role}
                </span>
                <span className="text-[9px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  {user.tier}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase",
                  user.suspended
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  {user.suspended ? <Ban className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5" />}
                  {user.suspended ? "Suspended" : "Active"}
                </span>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 rounded-xl gap-1.5 justify-center"
                  onClick={() => { setSelectedUser(user); setShowCreateTxForm(false); setEditingTx(null); setErrorMsg(""); setShowTxModal(true); }}
                >
                  <Receipt className="w-3.5 h-3.5" /> Transactions
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl gap-1.5 justify-center"
                  onClick={() => { setSelectedUser(user); setFundsAction("credit"); setFundsAmount(""); setFundsDescription(""); setErrorMsg(""); setShowFundsModal(true); }}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Balance
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-slate-400 hover:bg-white/5 border border-white/10 rounded-xl gap-1.5 justify-center"
                  onClick={() => { setSelectedUser(user); setTargetRole(user.role); setErrorMsg(""); setShowRoleModal(true); }}
                >
                  <Shield className="w-3.5 h-3.5" /> Change Role
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 text-xs border rounded-xl gap-1.5 justify-center",
                    user.suspended
                      ? "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
                      : "text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
                  )}
                  onClick={() => toggleSuspensionMutation.mutate({ userId: user.id, suspended: !user.suspended })}
                >
                  {user.suspended ? <><UserCheck className="w-3.5 h-3.5" /> Activate</> : <><Ban className="w-3.5 h-3.5" /> Suspend</>}
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          MODAL: TRANSACTION HISTORY & MANAGEMENT
      ════════════════════════════════════════════════════════ */}
      {showTxModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <GlassCard className="w-full max-w-2xl max-h-[92vh] flex flex-col border-amber-500/20 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> Transaction Management
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {selectedUser.full_name || selectedUser.email} · Balance:&nbsp;
                  <strong className="text-emerald-400 font-mono">
                    ${(selectedUser.wallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!showCreateTxForm && !editingTx && (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl gap-1.5"
                    onClick={() => { setShowCreateTxForm(true); setErrorMsg(""); }}
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> New Transaction
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => { setShowTxModal(false); setShowCreateTxForm(false); setEditingTx(null); setErrorMsg(""); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

              {/* ── CREATE TRANSACTION FORM ────────────────────── */}
              {showCreateTxForm && (
                <GlassCard className="p-4 border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Create New Transaction
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowCreateTxForm(false); setErrorMsg(""); }}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <form onSubmit={handleCreateTxSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</label>
                        <select
                          value={txType}
                          onChange={(e) => setTxType(e.target.value as any)}
                          className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="deposit">Deposit</option>
                          <option value="withdrawal">Withdrawal</option>
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
                        <select
                          value={txStatus}
                          onChange={(e) => setTxStatus(e.target.value as any)}
                          className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="completed">Completed (updates balance)</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount (USD)</label>
                      <Input type="number" step="0.01" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reference</label>
                        <Input type="text" placeholder="e.g. REF-12345" value={txReference} onChange={(e) => setTxReference(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                        <Input type="text" placeholder="e.g. Wire transfer" value={txDescription} onChange={(e) => setTxDescription(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                      </div>
                    </div>
                    {errorMsg && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-rose-400">{errorMsg}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="ghost" size="sm" className="flex-1 rounded-xl text-xs border border-white/10" onClick={() => { setShowCreateTxForm(false); setErrorMsg(""); }}>Cancel</Button>
                      <Button type="submit" size="sm" className="flex-1 rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold" disabled={submitting}>
                        {submitting ? "Saving..." : "Create Transaction"}
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              )}

              {/* ── EDIT TRANSACTION FORM ──────────────────────── */}
              {editingTx && (
                <GlassCard className="p-4 border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Edit Transaction
                    </h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditingTx(null); setErrorMsg(""); }}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <form onSubmit={handleEditTxSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</label>
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
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
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
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount (USD)</label>
                      <Input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reference</label>
                        <Input type="text" value={editReference} onChange={(e) => setEditReference(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                        <Input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-xs" />
                      </div>
                    </div>
                    {errorMsg && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-rose-400">{errorMsg}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="ghost" size="sm" className="flex-1 rounded-xl text-xs border border-white/10" onClick={() => { setEditingTx(null); setErrorMsg(""); }}>Cancel</Button>
                      <Button type="submit" size="sm" className="flex-1 rounded-xl text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </GlassCard>
              )}

              {/* ── TRANSACTION LIST ───────────────────────────── */}
              {txQuery.isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                </div>
              )}

              {!txQuery.isLoading && txQuery.data?.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  No transactions found for this account.
                </div>
              )}

              {/* Desktop transaction table (sm+) */}
              {!txQuery.isLoading && (txQuery.data?.length || 0) > 0 && (
                <>
                  <div className="hidden sm:block overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Reference</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                          <th className="px-4 py-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest text-right">Edit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {txQuery.data?.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-4 py-3">{typeBadge(tx.type)}</td>
                            <td className="px-4 py-3 font-mono text-xs font-bold text-white">
                              ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{tx.reference || "—"}</td>
                            <td className="px-4 py-3 text-[11px] text-slate-300 max-w-[140px] truncate">{tx.description || "—"}</td>
                            <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                            <td className="px-4 py-3 text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[9px] text-purple-400 hover:bg-purple-500/10 border border-purple-500/20 rounded-lg gap-1"
                                onClick={() => openEditTx(tx)}
                              >
                                <Edit className="w-3 h-3" /> Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile transaction cards (< sm) */}
                  <div className="sm:hidden space-y-2">
                    {txQuery.data?.map((tx) => (
                      <div key={tx.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            {typeBadge(tx.type)}
                            <div className="font-mono text-sm font-bold text-white">
                              ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            {statusBadge(tx.status)}
                            <div className="text-[9px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.reference || "No reference"}</div>
                        <div className="text-[11px] text-slate-300">{tx.description || "—"}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-7 text-xs text-purple-400 hover:bg-purple-500/10 border border-purple-500/20 rounded-xl gap-1.5"
                          onClick={() => openEditTx(tx)}
                        >
                          <Edit className="w-3 h-3" /> Edit Transaction
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL: QUICK BALANCE ADJUST (CREDIT / DEBIT)
      ════════════════════════════════════════════════════════ */}
      {showFundsModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-5 border-amber-500/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold flex items-center gap-2">
                {fundsAction === "credit" ? (
                  <><PlusCircle className="w-5 h-5 text-emerald-400" /> <span className="text-emerald-400">Add Balance</span></>
                ) : (
                  <><MinusCircle className="w-5 h-5 text-rose-400" /> <span className="text-rose-400">Deduct Balance</span></>
                )}
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFundsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
              <p>Account: <strong className="text-white">{selectedUser.full_name || selectedUser.email}</strong></p>
              <p>Current Balance: <strong className="text-emerald-400 font-mono">
                ${(selectedUser.wallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong></p>
            </div>

            <form onSubmit={handleFundsSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Amount to {fundsAction === "credit" ? "Add" : "Deduct"} (USD)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  Type any amount — no deposit required. Balance updates immediately.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reason / Description</label>
                <Input
                  type="text"
                  placeholder="e.g. Manual balance correction"
                  value={fundsDescription}
                  onChange={(e) => setFundsDescription(e.target.value)}
                  className="bg-black/40 border-white/10 rounded-xl text-xs"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-400">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-white/5">
                <Button type="button" variant="ghost" className="flex-1 rounded-xl text-xs border border-white/10" onClick={() => setShowFundsModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "flex-1 rounded-xl text-xs font-bold",
                    fundsAction === "credit"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-rose-600 hover:bg-rose-500 text-white"
                  )}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : fundsAction === "credit" ? "Add Balance" : "Deduct Balance"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL: ASSIGN ROLE
      ════════════════════════════════════════════════════════ */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-6 space-y-5 border-amber-500/20">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Assign Role
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRoleModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                Modifying access level for <strong>{selectedUser.full_name || selectedUser.email}</strong>.
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select System Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                >
                  <option value="user">User (Standard Access)</option>
                  <option value="admin">Admin (Compliance Officer)</option>
                  <option value="superuser">Super Admin (Root Authority)</option>
                </select>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-400">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-white/5">
                <Button type="button" variant="ghost" className="flex-1 rounded-xl text-xs border border-white/10" onClick={() => setShowRoleModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-xl text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold" disabled={submitting}>
                  {submitting ? "Saving..." : "Update Role"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
