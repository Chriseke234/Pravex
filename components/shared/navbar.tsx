"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import {
  Menu,
  X,
  Shield,
  ChevronDown,
  LayoutDashboard,
  Globe,
  ArrowRight,
  PhoneCall,
  Lock,
  Landmark,
  PiggyBank,
  Wallet,
  CreditCard,
  Briefcase,
  Compass,
  LineChart,
  Coins,
  Building2,
  Building,
  Banknote,
  Home,
  Calculator,
  FileText,
  ShieldCheck,
  CalendarCheck,
  Gem,
  HelpCircle,
  Info,
  Mail,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ─── Nav Structure ──────────────────────────────────────── */
const MEGA_MENUS = [
  {
    title: "Personal Banking",
    href: "/personal-banking",
    badge: "Everyday",
    icon: Landmark,
    items: [
      { name: "Overview", href: "/personal-banking", desc: "Everyday personal accounts & banking", icon: Landmark },
      { name: "Savings Account", href: "/personal-banking/savings", desc: "High-yield savings with flexible access", icon: PiggyBank },
      { name: "Current Account", href: "/personal-banking/current", desc: "Seamless daily transaction banking", icon: Wallet },
      { name: "Fixed Deposit Account", href: "/personal-banking/fixed-deposit", desc: "Guaranteed interest over set terms", icon: Lock },
      { name: "Notice Deposit Account", href: "/personal-banking/notice-deposit", desc: "Higher interest with notice period", icon: CalendarCheck },
    ],
  },
  {
    title: "Private Banking",
    href: "/private-banking",
    badge: "Bespoke",
    icon: Gem,
    items: [
      { name: "Overview", href: "/private-banking", desc: "Bespoke wealth management for HNW individuals", icon: Gem },
      { name: "Credit Card Services", href: "/private-banking/credit-cards", desc: "Exclusive luxury credit cards with high limits", icon: CreditCard },
      { name: "Discretionary Portfolios", href: "/private-banking/discretionary", desc: "Tailored investment management solutions", icon: Briefcase },
      { name: "Investor Visa Portfolios", href: "/private-banking/investor-visa", desc: "Residency & citizenship qualifying investments", icon: Compass },
      { name: "Execution Only Portfolios", href: "/private-banking/execution-only", desc: "Self-directed trading for sophisticated investors", icon: LineChart },
      { name: "Portfolio Secured Lending", href: "/private-banking/portfolio-lending", desc: "Liquidity secured against investment assets", icon: Coins },
      { name: "Property Loans", href: "/private-banking/property-loans", desc: "High-value luxury real estate financing", icon: Building2 },
      { name: "Notice Deposit Account", href: "/private-banking/notice-deposit", desc: "Premium yield deposit accounts", icon: ShieldCheck },
    ],
  },
  {
    title: "Business Banking",
    href: "/business-banking",
    badge: "Corporate",
    icon: Building2,
    items: [
      { name: "Overview", href: "/business-banking", desc: "Scalable commercial & SME financial services", icon: Building2 },
      { name: "Business Account", href: "/business-banking/account", desc: "Multi-currency corporate accounts", icon: Briefcase },
      { name: "Trade Finance", href: "/business-banking/trade-finance", desc: "Letters of credit & global trade support", icon: Globe },
      { name: "Property Loans", href: "/business-banking/property-loans", desc: "Commercial property & development finance", icon: Building },
      { name: "Direct Lending", href: "/business-banking/direct-lending", desc: "Custom corporate debt & loan facilities", icon: Banknote },
      { name: "Notice Deposit Account", href: "/business-banking/notice-deposit", desc: "Corporate treasury cash management", icon: Landmark },
    ],
  },
  {
    title: "Loans & Credits",
    href: "/loans-and-credits",
    badge: "Financing",
    icon: Calculator,
    items: [
      { name: "Overview", href: "/loans-and-credits", desc: "Competitive credit products & mortgages", icon: FileText },
      { name: "Mortgage Loans", href: "/loans-and-credits/mortgage", desc: "Residential & buy-to-let mortgages", icon: Home },
      { name: "Property Loans", href: "/loans-and-credits/property", desc: "Bridging & development loans", icon: Building2 },
      { name: "Loan & Mortgage Calculator", href: "/loans-and-credits/calculator", desc: "Interactive monthly payment calculator", icon: Calculator },
    ],
  },
];

