"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  RefreshCw, 
  Loader2, 
  Smartphone, 
  Laptop, 
  Globe,
  Clock,
  ShieldCheck,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";

type SessionWithUser = {
  id: string;
  login_time: string;
  last_activity: string;
  status: "online" | "offline";
  device: string | null;
  ip_address: string | null;
  profiles: {
    full_name: string | null;
    email: string;
    role: string;
  };
};

export default function SuperAdminMonitoringPage() {
  const supabase = createClient();

  // Query sessions with join on profiles
  const sessionsQuery = useQuery<SessionWithUser[]>({
    queryKey: ["super-admin-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_sessions")
        .select(`
          id,
          login_time,
          last_activity,
          status,
          device,
          ip_address,
          profiles:user_id ( full_name, email, role )
        `)
        .order("last_activity", { ascending: false });

      if (error) throw error;
      return data as any as SessionWithUser[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live monitor effect
  });

  const handleRefresh = () => {
    sessionsQuery.refetch();
  };

  if (sessionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const sessions = sessionsQuery.data || [];
  const onlineCount = sessions.filter(s => s.status === "online").length;
  const offlineCount = sessions.length - onlineCount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Live Session Monitoring</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Real-time user heartbeat tracking</p>
        </div>
        <Button variant="glass" size="sm" onClick={handleRefresh} className="gap-2 text-xs py-5 rounded-xl border border-white/5">
          <RefreshCw className="w-4 h-4 text-muted-foreground" /> Manual Refresh
        </Button>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 space-y-2 border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online Users</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2">
            {onlineCount} <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
          </div>
          <p className="text-[10px] text-muted-foreground">Active heartbeat in last 5 mins</p>
        </GlassCard>

        <GlassCard className="p-6 space-y-2 border-white/5">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Offline Users</div>
          <div className="text-3xl font-bold text-white">{offlineCount}</div>
          <p className="text-[10px] text-muted-foreground">Terminated or expired sessions</p>
        </GlassCard>

        <GlassCard className="p-6 space-y-2 border-white/5">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Total Monitored Nodes</div>
          <div className="text-3xl font-bold text-white">{sessions.length}</div>
          <p className="text-[10px] text-muted-foreground">Historical session log footprint</p>
        </GlassCard>
      </div>

      {/* Sessions Table */}
      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Account</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Device Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IP Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Login Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Active</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Session status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-xs text-muted-foreground">
                    No active sessions monitored yet.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => {
                  const isMobile = s.device?.toLowerCase().includes("mobile") || s.device?.toLowerCase().includes("android") || s.device?.toLowerCase().includes("iphone");
                  return (
                    <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{s.profiles?.full_name || "New Institution"}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{s.profiles?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-white max-w-[200px] truncate">
                        <div className="flex items-center gap-1.5">
                          {isMobile ? <Smartphone className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <Laptop className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                          <span className="truncate">{s.device || "Unknown Client"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-white/20" /> {s.ip_address || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(s.login_time).toLocaleDateString()} {new Date(s.login_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-xs text-white">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" /> {new Date(s.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                          s.status === "online" 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-muted/10 text-muted-foreground border-white/5"
                        )}>
                          {s.status === "online" ? <ShieldCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
