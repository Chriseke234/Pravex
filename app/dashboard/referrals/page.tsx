"use client";

import { useState } from "react";
import { Gift, Copy, Check, Send, Users } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReferrals } from "@/hooks/use-referrals";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function ReferralsPage() {
  const { referrals, isLoading, inviteFriend } = useReferrals();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const referralLink = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=CLIENT-${Math.floor(1000 + Math.random() * 9000)}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast({ type: "success", title: "Link Copied", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async () => {
    if (!email) return;
    setIsSending(true);
    try {
      await inviteFriend.mutateAsync(email);
      showToast({ type: "success", title: "Invitation Sent", description: `Referral invite sent to ${email}.` });
      setEmail("");
    } catch (e: any) {
      showToast({ type: "error", title: "Invite Failed", description: e.message || "Failed to send referral." });
    } finally {
      setIsSending(false);
    }
  };

  const totalEarned = referrals.filter((r) => r.status === "credited").reduce((sum, r) => sum + Number(r.bonus_amount), 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Client Referral Programme</h1>
          <p className="text-slate-400 text-sm">Earn $10 for every individual or business member you invite who opens an account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Bonus Earned</span>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalEarned)}</p>
        </GlassCard>
        <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Invites Sent</span>
          <p className="text-3xl font-bold text-white">{referrals.length}</p>
        </GlassCard>
        <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Bonus Per Referral</span>
          <p className="text-3xl font-bold text-amber-400">$10.00</p>
        </GlassCard>
      </div>

      <GlassCard className="p-8 bg-slate-900/80 border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white">Your Unique Referral Link</h2>
        <div className="flex gap-3">
          <Input value={referralLink} readOnly className="bg-slate-950 border-slate-800 font-mono text-xs" />
          <Button onClick={handleCopy} className="gap-2 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 shrink-0">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-300">Direct Email Invite</h3>
          <div className="flex gap-3">
            <Input type="email" placeholder="friend@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-950" />
            <Button onClick={handleInvite} disabled={!email || isSending} className="gap-2 bg-slate-800 hover:bg-slate-700 text-white shrink-0">
              <Send className="w-4 h-4" /> Send Invite
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
