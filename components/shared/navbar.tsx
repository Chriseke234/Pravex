import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">P</div>
            <span>Pavex</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <Link href="/markets" className="hover:text-foreground transition-colors">Markets</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/academy" className="hover:text-foreground transition-colors">Academy</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            EN
          </Button>
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="premium" size="sm">Open Account</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
