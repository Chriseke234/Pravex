"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, BarChart3, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full text-center space-y-8">
        {/* Large 404 header */}
        <div className="space-y-2">
          <div className="text-sm font-bold tracking-widest text-gold uppercase">Error 404</div>
          <h1 className="text-6xl font-serif font-bold text-foreground">Lost Asset</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          The page you are looking for cannot be found. It may have been moved, deleted, or you might have entered an incorrect URL.
        </p>

        {/* Navigation Quick Links */}
        <div className="bg-card/30 border border-border/20 rounded-2xl p-4 divide-y divide-border/20 text-left">
          <Link href="/" className="flex items-center justify-between py-3 hover:text-primary transition-colors">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-gold" />
              <span className="font-semibold text-sm">Return Home</span>
            </div>
            <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
          </Link>
          <Link href="/markets" className="flex items-center justify-between py-3 hover:text-primary transition-colors">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gold" />
              <span className="font-semibold text-sm">Live Markets</span>
            </div>
            <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
          </Link>
          <Link href="/contact" className="flex items-center justify-between py-3 hover:text-primary transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gold" />
              <span className="font-semibold text-sm">Contact Support</span>
            </div>
            <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
          </Link>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-navy font-bold px-8 py-6 rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Back to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
