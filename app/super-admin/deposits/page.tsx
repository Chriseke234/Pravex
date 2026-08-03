"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, Check, X, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function AdminDepositsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const depositsQuery = useQuery({
    queryKey: ["admin-deposits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const approveDeposit = useMutation({
    mutationFn: async (depositId: string) => {
      const { data, error } = await supabase
        .from("deposits")
        .update({ status: "completed" })
        .eq("id", depositId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      showToast({ type: "success", title: "Deposit Approved", description: "Account balance updated." });
    },
  });

  const rejectDeposit = useMutation({
    mutationFn: async (depositId: string) => {
      const { data, error } = await supabase
        .from("deposits")
        .update({ status: "failed" })
        .eq("id", depositId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      showToast({ type: "info", title: "Deposit Rejected", description: "Deposit marked as failed." });
    },
  });

  const columns: Column<any>[] = [
    {
      header: "Deposit Ref",
      accessorKey: "reference",
      cell: (row) => <span className="font-mono text-xs text-white">{row.reference || row.id.slice(0, 8)}</span>,
    },
    {
      header: "Provider",
      accessorKey: "provider",
      cell: (row) => <span className="font-semibold text-slate-300">{row.provider}</span>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-emerald-400">+{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Date",
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
              onClick={() => approveDeposit.mutate(row.id)}
              disabled={approveDeposit.isPending}
              className="h-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectDeposit.mutate(row.id)}
              disabled={rejectDeposit.isPending}
              className="h-8 text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-500">Processed</span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Inbound Deposit Queue</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Review and credit pending bank wire deposits</p>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={depositsQuery.data || []}
          columns={columns}
          searchPlaceholder="Search deposit reference or provider..."
          searchField="reference"
          emptyTitle="No Pending Deposits"
          emptyDescription="All deposit requests have been processed."
        />
      </GlassCard>
    </div>
  );
}
