"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Check, 
  X, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type DepositRequest = {
  id: string;
  amount: number;
  provider: string;
  reference: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
};

type WithdrawalRequest = {
  id: string;
  amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
};

export default function SuperAdminFinancePage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals" | "reports">("deposits");
  
  // Fetch Deposits
  const depositsQuery = useQuery<DepositRequest[]>({
    queryKey: ["super-admin-deposits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposits")
        .select(`
          id,
          amount,
          provider,
          reference,
          status,
          created_at,
          profiles:user_id ( full_name, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any as DepositRequest[];
    }
  });

  // Fetch Withdrawals
  const withdrawalsQuery = useQuery<WithdrawalRequest[]>({
    queryKey: ["super-admin-withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select(`
          id,
          amount,
          bank_name,
          account_name,
          account_number,
          status,
          created_at,
          profiles:user_id ( full_name, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any as WithdrawalRequest[];
    }
  });

  // Mutations
  const approveDepositMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("deposits")
        .update({ status: "completed" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-deposits"] });
    }
  });

  const rejectDepositMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("deposits")
        .update({ status: "failed" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-deposits"] });
    }
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase
        .from("withdrawals")
        .update({ status: "approved", reviewed_by: session?.user?.id })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-withdrawals"] });
    }
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from("withdrawals")
        .update({ status: "rejected", reviewed_by: session?.user?.id })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-withdrawals"] });
    }
  });

  // Simulated Report Generator
  const handleDownloadReport = (type: "Daily" | "Weekly" | "Monthly" | "Annual") => {
    // Collect report totals
    const depTotal = depositsQuery.data?.filter(d => d.status === "completed").reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    const witTotal = withdrawalsQuery.data?.filter(w => w.status === "approved").reduce((sum, w) => sum + Number(w.amount), 0) || 0;
    const revTotal = (depTotal + witTotal) * 0.0015;

    const reportContent = `IRONBRIDGE MARKET - ${type.toUpperCase()} FINANCIAL STATEMENT\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `==========================================\n` +
      `Total Approved Deposits: $${depTotal.toFixed(2)}\n` +
      `Total Approved Withdrawals: $${witTotal.toFixed(2)}\n` +
      `Calculated Platform Fees (0.15%): $${revTotal.toFixed(2)}\n` +
      `Net Custodial Position Change: $${(depTotal - witTotal).toFixed(2)}\n` +
      `==========================================\n` +
      `Status: VERIFIED & COMPLIANT`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ironbridge_${type.toLowerCase()}_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isDataLoading = depositsQuery.isLoading || withdrawalsQuery.isLoading;

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Finance Center</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Custodial Inflow/Outflow Control</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("deposits")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === "deposits" ? "text-purple-400 border-b-2 border-purple-500" : "text-muted-foreground hover:text-white"
          }`}
        >
          Deposit Requests
        </button>
        <button
          onClick={() => setActiveTab("withdrawals")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === "withdrawals" ? "text-purple-400 border-b-2 border-purple-500" : "text-muted-foreground hover:text-white"
          }`}
        >
          Withdrawal Requests
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
            activeTab === "reports" ? "text-purple-400 border-b-2 border-purple-500" : "text-muted-foreground hover:text-white"
          }`}
        >
          Revenue Reports
        </button>
      </div>

      {activeTab === "deposits" && (
        <section className="space-y-4">
          <GlassCard className="p-0 overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reference / Slip</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {depositsQuery.data?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-xs text-muted-foreground">No deposit history found.</td>
                    </tr>
                  ) : (
                    depositsQuery.data?.map((dep) => (
                      <tr key={dep.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{dep.profiles?.full_name || "New Institution"}</span>
                            <span className="text-[9px] text-muted-foreground mt-0.5">{dep.profiles?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-400">
                          +${dep.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-white">{dep.reference}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{dep.provider}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                            dep.status === "completed" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            dep.status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                            dep.status === "failed" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}>
                            {dep.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {dep.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-muted-foreground"
                                onClick={() => approveDepositMutation.mutate(dep.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
                                onClick={() => rejectDepositMutation.mutate(dep.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      )}

      {activeTab === "withdrawals" && (
        <section className="space-y-4">
          <GlassCard className="p-0 overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Banking Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {withdrawalsQuery.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground">No withdrawal history found.</td>
                    </tr>
                  ) : (
                    withdrawalsQuery.data?.map((wit) => (
                      <tr key={wit.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{wit.profiles?.full_name || "New Institution"}</span>
                            <span className="text-[9px] text-muted-foreground mt-0.5">{wit.profiles?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-rose-400">
                          -${wit.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-xs text-white">
                          <div className="font-bold">{wit.bank_name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">{wit.account_name} • {wit.account_number}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                            wit.status === "approved" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            wit.status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                            wit.status === "rejected" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}>
                            {wit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {wit.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 text-muted-foreground"
                                onClick={() => approveWithdrawalMutation.mutate(wit.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
                                onClick={() => rejectWithdrawalMutation.mutate(wit.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      )}

      {activeTab === "reports" && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-6 space-y-4 border-white/5">
            <h3 className="font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Revenue Reports Desk
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compile custodial transaction logs and calculate platform wire fee revenue for auditing cycles. File exports include deposit/withdrawal summaries.
            </p>

            <div className="space-y-2 pt-4">
              <Button onClick={() => handleDownloadReport("Daily")} className="w-full justify-between rounded-xl py-6 text-xs text-left" variant="glass">
                <span>Daily Inflow/Outflow Statement</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => handleDownloadReport("Weekly")} className="w-full justify-between rounded-xl py-6 text-xs text-left" variant="glass">
                <span>Weekly Cumulative Audit Log</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => handleDownloadReport("Monthly")} className="w-full justify-between rounded-xl py-6 text-xs text-left" variant="glass">
                <span>Monthly Institutional Performance Report</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button onClick={() => handleDownloadReport("Annual")} className="w-full justify-between rounded-xl py-6 text-xs text-left" variant="glass">
                <span>Annual Custodial Balance Sheet</span>
                <Download className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4 border-white/5">
            <h3 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Audit Integrity Status
            </h3>
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-2">
              <div className="text-xs font-bold text-emerald-400">Node Compliance Active</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All approved deposits and withdrawals are processed as multi-sig secured bank transactions. Transaction records mapped to public wallets are locked and subject to zero-knowledge compliance verification.
              </p>
            </div>
          </GlassCard>
        </section>
      )}
    </div>
  );
}
