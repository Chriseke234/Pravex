"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/shared/glass-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Send, ShieldAlert } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

export default function AdminTransfersPage() {
  const supabase = createClient();

  const transfersQuery = useQuery({
    queryKey: ["admin-transfers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transfers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const columns: Column<any>[] = [
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (row) => <span className="font-mono text-xs text-white">{row.reference || row.id.slice(0, 8)}</span>,
    },
    {
      header: "Beneficiary & Bank",
      accessorKey: "recipient_name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-white">{row.recipient_name}</p>
          <p className="text-[11px] text-slate-400">{row.bank_name} • {row.recipient_account}</p>
        </div>
      ),
    },
    {
      header: "Transfer Type",
      accessorKey: "type",
      cell: (row) => <span className="text-xs uppercase font-bold text-amber-400">{row.type}</span>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-white">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Timestamp",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-400">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Wire &amp; Transfer Monitoring</h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Real-time domestic, SWIFT, and internal transfer audit log</p>
      </div>

      <GlassCard className="p-6 border-white/5">
        <DataTable
          data={transfersQuery.data || []}
          columns={columns}
          searchPlaceholder="Search by beneficiary or bank..."
          searchField="recipient_name"
          emptyTitle="No Transfers Recorded"
          emptyDescription="Platform transfers will appear here in real time."
        />
      </GlassCard>
    </div>
  );
}
