"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage on client mount
    const consent = localStorage.getItem("ironbridgemarket-cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (level: "all" | "rejected" | "managed") => {
    localStorage.setItem("ironbridgemarket-cookie-consent", level);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-5xl mx-auto bg-background/80 backdrop-blur-md border border-border/40 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 pointer-events-auto">
        
        {/* Banner Text info */}
        <div className="flex gap-3 items-start md:items-center max-w-2xl">
          <div className="p-2.5 bg-gold/10 text-gold rounded-xl shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">Cookie Consent Policy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies to personalize content, analyze traffic, and ensure institutional-grade platform functionality. Review our{" "}
              <Link href="/privacy" className="text-gold underline hover:text-gold-hover transition-colors">
                Privacy Policy
              </Link>{" "}
              or{" "}
              <Link href="/terms" className="text-gold underline hover:text-gold-hover transition-colors">
                Terms of Service
              </Link>{" "}
              for more details.
            </p>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={() => handleConsent("managed")}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-card/50"
            size="sm"
          >
            Manage Preferences
          </Button>
          <Button
            variant="outline"
            onClick={() => handleConsent("rejected")}
            className="text-xs font-semibold border-border hover:bg-card"
            size="sm"
          >
            Reject Non-Essential
          </Button>
          <Button
            onClick={() => handleConsent("all")}
            className="text-xs font-semibold bg-gold hover:bg-gold-hover text-navy font-bold"
            size="sm"
          >
            Accept All
          </Button>
          <button
            onClick={() => handleConsent("rejected")}
            className="text-muted-foreground hover:text-foreground p-1 ml-1 hidden md:block"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
