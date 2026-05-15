import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Cpu, 
  Database, 
  Network, 
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default function AdminMonitoringPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time platform health and transaction throughput.</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Status
        </Button>
      </div>

      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Database className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold">Database</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-3 h-3" /> Operational
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Latency</span>
              <span>12ms</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[12%]" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Network className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold">Edge API</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-3 h-3" /> Operational
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uptime</span>
              <span>99.99%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[99.9%]" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <Cpu className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-bold">Worker Nodes</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Activity className="w-3 h-3" /> High Load
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Capacity</span>
              <span>82%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[82%]" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Incident Log Placeholder */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-2">Recent System Events</h2>
        <GlassCard className="p-0 overflow-hidden">
          <div className="divide-y divide-white/5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    i === 1 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {i === 1 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      {i === 1 ? "Increased API latency in EU-Central" : "Automated backup completed successfully"}
                    </div>
                    <div className="text-xs text-muted-foreground">Region: {i === 1 ? "FRA-1" : "NYC-3"} • Today, 09:12 AM</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

import { cn } from "@/lib/utils";
