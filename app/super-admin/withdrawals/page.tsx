"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function AdminWithdrawalsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const withdrawalsQuery = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const approveWithdrawal = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("withdrawals")
        .update({ status: "approved" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      showToast({ type: "success", title: "Withdrawal Approved", description: "Outbound wire authorized." });
    },
  });

  const rejectWithdrawal = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("withdrawals")
        .update({ status: "rejected" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      showToast({ type: "info", title: "Withdrawal Rejected", description: "Outbound wire rejected." });
    },
  });

  const columns: Column<any>[] = [
    {
      header: "Bank & Beneficiary",
      accessorKey: "bank_name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.account_name}</p>
          <p className="text-[11px] text-slate-400">{row.bank_name} • {row.account_number}</p>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-rose-400">-{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Requested Date",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>,
    },
    {
      header: "Actions",
      cell: (row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => approveWithdrawal.mutate(row.id)}
              disabled={approveWithdrawal.isPending}
              className="h-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Authorize
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectWithdrawal.mutate(row.id)}
              disabled={rejectWithdrawal.isPending}
              className="h-8 text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-500">Completed</span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Outbound Withdrawal Queue</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Authorize or reject pending client withdrawal wires</p>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={withdrawalsQuery.data || []}
          columns={columns}
          searchPlaceholder="Search beneficiary or bank name..."
          searchField="bank_name"
          emptyTitle="No Pending Withdrawals"
          emptyDescription="All withdrawal requests have been reviewed."
        />
      </GlassCard>
    </div>
  );
}
