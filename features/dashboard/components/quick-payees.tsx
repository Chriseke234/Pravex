"use client";

import { useMemo } from "react";
import { Plus, UserCheck, Send } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { useTransfers } from "@/hooks/use-transfers";

export interface Payee {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  avatarColor: string;
  initials: string;
}

const AVATAR_GRADIENTS = [
  "from-amber-500 to-amber-700",
  "from-blue-500 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-purple-500 to-pink-700",
  "from-amber-400 to-orange-600",
];

export function QuickPayees({
  onSelectPayee,
  onAddPayee,
}: {
  onSelectPayee: (payee: Payee) => void;
  onAddPayee?: () => void;
}) {
  const { transfers, isLoading } = useTransfers();

  // Extract unique real payees from user's actual transfers
  const realPayees = useMemo<Payee[]>(() => {
    if (!transfers || transfers.length === 0) return [];

    const map = new Map<string, Payee>();
    transfers.forEach((tx, idx) => {
      if (tx.recipient_name && !map.has(tx.recipient_name)) {
        const initials = tx.recipient_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "BN";

        map.set(tx.recipient_name, {
          id: tx.id || `payee-${idx}`,
          name: tx.recipient_name,
          bankName: tx.bank_name || "Commercial Bank",
          accountNumber: tx.recipient_account || "",
          avatarColor: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
          initials,
        });
      }
    });

    return Array.from(map.values()).slice(0, 8);
  }, [transfers]);

  return (
    <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Frequent Payees</h3>
            <p className="text-xs text-slate-400">One-click transfers to recent beneficiaries</p>
          </div>
        </div>
      </div>

      {/* Payees Horizontal List */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {/* Add / New Payee Button */}
        <button
          type="button"
          onClick={onAddPayee}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080F1A]/70 border border-dashed border-[#17293F] hover:border-amber-500/40 hover:bg-[#122140]/40 transition-all shrink-0 w-24 h-28 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0A1628] border border-[#17293F] group-hover:border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white text-center leading-tight">
            New Wire
          </span>
        </button>

        {/* Empty state or real payees */}
        {realPayees.length === 0 ? (
          <div className="flex items-center gap-2 px-4 text-xs text-slate-400 italic">
            <span>No saved counterparties yet. Transmit a wire to build your frequent payees list.</span>
          </div>
        ) : (
          realPayees.map((payee) => (
            <button
              key={payee.id}
              type="button"
              onClick={() => onSelectPayee(payee)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080F1A]/70 border border-[#17293F] hover:border-amber-500/50 hover:bg-[#122140]/40 transition-all shrink-0 w-28 h-28 group text-center"
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
          ))
        )}
      </div>
    </GlassCard>
  );
}
