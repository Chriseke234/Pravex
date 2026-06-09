"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {/* Sun icon (shown in dark mode to switch to light) */}
      <Sun className="w-4 h-4 hidden dark:block" />
      {/* Moon icon (shown in light mode to switch to dark) */}
      <Moon className="w-4 h-4 block dark:hidden" />
    </button>
  );
}

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
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-black">I</div>
            <span className="font-serif">Ironbridgemarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5 text-sm text-muted-foreground font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
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

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background border-b border-border/40 p-4 flex flex-col gap-1 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`text-base font-medium py-3 px-4 rounded-xl transition-colors ${
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/40">
            <Link href="/login" onClick={closeMenu}>
              <Button variant="outline" className="w-full justify-center">Login</Button>
            </Link>
            <Link href="/signup" onClick={closeMenu}>
              <Button variant="premium" className="w-full justify-center">Open Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
