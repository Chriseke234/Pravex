"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, Unlock, Eye, EyeOff, Copy, Check, Plus, ShieldCheck, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { useCards } from "@/hooks/use-cards";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BankCardWidget() {
  const { cards, isLoading, toggleFreeze, requestCard } = useCards();
  const { profile } = useProfile();
  const { showToast } = useToast();

  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Active primary card or first card
  const primaryCard = cards?.[0] || null;
  const isFrozen = primaryCard?.status === "frozen";
  const cardHolder = profile?.full_name || "VALUED CLIENT";
  const lastFour = primaryCard?.last_four || "8842";
  const expiry = primaryCard ? `${String(primaryCard.expiry_month).padStart(2, "0")}/${String(primaryCard.expiry_year).slice(-2)}` : "12/29";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast({
      type: "success",
      title: "Copied to Clipboard",
      description: `${label} copied successfully.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleFreeze = () => {
    if (!primaryCard) return;
    toggleFreeze.mutate({
      cardId: primaryCard.id,
      currentStatus: primaryCard.status,
    });
    showToast({
      type: "info",
      title: isFrozen ? "Card Unfrozen" : "Card Frozen",
      description: isFrozen ? "Your card is now active for transactions." : "Your card has been temporarily locked for security.",
    });
  };

  const handleQuickIssue = async () => {
    try {
      await requestCard.mutateAsync({ card_type: "virtual" });
      showToast({
        type: "success",
        title: "Virtual Card Issued",
        description: "Your new Iron Bridge Visa Platinum card is active.",
      });
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Issuance Error",
        description: e.message || "Failed to generate card.",
      });
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 bg-[#0C1A2E]/90 border-[#17293F] space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">Payment Card</h3>
            <p className="text-xs text-slate-400">Visa Corporate Debit</p>
          </div>
        </div>
        <Link href="/dashboard/cards">
          <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1">
            Manage Cards
          </Button>
        </Link>
      </div>

      {/* Visual Debit Card */}
      {!primaryCard && !isLoading ? (
        <div className="p-6 rounded-2xl border border-dashed border-[#17293F] bg-[#080F1A]/60 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center mx-auto text-slate-500 border border-[#17293F]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">No Active Card</p>
            <p className="text-xs text-slate-400 mt-0.5">Issue an instant virtual Visa card for online transactions.</p>
          </div>
          <Button size="sm" onClick={handleQuickIssue} className="bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Issue Instant Card
          </Button>
        </div>
      ) : (
        <div className="relative group">
          {/* Card Surface */}
          <div
            className={cn(
              "w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between select-none",
              isFrozen
                ? "bg-gradient-to-br from-[#080F1A] via-[#0C1A2E] to-[#080F1A] border border-[#17293F] opacity-70 grayscale-[50%]"
                : "bg-gradient-to-br from-[#1C3254] via-[#0C1A2E] to-[#080F1A] border border-amber-500/30 shadow-amber-500/5 hover:border-amber-500/50"
            )}
          >
            {/* Background Texture Accents */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar: Bank Logo & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-serif font-black tracking-widest text-white uppercase">
                  IRON <span className="text-amber-400">BRIDGE</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  INFINITE
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Wifi className="w-4 h-4 rotate-90" />
                {isFrozen && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    LOCKED
                  </span>
                )}
              </div>
            </div>

            {/* Middle: EMV Chip & Masked Number */}
            <div className="space-y-3 relative z-10 my-auto">
              <div className="flex items-center justify-between">
                {/* Gold Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-sm flex items-center justify-center relative overflow-hidden">
                  <div className="w-full h-[1px] bg-amber-700/50 absolute" />
                  <div className="h-full w-[1px] bg-amber-700/50 absolute" />
                  <div className="w-4 h-3 rounded-sm border border-amber-700/40" />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                  title={showDetails ? "Hide Details" : "Reveal Card Details"}
                  aria-label="Toggle card details"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-base sm:text-lg tracking-[0.2em] text-white font-medium drop-shadow">
                  {showDetails ? `4242 8810 9920 ${lastFour}` : `•••• •••• •••• ${lastFour}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(showDetails ? `424288109920${lastFour}` : `424288109920${lastFour}`, "Card Number")}
                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                  title="Copy Number"
                  aria-label="Copy card number"
                >
                  {copiedField === "Card Number" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom Row: Holder, Expiry & Visa Logo */}
            <div className="flex items-end justify-between relative z-10 text-xs">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Cardholder</p>
                <p className="font-medium text-slate-200 uppercase tracking-wider truncate max-w-[140px] text-xs">
                  {cardHolder}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Expires</p>
                  <p className="font-mono text-slate-200 font-semibold">{expiry}</p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">CVV</p>
                  <p className="font-mono text-slate-200 font-semibold">{showDetails ? "849" : "•••"}</p>
                </div>

                {/* Visa Badge */}
                <span className="font-black italic text-base tracking-tighter text-white/90 ml-1">
                  VISA
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Under Card */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFreeze}
              className={cn(
                "h-9 text-xs font-semibold gap-1.5 bg-[#0A1628] border-[#17293F] transition-all",
                isFrozen ? "text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40" : "text-slate-300 hover:text-rose-400 hover:border-rose-500/40"
              )}
            >
              {isFrozen ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Unfreeze Card
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Freeze Card
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-9 text-xs font-semibold gap-1.5 bg-[#0A1628] border-[#17293F] text-slate-300 hover:text-white hover:bg-[#122140] transition-all"
            >
              {showDetails ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              {showDetails ? "Hide PIN / CVV" : "Show Details"}
            </Button>
          </div>
        </div>
      )}

      {/* Security & Limit footer */}
      <div className="pt-3 border-t border-[#17293F] flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>3D Secure 2.0 &amp; Apple Pay</span>
        </div>
        <span className="font-mono text-slate-300 font-medium">Daily Limit: $25,000</span>
      </div>
    </GlassCard>
  );
}
