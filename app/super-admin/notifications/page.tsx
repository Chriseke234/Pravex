"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationBroadcasterPage() {
  const supabase = createClient();
  const [targetType, setTargetType] = useState<"all" | "user">("all");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      setErrorMsg("");
      setSuccessMsg("");
      
      let recipientId: string | null = null;
      
      if (targetType === "user") {
        if (!recipientEmail.trim()) {
          throw new Error("Recipient email address is required.");
        }
        
        // Find user by email
        const { data: profile, error: findErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", recipientEmail.trim().toLowerCase())
          .maybeSingle();

        if (findErr) throw findErr;
        if (!profile) {
          throw new Error("No user profile found with that email address.");
        }
        recipientId = profile.id;
      }

      if (!title.trim() || !message.trim()) {
        throw new Error("Title and Message body are required.");
      }

      // Insert notification
      const { error: insertErr } = await supabase
        .from("notifications")
        .insert([{
          recipient_id: recipientId, // null means broadcast
          title: title.trim(),
          message: message.trim(),
          read: false
        }]);

      if (insertErr) throw insertErr;

      // Log action
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from("audit_logs").insert([{
        actor_id: session?.user?.id,
        actor_role: "super_admin",
        action: targetType === "all" ? "broadcast_notification" : "user_notification",
        target: recipientId || "all",
        metadata: { title, message }
      }]);
    },
    onSuccess: () => {
      setSuccessMsg(`Notification successfully ${targetType === "all" ? "broadcasted to all users" : "sent to user"}!`);
      setTitle("");
      setMessage("");
      setRecipientEmail("");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to send notification.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Notification Desk</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Platform-Wide Alerts and Notices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 space-y-6 border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground border-b border-white/5 pb-4">
              <Bell className="w-4 h-4 text-purple-400" /> Compose Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Broadcast Target</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setTargetType("all"); setErrorMsg(""); }}
                    className={cn(
                      "flex-1 py-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all",
                      targetType === "all" 
                        ? "bg-purple-600/10 border-purple-500/30 text-white" 
                        : "bg-white/[0.01] border-white/5 text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <Users className="w-4 h-4" /> Broadcast (All Users)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTargetType("user"); setErrorMsg(""); }}
                    className={cn(
                      "flex-1 py-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all",
                      targetType === "user" 
                        ? "bg-purple-600/10 border-purple-500/30 text-white" 
                        : "bg-white/[0.01] border-white/5 text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <User className="w-4 h-4" /> Single User
                  </button>
                </div>
              </div>

              {targetType === "user" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recipient Email</label>
                  <Input
                    type="email"
                    placeholder="e.g. user@fintech-partners.org"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="bg-black/20 border-white/10 rounded-xl text-xs"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notification Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Scheduled Network Upgrade"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/20 border-white/10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message Body</label>
                <textarea
                  placeholder="Write your announcement details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-white leading-relaxed"
                />
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-emerald-500 font-medium">{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-rose-500 font-medium">{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="premium"
                className="w-full gap-2 rounded-xl py-6 font-bold"
                disabled={broadcastMutation.isPending}
              >
                {broadcastMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Dispatch Notification
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Sidebar help */}
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-4 border-white/5">
            <h3 className="font-bold">Broadcast Dispatch Rules</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Broadcasts are loaded instantly for all online users on their next dashboard update. Direct user notifications trigger alert highlights in their specific wallet balance or notification sidebar widgets.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