/* ─── Main Navbar ───────────────────────────────────────── */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  // Lock body scroll and handle ESC key when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  };

  const toggleMobileCategory = (title: string) => {
    setExpandedMobileMenu((prev) => (prev === title ? null : title));
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0A1628]/95 backdrop-blur-md border-b border-[#17293F] shadow-xl shadow-[#080F1A]/40"
            : "bg-[#080F1A]/90 backdrop-blur-sm border-b border-[#17293F]"
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + Desktop Mega Nav */}
          <div className="flex items-center gap-6">
            <Logo size="md" variant="dark" href="/" onClick={closeMenu} />

            {/* Desktop Dropdown Menus */}
            <div className="hidden lg:flex items-center gap-1">
              {MEGA_MENUS.map((menu) => (
                <div
                  key={menu.title}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(menu.title)}
                >
                  <Link
                    href={menu.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1",
                      pathname?.startsWith(menu.href)
                        ? "text-amber-400 bg-amber-500/10 font-semibold"
                        : "text-slate-300 hover:text-amber-400 hover:bg-[#122140]"
                    )}
                  >
                    {menu.title}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-slate-400", activeMenu === menu.title && "rotate-180 text-amber-400")} />
                  </Link>

                  {/* Dropdown Card */}
                  {activeMenu === menu.title && (
                    <div className="absolute top-full left-0 w-80 mt-1 bg-[#0C1A2E] border border-[#17293F] rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
                      <div className="space-y-1">
                        {menu.items.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={closeMenu}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#122140] transition-colors group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                                  {sub.name}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/about"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/about" ? "text-amber-400 bg-amber-500/10 font-semibold" : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                )}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/contact" ? "text-amber-400 bg-amber-500/10 font-semibold" : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                )}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20">
                    Open Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Header Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:text-white hover:border-amber-500/50 transition-colors focus:outline-none active:scale-95"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Dedicated Portal-Based Luxury Mobile Menu Overlay ─── */}
      {mounted && isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex flex-col justify-between bg-slate-950 text-white animate-fade-in overflow-hidden h-screen h-[100dvh]">
          {/* Mobile Menu Top Header Bar */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/95 shrink-0">
            <Logo size="md" variant="dark" href="/" onClick={closeMenu} />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close mobile menu"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:text-white hover:border-amber-500/50 transition-colors focus:outline-none active:scale-95"
            >
              <X className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-5 space-y-6">
            
            {/* User Account / Auth Top Card */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-amber-500/20">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{userName}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={closeMenu} className="block w-full">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2 py-2.5 rounded-xl shadow-md shadow-amber-500/20">
                      <LayoutDashboard className="w-4 h-4" /> Enter Dashboard <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Client Access Portal</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={closeMenu}>
                      <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2.5 rounded-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu}>
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2.5 rounded-xl shadow-md shadow-amber-500/20">
                        Open Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Categorized Products Accordion List */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
                Banking Solutions
              </p>

              {MEGA_MENUS.map((menu) => {
                const isExpanded = expandedMobileMenu === menu.title;
                const CategoryIcon = menu.icon;
                const isActiveCategory = pathname?.startsWith(menu.href);

                return (
                  <div
                    key={menu.title}
                    className={cn(
                      "rounded-2xl border transition-all duration-200 overflow-hidden",
                      isExpanded
                        ? "bg-slate-900/90 border-amber-500/40 shadow-lg"
                        : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                    )}
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleMobileCategory(menu.title)}
                      className="w-full flex items-center justify-between p-3.5 text-left focus:outline-none group active:bg-slate-800/40"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                            isExpanded || isActiveCategory
                              ? "bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30"
                              : "bg-slate-800 text-slate-400 group-hover:text-white"
                          )}
                        >
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={cn(
                            "text-sm font-bold transition-colors block leading-tight",
                            isExpanded || isActiveCategory ? "text-amber-400" : "text-white"
                          )}>
                            {menu.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {menu.items.length} accounts &amp; services
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                          {menu.badge}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-slate-500 transition-transform duration-200",
                            isExpanded && "rotate-180 text-amber-400"
                          )}
                        />
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-1 border-t border-slate-800/80 bg-slate-950/60">
                        {menu.items.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={closeMenu}
                              className={cn(
                                "flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-colors group active:bg-slate-800",
                                isSubActive
                                  ? "bg-amber-500/10 text-amber-400 font-semibold"
                                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                              )}
                            >
                              <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-amber-400 shrink-0">
                                <SubIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white group-hover:text-amber-400 truncate">
                                  {sub.name}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {sub.desc}
                                </div>
                              </div>
                              <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Company & Support Links */}
            <div className="space-y-1 pt-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1 mb-2">
                Company &amp; Resources
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <Info className="w-4 h-4 text-amber-400" /> About Us
                </Link>
                <Link
                  href="/faqs"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" /> FAQs
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" /> Support Desk
                </Link>
                <Link
                  href="/loans-and-credits/calculator"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-amber-400" /> Calculator
                </Link>
              </div>
            </div>

            {/* Direct Support Helpline Callout */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Private Concierge</p>
                  <p className="text-[11px] text-slate-400">24/7 Priority Member Desk</p>
                </div>
              </div>
              <Link href="/contact" onClick={closeMenu}>
                <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-amber-400 hover:text-white hover:bg-amber-500/20">
                  Call Desk
                </Button>
              </Link>
            </div>

          </div>

          {/* Bottom Sticky Footer with Regulatory Badge */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950 shrink-0 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-400">FDIC Insured • 256-bit SSL</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v2.4.0</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
