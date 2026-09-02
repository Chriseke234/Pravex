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
import { Logo } from "@/components/shared/logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Logo size="sm" href="/admin" />
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
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
            <Link href="/admin/transactions" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <Activity className="w-5 h-5" />
              Audit &amp; Logs
            </Link>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Risk &amp; Compliance</p>
            <Link href="/admin/compliance" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
              <ShieldCheck className="w-5 h-5" />
              KYC Verifications
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white gap-2">
              <LogOut className="w-4 h-4" />
              Exit to App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  );
}
