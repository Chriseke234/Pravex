"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "Markets", href: "/markets" },
    { name: "Investment Plans", href: "/investment-plans" },
    { name: "Academy", href: "/academy" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">P</div>
            <span>Pavex</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`transition-colors ${pathname === link.href ? 'text-primary' : 'hover:text-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-white/5 p-4 flex flex-col gap-4 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={closeMenu}
                className={`text-lg font-medium py-2 border-b border-white/5 ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/login" onClick={closeMenu}>
              <Button variant="outline" className="w-full justify-center">Login</Button>
            </Link>
            <Link href="/signup" onClick={closeMenu}>
              <Button variant="premium" className="w-full justify-center">Open Account</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
