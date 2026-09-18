"use client";

import { useState } from "react";
import { Send, Globe, ArrowRight, Building2, CheckCircle2, History } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTransfers } from "@/hooks/use-transfers";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function TransfersPage() {
  const { transfers, isLoading, createTransfer } = useTransfers();
  const { showToast } = useToast();

  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async (transferType: "domestic" | "international" | "internal") => {
    if (!amount || !recipientName || !recipientAccount) return;
    setIsSubmitting(true);
    try {
      await createTransfer.mutateAsync({
        recipient_name: recipientName,
        recipient_account: recipientAccount,
        bank_name: bankName || (transferType === "internal" ? "Iron Bridge Finance" : "External Bank"),
        amount: Number(amount),
        currency: "USD",
        type: transferType,
        description: description || `${transferType} transfer`,
      });

      showToast({
        type: "success",
        title: "Transfer Transmitted",
        description: `${formatCurrency(Number(amount))} wire sent to ${recipientName}.`,
      });

      setRecipientName("");
      setRecipientAccount("");
      setBankName("");
      setBankCode("");
      setAmount("");
      setDescription("");
    } catch (e: any) {
      showToast({
        type: "error",
        title: "Transfer Failed",
        description: e.message || "Failed to transmit transfer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Transfers &amp; Payments</h1>
          </div>
          <p className="text-slate-400 text-sm">Send domestic ACH/SEPA, SWIFT international wires, or internal transfers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Transfer Form Column */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-6">
            <Tabs defaultValue="domestic">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="domestic">Domestic Wire</TabsTrigger>
                <TabsTrigger value="international">International SWIFT</TabsTrigger>
                <TabsTrigger value="internal">Iron Bridge Finance Internal</TabsTrigger>
              </TabsList>

              {/* Domestic Form */}
              <TabsContent value="domestic" className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Beneficiary Name</label>
                  <Input placeholder="Full Name or Business Entity" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Number / IBAN</label>
                    <Input placeholder="e.g. 1029384756" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Routing / Sort Code</label>
                    <Input placeholder="e.g. 021000021" value={bankCode} onChange={(e) => setBankCode(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Beneficiary Bank Name</label>
                  <Input placeholder="e.g. JPMorgan Chase Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount ($)</label>
                  <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reference / Description</label>
                  <Input placeholder="Invoice # or Payment Note" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <Button onClick={() => handleSend("domestic")} disabled={isSubmitting || !amount || !recipientName} className="w-full h-11 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                  {isSubmitting ? "Transmitting..." : "Send Domestic Wire"} <ArrowRight className="w-4 h-4" />
                </Button>
              </TabsContent>

              {/* International Form */}
              <TabsContent value="international" className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Beneficiary Name</label>
                  <Input placeholder="International Entity Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">International IBAN</label>
                    <Input placeholder="e.g. GB29IBB1029384756" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">SWIFT / BIC Code</label>
                    <Input placeholder="e.g. CHASUS33XXX" value={bankCode} onChange={(e) => setBankCode(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transfer Amount ($)</label>
                  <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button onClick={() => handleSend("international")} disabled={isSubmitting || !amount || !recipientName} className="w-full h-11 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                  {isSubmitting ? "Transmitting..." : "Send International SWIFT"} <Globe className="w-4 h-4" />
                </Button>
              </TabsContent>

              {/* Internal Form */}
              <TabsContent value="internal" className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient Account Number or Email</label>
                  <Input placeholder="IBB Account Number or Member Email" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient Name</label>
                  <Input placeholder="Member Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount ($)</label>
                  <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button onClick={() => handleSend("internal")} disabled={isSubmitting || !amount || !recipientAccount} className="w-full h-11 bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 gap-2">
                  {isSubmitting ? "Transmitting..." : "Send Instant Internal Transfer"} <ArrowRight className="w-4 h-4" />
                </Button>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>

        {/* History Column */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" /> Recent Wire History
            </h2>

            {transfers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No outbound wires sent yet.
              </div>
            ) : (
              <div className="space-y-3">
                {transfers.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-white">{t.recipient_name}</p>
                        <p className="text-[11px] text-slate-500">{t.bank_name} • {t.type}</p>
                      </div>
                      <span className="font-bold text-rose-400">-{formatCurrency(t.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                      <StatusBadge status={t.status} />
                      <span className="text-slate-500">{formatDate(t.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
