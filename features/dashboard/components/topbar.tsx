"use client";

import { Menu, Bell, Search, Command, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { useWallet } from "@/hooks/use-wallet";
import { useProfile } from "@/hooks/use-profile";
import { useNotifications } from "@/hooks/use-notifications";
import { formatCurrency } from "@/lib/utils/formatters";
import Link from "next/link";

export function Topbar() {
  const { openSidebar } = useUiStore();
  const { wallet, isLoading: isLoadingWallet } = useWallet();
  const { profile } = useProfile();
  const { notifications } = useNotifications();

  const balance = wallet?.balance || 0;
  const initial = profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U";
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/70 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-40">
      {/* Left: Mobile Hamburger + Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-500/40 transition-colors focus:outline-none"
          onClick={openSidebar}
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search transactions, payees, accounts..."
            aria-label="Search"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>

        {/* Mobile Compact Balance Badge */}
        <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Bal:</span>
          <span className="text-xs font-bold text-amber-400">
            {isLoadingWallet ? "…" : formatCurrency(balance)}
          </span>
        </div>
      </div>

      {/* Right: Public Site Link + Balance + Notifications + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/" title="Return to Public Website">
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-900 rounded-xl px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Site</span>
          </Button>
        </Link>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Wallet Balance
          </span>
          <span className="text-sm font-bold text-amber-400">
            {isLoadingWallet ? "—" : formatCurrency(balance)}
          </span>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden md:block mx-1" />

        <Link href="/dashboard/notifications" aria-label="Notifications">
          <div
            className="relative w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-slate-950 animate-pulse" />
            )}
          </div>
        </Link>

        <Link href="/dashboard/settings" aria-label="Profile settings">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow cursor-pointer">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}
