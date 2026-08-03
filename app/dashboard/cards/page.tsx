"use client";

import { useState } from "react";
import { CreditCard, Plus, Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { useCards } from "@/hooks/use-cards";
import { formatCurrency } from "@/lib/utils/formatters";
import { useToast } from "@/components/ui/toast";

export default function CardsPage() {
  const { cards, isLoading, requestCard, toggleFreeze } = useCards();
  const { showToast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async (type: "virtual" | "physical") => {
    setIsRequesting(true);
    try {
      await requestCard.mutateAsync({ card_type: type });
      showToast({
        type: "success",
        title: "Card Issued",
        description: `Your new Iron Bridge ${type} Visa card is ready.`,
      });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Issuance Failed",
        description: e.message || "Failed to issue card.",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Payment Cards</h1>
          </div>
          <p className="text-slate-400 text-sm">Manage virtual and physical Visa cards, spending limits, and security locks.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleRequest("virtual")} variant="outline" disabled={isRequesting} className="gap-2">
            <Plus className="w-4 h-4" /> Issue Virtual Card
          </Button>
          <Button onClick={() => handleRequest("physical")} disabled={isRequesting} className="gap-2 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600">
            <CreditCard className="w-4 h-4" /> Order Physical Card
          </Button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.length === 0 ? (
          <div className="col-span-full py-16 text-center space-y-4 border-2 border-dashed border-slate-800 rounded-3xl">
            <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">No Payment Cards Issued</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Issue a virtual card instantly or request a physical metal card delivered to your doorstep.</p>
            </div>
            <Button onClick={() => handleRequest("virtual")} className="bg-amber-500 text-slate-950 font-bold">
              Issue Free Virtual Card
            </Button>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className={`p-6 rounded-3xl space-y-6 border transition-all relative overflow-hidden ${
                card.card_type === "physical"
                  ? "bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-500/40 shadow-xl"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  {card.card_type} {card.card_network}
                </span>
                <span className={`text-xs font-bold ${card.status === "active" ? "text-emerald-400" : "text-amber-400"}`}>
                  {card.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500">Card Number</div>
                <div className="text-xl font-mono tracking-widest text-white">
                  •••• •••• •••• {card.last_four}
                </div>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  <span>Expires</span>
                  <p className="font-mono text-white">{card.expiry_month}/{card.expiry_year}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleFreeze.mutate({ cardId: card.id, currentStatus: card.status })}
                  className="h-8 text-xs gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  {card.status === "active" ? "Freeze Card" : "Unfreeze"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
