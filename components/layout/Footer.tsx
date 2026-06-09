import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-12 bg-background">
      {/* Link grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">I</div>
            <span className="text-foreground">Ironbridgemarket</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering institutional investors with next-generation digital asset infrastructure.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-foreground">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/markets" className="hover:text-primary transition-colors">Markets</Link></li>
            <li><Link href="/investment-plans" className="hover:text-primary transition-colors">Investment Plans</Link></li>
            <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-foreground">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-foreground">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Preferences</Link></li>
          </ul>
        </div>
      </div>

      {/* Full-width Regulatory Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-border/20">
        <div className="text-[11px] md:text-xs text-muted-foreground leading-relaxed space-y-4">
          <p>
            <strong>Regulatory Disclosure:</strong> Ironbridgemarket Institutional is a brand name operated by Ironbridgemarket Systems Ltd and its global subsidiaries. Digital assets (including cryptocurrencies, security tokens, and stablecoins) are subject to high volatility and significant risk. The value of digital assets can fluctuate widely, and investors may lose all or a substantial portion of their invested capital. Digital asset trading and custody services are not covered by traditional investor protection schemes, such as the UK Financial Services Compensation Scheme (FSCS) or the US Federal Deposit Insurance Corporation (FDIC).
          </p>
          <p>
            Ironbridgemarket Institutional Ltd is registered with the Financial Conduct Authority (FCA) as a cryptoasset business under the Money Laundering, Terrorist Financing and Transfer of Funds Regulations, reference number XXXXXXX. Access to certain services, trading features, or digital assets may be restricted or prohibited by local regulations in certain jurisdictions. Please consult with your legal, financial, and tax advisors before initiating any transactions on this platform.
          </p>
        </div>
      </div>

      {/* Copyright row */}
      <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ironbridgemarket Institutional. All rights reserved. Built for the future of finance.
      </div>
    </footer>
  );
}
