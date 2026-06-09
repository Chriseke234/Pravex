"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  Coins,
  MessageSquare,
  Bell,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/services/supabase";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/session-provider";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/super-admin" },
  { label: "User Directory", icon: Users, href: "/super-admin/users" },
  { label: "Admin Management", icon: ShieldCheck, href: "/super-admin/admins" },
  { label: "Live Monitoring", icon: Activity, href: "/super-admin/monitoring" },
  { label: "Finance Center", icon: Coins, href: "/super-admin/finance" },
  { label: "Support Queue", icon: MessageSquare, href: "/super-admin/support" },
  { label: "Notification Desk", icon: Bell, href: "/super-admin/notifications" },
  { label: "Audit Logs", icon: FileText, href: "/super-admin/audit" },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#070708] text-white flex">

      {/* Super Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-2xl flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-white/5">
          <Link href="/super-admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-600/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-extrabold tracking-widest text-white uppercase italic">Ironbridge Super</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6 mt-4">
          <div className="space-y-1">
            <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Core Controls</p>
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group border border-transparent",
                    isActive 
                      ? "bg-purple-600/10 text-purple-400 border-purple-500/20" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-purple-400" : "text-muted-foreground group-hover:text-white")} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/dashboard" className="w-full">
            <Button variant="glass" className="w-full justify-start gap-2 text-xs py-5 rounded-xl border border-white/5">
              <LogOut className="w-4 h-4 text-muted-foreground" />
              Exit to Dashboard
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 py-5 rounded-xl"
            onClick={handleSignOut}
          >
            <ShieldAlert className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col">
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Root Authority Session</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-white">{profile?.full_name || profile?.email || "Super Admin"}</div>
              <div className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Super Administrator</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-purple-600/20 border border-purple-600/50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
    </SessionProvider>
  );
}

