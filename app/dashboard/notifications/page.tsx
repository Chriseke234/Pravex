"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDate } from "@/lib/utils/formatters";

export default function NotificationsPage() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Notifications &amp; Alerts</h1>
            <p className="text-slate-400 text-sm">System updates, security heartbeats, and transaction confirmations.</p>
          </div>
        </div>
      </div>

      <GlassCard className="p-6 bg-slate-900/80 border-slate-800 space-y-4 max-w-4xl">
        {isLoading ? (
          <div className="py-12 text-center text-slate-500">Loading notifications...</div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No active notifications recorded.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  n.read
                    ? "bg-slate-950/40 border-slate-800/60 opacity-70"
                    : "bg-amber-500/5 border-amber-500/30"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-500 pt-1">{formatDate(n.created_at)}</p>
                </div>

                {!n.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead.mutate(n.id)}
                    className="text-xs text-amber-400 hover:text-white shrink-0 gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
