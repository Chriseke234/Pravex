"use client";

import { useState } from "react";
import { FiatWallet } from "@/features/dashboard/components/fiat-wallet";
import { Button } from "@/components/ui/button";
import { Download, Landmark, ShieldCheck, FileSpreadsheet, Plus } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function WalletPage() {
  const { wallet, transactions } = useWallet();
  const { showToast } = useToast();

  const handleExportStatement = () => {
    const content =
      "IRON BRIDGE BANKING PLC — CASH TREASURY AUDIT STATEMENT\n" +
      `Generated: ${new Date().toUTCString()}\n` +
      `Regulatory Protection: FSCS Protected up to £85,000\n` +
      `============================================================\n` +
      `Primary Cash Balance: ${formatCurrency(wallet?.balance || 0)}\n` +
      `Currency Standard: USD Clearing\n` +
      `============================================================\n` +
      `Recorded Transactions:\n` +
      (transactions && transactions.length > 0
        ? transactions
            .map(
              (t) =>
                `- ${formatDate(t.created_at)} | ${t.type.toUpperCase()} | ${formatCurrency(t.amount)} | [${t.status}]`
            )
            .join("\n")
        : "No recorded transactions.") +
      `\n============================================================\nStatus: VERIFIED & AUDITED`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ironbridge_treasury_statement_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      title: "Statement Exported",
      description: "Treasury statement downloaded successfully.",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Landmark className="w-4 h-4" />
            <span>Commercial Treasury Management</span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Cash &amp; Liquidity Treasury</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your operating cash reserves, domestic clearing, and instant liquidity withdrawals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            onClick={handleExportStatement}
          >
            <Download className="w-4 h-4" />
            <span>Export Treasury Audit</span>
          </Button>

          <Link href="/dashboard/transfers">
            <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
              <Plus className="w-4 h-4" />
              <span>Initiate Wire Transfer</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-slate-300">
            Treasury funds are safeguarded in segregated tier-1 clearing banks under FSCS / FCA regulatory frameworks.
          </p>
        </div>
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest hidden sm:inline-block">
          TIER-1 PROTECTED
        </span>
      </div>

      {/* Fiat Treasury Core */}
      <FiatWallet />
    </div>
  );
}
