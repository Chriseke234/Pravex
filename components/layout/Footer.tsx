import Link from "next/link";
import { Shield, Lock, Award, CheckCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const footerSections = [
  {
    title: "Personal Banking",
    links: [
      { name: "Personal Overview", href: "/personal-banking" },
      { name: "Savings Account", href: "/personal-banking/savings" },
      { name: "Current Account", href: "/personal-banking/current" },
      { name: "Fixed Deposit Account", href: "/personal-banking/fixed-deposit" },
      { name: "Notice Deposit Account", href: "/personal-banking/notice-deposit" },
    ],
  },
  {
    title: "Private Banking",
    links: [
      { name: "Private Overview", href: "/private-banking" },
      { name: "Credit Card Services", href: "/private-banking/credit-cards" },
      { name: "Discretionary Portfolios", href: "/private-banking/discretionary" },
      { name: "Investor Visa Portfolios", href: "/private-banking/investor-visa" },
      { name: "Execution Only Portfolios", href: "/private-banking/execution-only" },
      { name: "Portfolio Secured Lending", href: "/private-banking/portfolio-lending" },
      { name: "Property Loans", href: "/private-banking/property-loans" },
    ],
  },
  {
    title: "Business Banking",
    links: [
      { name: "Business Overview", href: "/business-banking" },
      { name: "Business Current Account", href: "/business-banking/account" },
      { name: "Trade Finance", href: "/business-banking/trade-finance" },
      { name: "Property Loans", href: "/business-banking/property-loans" },
      { name: "Direct Lending", href: "/business-banking/direct-lending" },
      { name: "Notice Deposit Account", href: "/business-banking/notice-deposit" },
    ],
  },
  {
    title: "Loans & Credits",
    links: [
      { name: "Loans Overview", href: "/loans-and-credits" },
      { name: "Mortgage Loans", href: "/loans-and-credits/mortgage" },
      { name: "Property Loans", href: "/loans-and-credits/property" },
      { name: "Loan & Mortgage Calculator", href: "/loans-and-credits/calculator" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700 text-sm">
      {/* Trust Badges Banner */}
      <div className="border-b border-slate-200 bg-slate-100/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6 text-xs font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Institutional Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Segregated Client Vaults</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Multi-Tier Custody Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-600" />
            <span>256-Bit Bank Grade Encryption</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 lg:col-span-1">
          <Logo size="md" variant="light" href="/" />
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Enterprise digital banking &amp; wealth solutions trusted by personal, private, and commercial clients worldwide.
          </p>
          <div className="pt-2 flex items-center gap-3 text-slate-600 text-xs font-medium">
            <Link href="/about" className="hover:text-amber-600 transition-colors">About Us</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-600 transition-colors">Contact</Link>
            <span>•</span>
            <Link href="/faqs" className="hover:text-amber-600 transition-colors">FAQs</Link>
          </div>
        </div>

        {/* Links Columns */}
        {footerSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{section.title}</h3>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-700 hover:text-amber-600 transition-colors block py-0.5 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Disclaimers & Legal */}
      <div className="border-t border-slate-200 bg-slate-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-900 font-semibold">Regulatory &amp; Security Disclosure:</strong> Iron Bridge is a premier digital banking platform providing corporate treasury, private wealth management, and commercial settlement solutions. All digital infrastructure and treasury vaults operate under zero-trust protocols and multi-institution security architectures.
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">Lending &amp; Investment Risk Warning:</strong> Mortgages, loans, and credit facilities are subject to status and affordability assessment. Your home or property may be repossessed if you do not keep up repayments on your mortgage or other debt secured on it. Discretionary portfolio investments and foreign exchange contracts may fluctuate in value; past performance is no guarantee of future returns.
          </p>
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-[11px] font-medium">
            <p>&copy; {new Date().getFullYear()} Iron Bridge Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-amber-600 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-amber-600 transition-colors">Cookie Preferences</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
