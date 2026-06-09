"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminProfile = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  tier: string;
  created_at: string;
};

type AuditLog = {
  id: string;
  action: string;
  target: string;
  metadata: any;
  created_at: string;
};

export default function AdminManagementPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Dialog states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);

  // Form states
  const [emailToPromote, setEmailToPromote] = useState("");
  const [roleToAssign, setRoleToAssign] = useState("admin");
  const [tierToAssign, setTierToAssign] = useState("Professional");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Fetch Admin list (role is admin, superuser, or super_admin)
  const adminsQuery = useQuery<AdminProfile[]>({
    queryKey: ["super-admin-admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, tier, created_at")
        .in("role", ["admin", "superuser", "super_admin"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AdminProfile[];
    }
  });

  // 2. Fetch specific admin activity logs
  const adminLogsQuery = useQuery<AuditLog[]>({
    queryKey: ["admin-activity-logs", selectedAdmin?.id],
    enabled: !!selectedAdmin && showLogsModal,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, target, metadata, created_at")
        .eq("actor_id", selectedAdmin!.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as AuditLog[];
    }
  });

  // Mutations
  const promoteAdminMutation = useMutation({
    mutationFn: async ({ email, role, tier }: { email: string; role: string; tier: string }) => {
      const { data: { session } } = await supabase.auth.getSession();

      // Find user by email
      const { data: userProfile, error: findErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (findErr) throw findErr;
      if (!userProfile) throw new Error("No user profile found with that email address. User must sign up first.");

      // Update their role
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ role, tier })
        .eq("id", userProfile.id);

      if (updateErr) throw updateErr;

      // Log action
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: "admin_creation",
        target: userProfile.id,
        metadata: { role, tier }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-admins"] });
      setShowAddModal(false);
      setEmailToPromote("");
    }
  });

  const demoteAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id === userId) {
        throw new Error("You cannot demote yourself. Self-lockout prevention active.");
      }

      // Demote to standard user
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ role: "user" })
        .eq("id", userId);

      if (updateErr) throw updateErr;

      // Log action
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: "admin_removal",
        target: userId,
        metadata: { role: "user" }
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-admins"] });
    }
  });

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToPromote.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await promoteAdminMutation.mutateAsync({
        email: emailToPromote,
        role: roleToAssign,
        tier: tierToAssign
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to promote user.");
    } finally {
      setSubmitting(false);
    }
  };

  if (adminsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Platform Administrative Hierarchy</p>
        </div>
        <Button 
          variant="premium" 
          onClick={() => { setShowAddModal(true); setErrorMsg(""); }}
          className="gap-2 rounded-xl text-xs py-5 px-4 font-bold"
        >
          <UserPlus className="w-4 h-4" /> Create Administrator
        </Button>
      </div>

      {/* Directory Table */}
      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Administrator Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Administrative Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Tier</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Added Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {adminsQuery.data?.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-sm text-purple-400">
                        {admin.full_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{admin.full_name || "Administrator"}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                      admin.role === "super_admin" || admin.role === "superuser" ? "bg-purple-600/10 text-purple-400 border-purple-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-white">{admin.tier}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-purple-500/10 hover:text-purple-400 text-muted-foreground"
                        onClick={() => { setSelectedAdmin(admin); setShowLogsModal(true); }}
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground"
                        onClick={() => {
                          if (confirm(`Are you sure you want to demote ${admin.email}?`)) {
                            demoteAdminMutation.mutate(admin.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-purple-600/20">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Create Administrator
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-xs">
                <p>Enter the email address of an existing registered user to elevate their permissions to administrative level.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. manager@hedgefund.io"
                  value={emailToPromote}
                  onChange={(e) => setEmailToPromote(e.target.value)}
                  className="bg-black/20 border-white/10 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Role</label>
                  <select
                    value={roleToAssign}
                    onChange={(e) => setRoleToAssign(e.target.value)}
                    className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Access Tier</label>
                  <select
                    value={tierToAssign}
                    onChange={(e) => setTierToAssign(e.target.value)}
                    className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Button type="button" variant="glass" className="flex-1 rounded-xl text-xs" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" variant="premium" className="flex-1 rounded-xl text-xs bg-purple-600 hover:bg-purple-500" disabled={submitting}>
                  {submitting ? "Elevating..." : "Promote to Admin"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Admin Activity logs Modal */}
      {showLogsModal && selectedAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-xl w-full p-8 space-y-6 relative border-purple-600/20">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" /> Admin Activity Audit
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowLogsModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-xs">
                <p>Auditing actions for <strong>{selectedAdmin.full_name || selectedAdmin.email}</strong>.</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {adminLogsQuery.isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  </div>
                ) : adminLogsQuery.data?.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No actions logged in the audit trail.</p>
                ) : (
                  <div className="space-y-3">
                    {adminLogsQuery.data?.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-white capitalize">{log.action.replace("_", " ")}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Target ID: {log.target}
                        </div>
                        {log.metadata && (
                          <pre className="p-2 bg-black/40 rounded border border-white/5 text-[9px] font-mono text-muted-foreground mt-1 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button variant="glass" className="w-full rounded-xl text-xs py-5" onClick={() => setShowLogsModal(false)}>
              Close Audit Log
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
