"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
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
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function SuperAdminUsersPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [fundsAction, setFundsAction] = useState<"credit" | "debit">("credit");
  
  // Form state
  const [targetRole, setTargetRole] = useState("user");
  const [fundsAmount, setFundsAmount] = useState("");
  const [fundsDescription, setFundsDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Users
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
      
      // Map wallets data correctly since it returns as array/object
      return (data as any[]).map(u => ({
        ...u,
        wallets: Array.isArray(u.wallets) ? u.wallets[0] || null : u.wallets || null
      })) as UserWithWallet[];
    }
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Update role
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);
      if (updateErr) throw updateErr;

      // Log action
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: "role_assignment",
        target: userId,
        metadata: { role }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setShowRoleModal(false);
    }
  });

  const toggleSuspensionMutation = useMutation({
    mutationFn: async ({ userId, suspended }: { userId: string; suspended: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();

      // Update suspended status
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ suspended })
        .eq("id", userId);
      if (updateErr) throw updateErr;

      // Log action
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: suspended ? "user_suspension" : "user_activation",
        target: userId,
        metadata: { suspended }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
    }
  });

  const adjustFundsMutation = useMutation({
    mutationFn: async ({ 
      walletId, 
      userId,
      amount, 
      type, 
      description 
    }: { 
      walletId: string; 
      userId: string;
      amount: number; 
      type: "credit" | "debit"; 
      description: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();

      // Insert transaction directly, trigger handles balance update
      const { error: txErr } = await supabase
        .from("wallet_transactions")
        .insert([{
          wallet_id: walletId,
          amount,
          type,
          status: "completed",
          reference: `ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
          description
        }]);
      if (txErr) throw txErr;

      // Log action
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: type === "credit" ? "wallet_credit" : "wallet_debit",
        target: userId,
        metadata: { amount, description }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      setShowFundsModal(false);
      setFundsAmount("");
      setFundsDescription("");
    }
  });

  // Action handlers
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
    if (!selectedUser || !selectedUser.wallets) {
      setErrorMsg("User has no active wallet.");
      return;
    }
    if (!fundsAmount || isNaN(Number(fundsAmount)) || Number(fundsAmount) <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }
    if (fundsAction === "debit" && selectedUser.wallets.balance < Number(fundsAmount)) {
      setErrorMsg("User has insufficient balance for debit.");
      return;
    }
    if (!fundsDescription.trim()) {
      setErrorMsg("Adjustment reason description is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await adjustFundsMutation.mutateAsync({
        walletId: selectedUser.wallets.id,
        userId: selectedUser.id,
        amount: Number(fundsAmount),
        type: fundsAction,
        description: fundsDescription.trim()
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to adjust balance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const filteredUsers = usersQuery.data?.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Platform Account Controls</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-black/20 border-white/10 rounded-xl pl-10 text-xs focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Showing {filteredUsers.length} of {usersQuery.data?.length || 0} profiles
        </div>
      </div>

      {/* Directory Table */}
      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wallet Balance</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-sm text-purple-400">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{user.full_name || "New Institution"}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                      user.role === "super_admin" || user.role === "superuser" ? "bg-purple-600/10 text-purple-400 border-purple-500/20" :
                      user.role === "admin" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                      "bg-muted/10 text-muted-foreground border-white/5"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-white">{user.tier}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-white">
                    ${user.wallets?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                      user.suspended 
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    )}>
                      {user.suspended ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {user.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Credit/Debit */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-muted-foreground"
                        onClick={() => { setSelectedUser(user); setFundsAction("credit"); setShowFundsModal(true); setErrorMsg(""); }}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground"
                        onClick={() => { setSelectedUser(user); setFundsAction("debit"); setShowFundsModal(true); setErrorMsg(""); }}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                      {/* Assign Role */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-purple-500/10 hover:text-purple-400 text-muted-foreground"
                        onClick={() => { setSelectedUser(user); setTargetRole(user.role); setShowRoleModal(true); setErrorMsg(""); }}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      {/* Suspension Toggle */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-7 w-7 rounded-lg text-muted-foreground",
                          user.suspended 
                            ? "hover:bg-emerald-500/10 hover:text-emerald-400" 
                            : "hover:bg-rose-500/10 hover:text-rose-500"
                        )}
                        onClick={() => toggleSuspensionMutation.mutate({ userId: user.id, suspended: !user.suspended })}
                      >
                        {user.suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-purple-600/20">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> Assign Role
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowRoleModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-xs">
                <p>Modify system access tier for <strong>{selectedUser.full_name || selectedUser.email}</strong>.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select System Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                >
                  <option value="user">User (Standard Access)</option>
                  <option value="admin">Admin (Compliance Officer)</option>
                  <option value="super_admin">Super Admin (Root Authority)</option>
                </select>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowRoleModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-purple-600 hover:bg-purple-500" disabled={submitting}>
                  {submitting ? "Saving..." : "Update Role"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Adjust Funds Modal */}
      {showFundsModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-purple-600/20">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {fundsAction === "credit" ? (
                  <>
                    <PlusCircle className="w-5 h-5 text-emerald-400" /> Credit User Wallet
                  </>
                ) : (
                  <>
                    <MinusCircle className="w-5 h-5 text-rose-400" /> Debit User Wallet
                  </>
                )}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFundsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleFundsSubmit} className="space-y-4">
              <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-xs">
                <p>User: <strong>{selectedUser.full_name || selectedUser.email}</strong></p>
                <p className="mt-1">Current Balance: <strong>${selectedUser.wallets?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</strong></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Adjustment Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="bg-black/20 border-white/10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reason for Adjustment</label>
                <Input
                  type="text"
                  placeholder="e.g. Approved wire deposit correction"
                  value={fundsDescription}
                  onChange={(e) => setFundsDescription(e.target.value)}
                  className="bg-black/20 border-white/10 rounded-xl text-xs"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowFundsModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-purple-600 hover:bg-purple-500" disabled={submitting}>
                  {submitting ? "Processing..." : `Confirm ${fundsAction === "credit" ? "Credit" : "Debit"}`}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
