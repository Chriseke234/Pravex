"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Shield, ChevronDown, LayoutDashboard, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ─── Iron Bridge Banking Logo ─────────────────────────── */
function IBBLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 group", className)}>
      <div className="relative w-9 h-9 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-4.5 h-4.5 text-slate-950" strokeWidth={2.5} />
        </div>
      </div>
      <div className="leading-none">
        <p className="text-[11px] font-semibold text-amber-400 tracking-[0.18em] uppercase">
          Iron Bridge
        </p>
        <p className="text-base font-bold text-white tracking-tight">
          Banking
        </p>
      </div>
    </div>
  );
}

/* ─── Theme Toggle ──────────────────────────────────────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 hidden dark:block" />
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}

/* ─── Nav Structure ──────────────────────────────────────── */
const MEGA_MENUS = [
  {
    title: "Personal Banking",
    href: "/personal-banking",
    items: [
      { name: "Overview", href: "/personal-banking", desc: "Everyday personal accounts & banking" },
      { name: "Savings Account", href: "/personal-banking/savings", desc: "High-yield savings with flexible access" },
      { name: "Current Account", href: "/personal-banking/current", desc: "Seamless daily transaction banking" },
      { name: "Fixed Deposit Account", href: "/personal-banking/fixed-deposit", desc: "Guaranteed interest over set terms" },
      { name: "Notice Deposit Account", href: "/personal-banking/notice-deposit", desc: "Higher interest with notice period" },
    ],
  },
  {
    title: "Private Banking",
    href: "/private-banking",
    items: [
      { name: "Overview", href: "/private-banking", desc: "Bespoke wealth management for HNW individuals" },
      { name: "Credit Card Services", href: "/private-banking/credit-cards", desc: "Exclusive luxury credit cards with high limits" },
      { name: "Discretionary Portfolios", href: "/private-banking/discretionary", desc: "Tailored investment management solutions" },
      { name: "Investor Visa Portfolios", href: "/private-banking/investor-visa", desc: "Residency & citizenship qualifying investments" },
      { name: "Execution Only Portfolios", href: "/private-banking/execution-only", desc: "Self-directed trading for sophisticated investors" },
      { name: "Portfolio Secured Lending", href: "/private-banking/portfolio-lending", desc: "Liquidity secured against investment assets" },
      { name: "Property Loans", href: "/private-banking/property-loans", desc: "High-value luxury real estate financing" },
      { name: "Notice Deposit Account", href: "/private-banking/notice-deposit", desc: "Premium yield deposit accounts" },
    ],
  },
  {
    title: "Business Banking",
    href: "/business-banking",
    items: [
      { name: "Overview", href: "/business-banking", desc: "Scalable commercial & SME financial services" },
      { name: "Business Account", href: "/business-banking/account", desc: "Multi-currency corporate accounts" },
      { name: "Trade Finance", href: "/business-banking/trade-finance", desc: "Letters of credit & global trade support" },
      { name: "Property Loans", href: "/business-banking/property-loans", desc: "Commercial property & development finance" },
      { name: "Direct Lending", href: "/business-banking/direct-lending", desc: "Custom corporate debt & loan facilities" },
      { name: "Notice Deposit Account", href: "/business-banking/notice-deposit", desc: "Corporate treasury cash management" },
    ],
  },
  {
    title: "Loans & Credits",
    href: "/loans-and-credits",
    items: [
      { name: "Overview", href: "/loans-and-credits", desc: "Competitive credit products & mortgages" },
      { name: "Mortgage Loans", href: "/loans-and-credits/mortgage", desc: "Residential & buy-to-let mortgages" },
      { name: "Property Loans", href: "/loans-and-credits/property", desc: "Bridging & development loans" },
      { name: "Loan & Mortgage Calculator", href: "/loans-and-credits/calculator", desc: "Interactive monthly payment calculator" },
    ],
  },
];

/* ─── Main Navbar ───────────────────────────────────────── */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-slate-950/40"
          : "bg-slate-950/80 backdrop-blur-sm border-b border-slate-900"
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Mega Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" onClick={closeMenu} aria-label="Iron Bridge Banking Home">
            <IBBLogo />
          </Link>

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
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  )}
                >
                  {menu.title}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 text-slate-500", activeMenu === menu.title && "rotate-180 text-amber-400")} />
                </Link>

                {/* Dropdown Card */}
                {activeMenu === menu.title && (
                  <div className="absolute top-full left-0 w-80 mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
                    <div className="space-y-1">
                      {menu.items.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={closeMenu}
                          className="block p-2.5 rounded-xl hover:bg-slate-900 transition-colors group"
                        >
                          <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                            {sub.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {sub.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/about"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === "/about" ? "text-amber-400 bg-amber-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              )}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === "/contact" ? "text-amber-400 bg-amber-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              )}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right: Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950">
                  Open Account
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl">
          {MEGA_MENUS.map((menu) => (
            <div key={menu.title} className="space-y-1">
              <Link
                href={menu.href}
                onClick={closeMenu}
                className="text-xs font-bold text-amber-400 uppercase tracking-wider block py-1"
              >
                {menu.title}
              </Link>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l border-slate-800">
                {menu.items.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    onClick={closeMenu}
                    className="py-2 px-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link href="/about" onClick={closeMenu} className="text-sm font-medium text-slate-300 py-1">
              About Us
            </Link>
            <Link href="/faqs" onClick={closeMenu} className="text-sm font-medium text-slate-300 py-1">
              FAQs
            </Link>
            <Link href="/contact" onClick={closeMenu} className="text-sm font-medium text-slate-300 py-1">
              Contact
            </Link>
            <div className="flex gap-2 pt-2">
              {user ? (
                <Link href="/dashboard" onClick={closeMenu} className="w-full">
                  <Button className="w-full bg-amber-500 text-slate-950 font-bold gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu} className="flex-1">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu} className="flex-1">
                    <Button className="w-full bg-amber-500 text-slate-950">Open Account</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
