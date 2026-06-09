"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui-store";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/services/supabase";
import { 
  X,
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  History, 
  BarChart4, 
  Settings, 
  LogOut,
  Shield,
  CreditCard,
  Code2,
  Terminal,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Analytics", icon: BarChart4, href: "/dashboard/analytics" },
  { label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
  { label: "Vaults", icon: Shield, href: "/dashboard/vaults" },
  { label: "Transactions", icon: History, href: "/dashboard/transactions" },
  { label: "Market Data", icon: BarChart4, href: "/dashboard/markets" },
];

const UTILITY_ITEMS = [
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const DEVELOPER_ITEMS = [
  { label: "API Keys", icon: Code2, href: "/dashboard/settings/api-keys" },
  { label: "Webhooks", icon: Globe, href: "/dashboard/settings/webhooks" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { profile, isLoading } = useProfile();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initial = profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U";
  const name = profile?.full_name || profile?.email || "Unknown User";
  const tier = profile?.tier || "Starter Tier";

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      <aside className={cn(
        "w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => window.innerWidth < 1024 && closeSidebar()}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
            <span className="text-xl font-bold tracking-tight text-white">IRONBRIDGEMARKET</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={closeSidebar}>
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

      <nav className="flex-1 px-4 space-y-8 mt-4">
        <div>
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Main Menu
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 1024 && closeSidebar()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            System
          </p>
          <ul className="space-y-1">
            {UTILITY_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && closeSidebar()}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Developer
          </p>
          <ul className="space-y-1">
            {DEVELOPER_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && closeSidebar()}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="glassmorphism p-4 rounded-2xl border border-white/5 bg-white/[0.02] mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center font-bold">
              {isLoading ? "..." : initial}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold truncate">{isLoading ? "Loading..." : name}</div>
              <div className="text-xs text-muted-foreground truncate">{isLoading ? "..." : tier}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" onClick={handleSignOut}>
            <LogOut className="w-3 h-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}
