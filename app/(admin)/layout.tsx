"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Activity, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    section: "Platform Control",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "User Management", icon: Users },
      { href: "/admin/transactions", label: "Audit & Logs", icon: Activity },
    ],
  },
  {
    section: "Risk & Compliance",
    items: [
      { href: "/admin/compliance", label: "KYC Verifications", icon: ShieldCheck },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <Logo size="sm" href="/admin" />
        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navLinks.map((group) => (
          <div key={group.section} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {group.section}
            </p>
            {group.items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Exit */}
      <div className="p-4 border-t border-white/5">
        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white gap-2">
            <LogOut className="w-4 h-4" />
            Exit to App
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex">

      {/* ── DESKTOP SIDEBAR (lg+) ─────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY (< lg) ─────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER (< lg) ─────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-black/95 border-r border-white/5 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size="sm" href="/admin" />
          <span className="ml-auto text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </header>

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
