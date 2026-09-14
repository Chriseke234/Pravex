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

const DEFAULT_PAYEES: (Payee & { avatarUrl?: string })[] = [
  {
    id: "fav-1",
    name: "Alina K.",
    bankName: "Chase Bank",
    accountNumber: "•••• 4691",
    avatarColor: "from-amber-500 to-amber-700",
    initials: "AK",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fav-2",
    name: "Mark T.",
    bankName: "Bank of America",
    accountNumber: "•••• 3712",
    avatarColor: "from-blue-500 to-indigo-700",
    initials: "MT",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fav-3",
    name: "Rachel V.",
    bankName: "Wells Fargo",
    accountNumber: "•••• 8901",
    avatarColor: "from-emerald-500 to-teal-700",
    initials: "RV",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "fav-4",
    name: "David S.",
    bankName: "Citibank",
    accountNumber: "•••• 5143",
    avatarColor: "from-purple-500 to-pink-700",
    initials: "DS",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

export function QuickPayees({
  onSelectPayee,
  onAddPayee,
}: {
  onSelectPayee: (payee: Payee) => void;
  onAddPayee?: () => void;
}) {
  const { transfers } = useTransfers();

  // Extract unique real payees or use default favourite contacts
  const displayPayees = useMemo<(Payee & { avatarUrl?: string })[]>(() => {
    if (!transfers || transfers.length === 0) return DEFAULT_PAYEES;

    const map = new Map<string, Payee & { avatarUrl?: string }>();
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
          bankName: tx.bank_name || "Bank Account",
          accountNumber: tx.recipient_account || "",
          avatarColor: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
          initials,
        });
      }
    });

    const result = Array.from(map.values());
    return result.length > 0 ? result.slice(0, 8) : DEFAULT_PAYEES;
  }, [transfers]);

  return (
    <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Favourite Contacts</h3>
            <p className="text-xs text-slate-400">Quick 1-tap transfers to saved payees</p>
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
          <div className="w-10 h-10 rounded-full bg-[#0A1628] border border-[#17293F] group-hover:border-amber-500/30 flex items-center justify-center text-amber-400 mb-1.5 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white text-center leading-tight">
            Add New
          </span>
        </button>

        {/* Display payees */}
        {displayPayees.map((payee) => (
          <button
            key={payee.id}
            type="button"
            onClick={() => onSelectPayee(payee)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080F1A]/70 border border-[#17293F] hover:border-amber-500/50 hover:bg-[#122140]/40 transition-all shrink-0 w-24 h-28 group text-center"
          >
            {payee.avatarUrl ? (
              <img
                src={payee.avatarUrl}
                alt={payee.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30 group-hover:scale-105 transition-transform mb-1.5"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${payee.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform mb-1.5`}
              >
                {payee.initials}
              </div>
            )}
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
