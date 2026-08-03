import Link from "next/link";
import { Shield, Lock, Award, CheckCircle } from "lucide-react";

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
      { name: "Business Account", href: "/business-banking/account" },
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
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      {/* Trust Badges Banner */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>FCA Regulated &amp; Authorized</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>FSCS Protected Up To £85,000</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>ISO/IEC 27001 Security Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span>256-Bit Bank Grade Encryption</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Shield className="w-4.5 h-4.5 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-amber-400 tracking-[0.18em] uppercase leading-none">
                Iron Bridge
              </p>
              <p className="text-base font-bold text-white tracking-tight leading-tight">
                Banking
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise digital banking &amp; wealth solutions trusted by personal, private, and commercial clients worldwide.
          </p>
          <div className="pt-2 flex items-center gap-3 text-slate-500 text-xs">
            <Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
            <span>•</span>
            <Link href="/faqs" className="hover:text-amber-400 transition-colors">FAQs</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
          </div>
        </div>

        {/* Link Columns */}
        {footerSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Regulatory & Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6 border-t border-slate-800/60">
        <div className="text-[11px] text-slate-500 leading-relaxed space-y-3">
          <p>
            <strong className="text-slate-400">Regulatory Disclosure:</strong> Iron Bridge Banking is a trading name of Iron Bridge Financial Group PLC, authorized by the Prudential Regulation Authority (PRA) and regulated by the Financial Conduct Authority (FCA) and Prudential Regulation Authority. Financial Services Register number 847291.
          </p>
          <p>
            Eligible deposits with Iron Bridge Banking are protected up to a total of £85,000 by the Financial Services Compensation Scheme (FSCS), the UK&apos;s deposit guarantee scheme. Any deposits hold above the limit are unlikely to be covered.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Iron Bridge Banking. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/security" className="hover:text-slate-300 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
