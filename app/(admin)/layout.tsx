import Link from "next/link";
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">Pavex Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Platform Control</p>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-rose-600/10 text-rose-500 font-medium border border-rose-600/20">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <Users className="w-5 h-5" />
              User Management
            </Link>
            <Link href="/admin/monitoring" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <Activity className="w-5 h-5" />
              Monitoring
            </Link>
          </div>

          <div className="space-y-1 pt-6 border-t border-white/5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">System</p>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-5 h-5" />
              Configuration
            </Link>
            <Link href="/admin/security" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <ShieldCheck className="w-5 h-5" />
              Security Logs
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5">
            <LogOut className="w-4 h-4" />
            Exit Admin Panel
          </Button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 pl-64">
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold">Admin Root</div>
              <div className="text-[10px] text-rose-500 font-bold uppercase">Superuser Access</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-600/50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
