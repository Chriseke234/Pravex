"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Globe, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Activity, 
  Zap,
  Lock,
  RefreshCcw,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_WEBHOOKS = [
  { id: "1", url: "https://api.tradingdesk.com/webhooks/pavex", events: ["transaction.completed", "vault.approved"], status: "Active" },
];

export default function WebhooksPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhook Configurations</h1>
          <p className="text-muted-foreground">Synchronize your institutional backend with real-time event notifications.</p>
        </div>
        <Button variant="premium" className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Webhook
        </Button>
      </div>

      {/* Active Webhooks */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold px-2">Registered Endpoints</h2>
        <div className="space-y-4">
          {MOCK_WEBHOOKS.map((webhook) => (
            <GlassCard key={webhook.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/20">
                    <Globe className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">{webhook.url}</h3>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {webhook.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">• {webhook.events.length} events subscribed</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="flex gap-1">
                    {webhook.events.map(e => (
                      <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {e}
                      </span>
                    ))}
                  </div>
                  <Button variant="glass" size="icon" className="h-9 w-9">
                    <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="glass" size="icon" className="h-9 w-9">
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Webhook Security */}
      <GlassCard className="p-8 space-y-6 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">Signature Verification</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pavex signs all webhook events with a unique secret key. Use this secret to verify that payloads 
          are sent from our infrastructure and have not been tampered with.
        </p>
        <div className="flex gap-2 items-center">
          <code className="flex-1 bg-black/40 p-3 rounded-xl text-xs font-mono border border-white/5">
            whsec_0912384759023485790238475
          </code>
          <Button variant="outline" size="sm">Reveal Secret</Button>
        </div>
      </GlassCard>

      {/* New Webhook Modal (Mock) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-xl w-full p-8 space-y-6 relative">
            <h2 className="text-2xl font-bold">Register New Endpoint</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Endpoint URL</label>
                <Input placeholder="https://api.yourdomain.com/webhooks" className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Events to Monitor</label>
                <div className="grid grid-cols-1 gap-2">
                  {["transaction.created", "transaction.completed", "vault.approval_requested", "vault.created", "security.mfa_failed"].map(e => (
                    <label key={e} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="checkbox" className="rounded border-white/20 bg-transparent text-primary" />
                      <span className="text-sm">{e}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="glass" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="premium" className="flex-1">Register Endpoint</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
