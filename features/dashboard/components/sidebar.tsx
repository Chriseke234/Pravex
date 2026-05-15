"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
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

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-50">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PAVEX</span>
        </Link>
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
              JD
            </div>
            <div>
              <div className="text-sm font-bold">John Doe</div>
              <div className="text-xs text-muted-foreground">Institutional Tier</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs">
            <LogOut className="w-3 h-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
