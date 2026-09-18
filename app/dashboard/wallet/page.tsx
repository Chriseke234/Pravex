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
      "IRON BRIDGE PLC — CASH TREASURY AUDIT STATEMENT\n" +
      `Generated: ${new Date().toUTCString()}\n` +
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#17293F] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Landmark className="w-4 h-4" />
            <span>Account Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">My Account</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your account balance, deposits, and withdrawals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-[#0C1A2E] border-[#17293F] text-slate-300 hover:text-white"
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

      {/* Fiat Treasury Core */}
      <FiatWallet />
    </div>
  );
}
