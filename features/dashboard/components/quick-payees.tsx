"use client";

import { Plus, Send, UserCheck } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";

export interface Payee {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  avatarColor: string;
  initials: string;
}

const DEFAULT_PAYEES: Payee[] = [
  {
    id: "p-1",
    name: "Acme Corp Ltd",
    bankName: "Barclays Commercial",
    accountNumber: "GB29IBB1029384756",
    avatarColor: "from-amber-500 to-amber-700",
    initials: "AC",
  },
  {
    id: "p-2",
    name: "AWS Infrastructure",
    bankName: "J.P. Morgan Chase",
    accountNumber: "US91CHAS0928174628",
    avatarColor: "from-blue-500 to-indigo-700",
    initials: "AW",
  },
  {
    id: "p-3",
    name: "Elena Vance (Payroll)",
    bankName: "HSBC UK Bank",
    accountNumber: "GB44HSBC4001239876",
    avatarColor: "from-emerald-500 to-teal-700",
    initials: "EV",
  },
  {
    id: "p-4",
    name: "Prime Property Trust",
    bankName: "BNP Paribas",
    accountNumber: "FR76BNPA3000600001",
    avatarColor: "from-purple-500 to-pink-700",
    initials: "PP",
  },
  {
    id: "p-5",
    name: "Marcus Sterling",
    bankName: "Citibank NA",
    accountNumber: "US33CITI1000998822",
    avatarColor: "from-amber-400 to-orange-600",
    initials: "MS",
  },
];

export function QuickPayees({
  onSelectPayee,
  onAddPayee,
}: {
  onSelectPayee: (payee: Payee) => void;
  onAddPayee?: () => void;
}) {
  return (
    <GlassCard className="p-5 sm:p-6 bg-slate-900/80 border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Frequent Payees</h3>
            <p className="text-xs text-slate-400">Instant one-click wire transfers to verified beneficiaries</p>
          </div>
        </div>
      </div>

      {/* Payees Horizontal List */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {/* Add Payee Button */}
        <button
          type="button"
          onClick={onAddPayee}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all shrink-0 w-24 h-28 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white text-center leading-tight">
            Add Payee
          </span>
        </button>

        {/* Existing Payees */}
        {DEFAULT_PAYEES.map((payee) => (
          <button
            key={payee.id}
            type="button"
            onClick={() => onSelectPayee(payee)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-800/40 transition-all shrink-0 w-28 h-28 group text-center"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${payee.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md shadow-amber-500/5 group-hover:scale-105 transition-transform mb-1.5`}
            >
              {payee.initials}
            </div>
            <span className="text-xs font-semibold text-white truncate w-full group-hover:text-amber-300">
              {payee.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
              {payee.bankName}
            </span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
