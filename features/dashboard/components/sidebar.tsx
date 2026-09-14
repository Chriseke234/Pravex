"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui-store";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/shared/logo";
import {
  X,
  LayoutDashboard,
  Wallet,
  History,
  Settings,
  LogOut,
  Shield,
  MessageSquare,
  ChevronRight,
  Landmark,
  Send,
  Calculator,
  CreditCard,
  Gift,
  FileCheck,
  Bell,
  Code2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── Navigation Config ─────────────────────────────────────────── */
const MAIN_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Accounts", icon: Landmark, href: "/dashboard/accounts" },
  { label: "Cash & Treasury", icon: Wallet, href: "/dashboard/wallet" },
  { label: "Transaction Ledger", icon: History, href: "/dashboard/transactions" },
  { label: "Main Website", icon: Globe, href: "/" },
];

const BANKING_ITEMS = [
  { label: "Transfers & Wires", icon: Send, href: "/dashboard/transfers" },
  { label: "Payment Cards", icon: CreditCard, href: "/dashboard/cards" },
  { label: "Credit & Lending", icon: Calculator, href: "/dashboard/loans" },
];

const ACCOUNT_ITEMS = [
  { label: "Documents & KYC", icon: FileCheck, href: "/dashboard/documents" },
  { label: "Referral Program", icon: Gift, href: "/dashboard/referrals" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Support Desk", icon: MessageSquare, href: "/dashboard/support" },
  { label: "Settings & Security", icon: Settings, href: "/dashboard/settings" },
];

const DEVELOPER_ITEMS = [
  { label: "API Keys", icon: Code2, href: "/dashboard/settings/api-keys" },
  { label: "Webhooks", icon: Globe, href: "/dashboard/settings/webhooks" },
];

/* ─── Nav Link ──────────────────────────────────────────────────── */
function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClickMobile,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClickMobile: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClickMobile}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative",
          active
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/15 font-semibold"
            : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4 shrink-0",
            active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
          )}
          strokeWidth={1.8}
        />
        <span className="flex-1 truncate">{label}</span>
        {active && <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />}
      </Link>
    </li>
  );
}

function SectionLabel({ children, accent = false }: { children: string; accent?: boolean }) {
  return (
    <p
      className={cn(
        "px-3 text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5 mt-4",
        accent ? "text-amber-500/70" : "text-slate-500"
      )}
    >
      {children}
    </p>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const mobileClose = () => {
    if (window.innerWidth < 1024) closeSidebar();
  };

  const initial = profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U";
  const name = profile?.full_name || profile?.email || "Unknown User";
  const tier = profile?.tier || "Starter";
  const isAdmin = profile && ["admin", "superuser", "super_admin"].includes(profile.role);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "w-64 h-screen fixed left-0 top-0 flex flex-col z-50",
          "bg-slate-950 border-r border-slate-800/70",
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <Logo size="sm" href="/dashboard" onClick={mobileClose} />
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-slate-400"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar">
          <div>
            <SectionLabel>Core Banking</SectionLabel>
            <ul className="space-y-0.5">
              {MAIN_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClickMobile={mobileClose}
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Services</SectionLabel>
            <ul className="space-y-0.5">
              {BANKING_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClickMobile={mobileClose}
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Account &amp; Support</SectionLabel>
            <ul className="space-y-0.5">
              {ACCOUNT_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClickMobile={mobileClose}
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Developers</SectionLabel>
            <ul className="space-y-0.5">
              {DEVELOPER_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClickMobile={mobileClose}
                />
              ))}
            </ul>
          </div>

          {isAdmin && (
            <div>
              <SectionLabel accent>Administration</SectionLabel>
              <ul className="space-y-0.5">
                <NavLink
                  href="/admin"
                  icon={Shield}
                  label="Super Admin Panel"
                  active={isActive("/admin")}
                  onClickMobile={mobileClose}
                />
              </ul>
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <Badge variant="outline" className="text-[9px] py-0 px-1 border-amber-500/30 text-amber-400">
                  {tier}
                </Badge>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
