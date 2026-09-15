"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { History, Download, ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { transactions, isLoading } = useWallet();

  const handleExportCsv = () => {
    if (!transactions || transactions.length === 0) return;

    const headers = "ID,Type,Amount,Status,Date,Reference,Description\n";
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.type}","${t.amount}","${t.status}","${t.created_at}","${t.reference || ""}","${t.description || ""}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<any>[] = [
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => {
        const isDeposit = String(row.type).toLowerCase() === "deposit";
        return (
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isDeposit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-semibold text-white capitalize">{row.type || "Transaction"}</p>
              <p className="text-[11px] text-slate-500">{row.reference || "Internal Reference"}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => {
        const isDeposit = String(row.type).toLowerCase() === "deposit";
        return (
          <span className={`font-bold ${isDeposit ? "text-emerald-400" : "text-slate-200"}`}>
            {isDeposit ? "+" : "-"}{formatCurrency(row.amount)}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Date & Time",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => <span className="text-slate-400 text-xs">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
          </div>
          <p className="text-slate-400 text-sm">History of all inbound deposits, outbound transfers, and payments.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Table Card */}
      <GlassCard className="p-6 bg-slate-900/80 border-slate-800">
        <DataTable
          data={transactions || []}
          columns={columns}
          searchPlaceholder="Filter transactions by type or reference..."
          searchField="type"
          onExportCsv={handleExportCsv}
          emptyTitle="No Transactions Recorded"
          emptyDescription="Your transaction activity will appear here once you initiate deposits or transfers."
        />
      </GlassCard>
    </div>
  );
}
