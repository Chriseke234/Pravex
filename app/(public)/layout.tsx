import { Navbar } from "@/components/shared/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">P</div>
              <span>Pavex</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering institutional investors with next-generation digital asset infrastructure.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/markets" className="hover:text-primary">Markets</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-12 mt-12 border-t border-white/5 text-center text-sm text-muted-foreground">
          © 2026 Pavex Institutional. Built for the future of finance.
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
