"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/services/supabase";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Loader2, 
  AlertCircle,
  Clock,
  Shield,
  Eye,
  RefreshCw,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";


type AuditLogItem = {
  id: string;
  actor_role: string;
  action: string;
  target: string;
  metadata: any;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
};

export default function SuperAdminAuditLogsPage() {
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  // Fetch Audit Logs
  const auditLogsQuery = useQuery<AuditLogItem[]>({
    queryKey: ["super-admin-audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          id,
          actor_role,
          action,
          target,
          metadata,
          created_at,
          profiles:actor_id ( full_name, email )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any as AuditLogItem[];
    }
  });

  const handleRefresh = () => {
    auditLogsQuery.refetch();
  };

  if (auditLogsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const logs = auditLogsQuery.data || [];
  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Audit Logging</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Platform Administrative Ledger</p>
        </div>
        <Button variant="glass" size="sm" onClick={handleRefresh} className="gap-2 text-xs py-5 rounded-xl border border-white/5">
          <RefreshCw className="w-4 h-4 text-muted-foreground" /> Reload Logs
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action or actor email..."
            className="bg-black/20 border-white/10 rounded-xl pl-10 text-xs focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Showing {filteredLogs.length} of {logs.length} ledger entries
        </div>
      </div>

      {/* Logs Table */}
      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actor (Role)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action Executed</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date / Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground">No events matched query search.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{log.profiles?.full_name || "System Automated"}</span>
                        <span className="text-[10px] text-purple-400 mt-0.5">{log.profiles?.email || "internal@node.service"} ({log.actor_role})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider bg-white/5 border-white/10 text-white">
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground max-w-[150px] truncate">{log.target}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-white/20" /> 
                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-purple-500/10 hover:text-purple-400 text-muted-foreground"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* View Metadata Dialog */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full p-8 space-y-6 relative border-purple-600/20">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Event Details
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 text-xs space-y-1 text-muted-foreground">
                <div>Action: <strong className="text-white capitalize">{selectedLog.action.replace("_", " ")}</strong></div>
                <div>Executor: <strong className="text-white">{selectedLog.profiles?.email || "System"}</strong></div>
                <div>Target UUID: <strong className="text-white font-mono">{selectedLog.target}</strong></div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event Metadata (JSON)</label>
                <pre className="p-4 bg-black/40 rounded-xl border border-white/5 text-[10px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <Button variant="glass" className="w-full rounded-xl text-xs py-5" onClick={() => setSelectedLog(null)}>
              Dismiss Details
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
