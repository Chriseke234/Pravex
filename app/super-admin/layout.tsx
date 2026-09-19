"use client";

import { useState } from "react";
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
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Calculator,
  BarChart3,
  Settings,
  Menu,
  X,
  Building2,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/session-provider";

/* ── Navigation items ───────────────────────────────────────── */
const MENU_ITEMS = [
  { label: "Dashboard",          icon: LayoutDashboard, href: "/super-admin" },
  { label: "User Directory",     icon: Users,           href: "/super-admin/users" },
  { label: "Admin Management",   icon: Building2,       href: "/super-admin/admins" },
  { label: "Deposit Approvals",  icon: ArrowDownLeft,   href: "/super-admin/deposits" },
  { label: "Withdrawal Queue",   icon: ArrowUpRight,    href: "/super-admin/withdrawals" },
  { label: "Transfer Monitor",   icon: Send,            href: "/super-admin/transfers" },
  { label: "Loan Applications",  icon: Calculator,      href: "/super-admin/loans" },
  { label: "Finance Overview",   icon: Coins,           href: "/super-admin/finance" },
  { label: "Reports & Analytics",icon: BarChart3,       href: "/super-admin/reports" },
  { label: "Roles & Permissions",icon: ShieldCheck,     href: "/super-admin/roles" },
  { label: "System Monitoring",  icon: Activity,        href: "/super-admin/monitoring" },
  { label: "Notifications",      icon: Bell,            href: "/super-admin/notifications" },
  { label: "Support Tickets",    icon: Headphones,      href: "/super-admin/support" },
  { label: "System Settings",    icon: Settings,        href: "/super-admin/system" },
  { label: "Audit Logs",         icon: FileText,        href: "/super-admin/audit" },
];

/* ── Sidebar inner content (reused in desktop + mobile) ─────── */
function SidebarContent({
  pathname,
  onClose,
  profile,
  onSignOut,
}: {
  pathname: string;
  onClose?: () => void;
  profile: { full_name?: string | null; email?: string } | null;
  onSignOut: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between gap-3">
        <Link
          href="/super-admin"
          onClick={onClose}
          className="flex items-center gap-2 min-w-0"
        >
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-sm font-extrabold tracking-widest text-white uppercase italic truncate">
            IBB Control Desk
          </span>
        </Link>
        {/* Close button — only in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 mt-1">
          Platform Administration
        </p>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group border border-transparent",
                isActive
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-amber-400" : "text-slate-500 group-hover:text-white"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link href="/dashboard" className="w-full" onClick={onClose}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-xs py-5 rounded-xl border border-white/10 text-slate-300"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Exit to Client Portal
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 py-5 rounded-xl"
          onClick={onSignOut}
        >
          <ShieldAlert className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
}

/* ── Layout ─────────────────────────────────────────────────── */
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#070708] text-white flex">

        {/* ── DESKTOP SIDEBAR (lg+) ──────────────────────────────── */}
        <aside className="hidden lg:flex w-64 border-r border-white/5 bg-black/50 backdrop-blur-2xl flex-col fixed inset-y-0 z-50">
          <SidebarContent
            pathname={pathname}
            profile={profile}
            onSignOut={handleSignOut}
          />
        </aside>

        {/* ── MOBILE DRAWER BACKDROP (< lg) ─────────────────────── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── MOBILE DRAWER (< lg) ──────────────────────────────── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0b] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent
            pathname={pathname}
            onClose={() => setMobileOpen(false)}
            profile={profile}
            onSignOut={handleSignOut}
          />
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">

          {/* ── MOBILE TOP BAR (< lg) ─────────────────────────── */}
          <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#070708]/80 backdrop-blur-md">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center shadow-lg shadow-amber-500/30">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <span className="text-xs font-extrabold tracking-widest text-white uppercase italic">
                IBB Control Desk
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
          </header>

          {/* ── DESKTOP HEADER (lg+) ──────────────────────────── */}
          <header className="hidden lg:flex h-16 border-b border-white/5 bg-black/20 backdrop-blur-md items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Root Banking Authority
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold text-white">
                  {profile?.full_name || profile?.email || "Super Admin"}
                </div>
                <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">
                  Super Administrator
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
