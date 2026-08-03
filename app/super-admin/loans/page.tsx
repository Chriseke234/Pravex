"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function AdminLoansPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const loansQuery = useQuery({
    queryKey: ["admin-loans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const approveLoan = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("loans")
        .update({ status: "approved" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      showToast({ type: "success", title: "Loan Approved", description: "Credit facility authorized for client." });
    },
  });

  const rejectLoan = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("loans")
        .update({ status: "rejected" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      showToast({ type: "info", title: "Loan Rejected", description: "Application marked as rejected." });
    },
  });

  const columns: Column<any>[] = [
    {
      header: "Loan Type & Purpose",
      accessorKey: "loan_type",
      cell: (row) => (
        <div>
          <p className="font-bold text-white uppercase text-xs">{row.loan_type} Loan</p>
          <p className="text-xs text-slate-400">{row.purpose}</p>
        </div>
      ),
    },
    {
      header: "Requested Principal",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-white">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Monthly / Term",
      cell: (row) => (
        <span className="text-xs text-slate-300">
          {formatCurrency(row.monthly_payment)} / {row.duration_months}m
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Application Date",
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
              onClick={() => approveLoan.mutate(row.id)}
              disabled={approveLoan.isPending}
              className="h-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectLoan.mutate(row.id)}
              disabled={rejectLoan.isPending}
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
        <h1 className="text-3xl font-bold tracking-tight text-white">Loan &amp; Credit Applications</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Underwrite mortgage, commercial property, and credit line applications</p>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={loansQuery.data || []}
          columns={columns}
          searchPlaceholder="Search purpose or loan type..."
          searchField="purpose"
          emptyTitle="No Loan Applications Pending"
          emptyDescription="All loan applications have been underwritten."
        />
      </GlassCard>
    </div>
  );
}
