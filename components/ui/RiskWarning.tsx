"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RiskWarning() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage on client mount
    const accepted = localStorage.getItem("ironbridgemarket-risk-warning-accepted");
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ironbridgemarket-risk-warning-accepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      {/* Modal Card container */}
      <div 
        className="max-w-2xl w-full bg-card border border-border p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="risk-disclosure-title"
      >
        {/* Background gradient embellishment */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 blur-3xl rounded-full pointer-events-none" />

        {/* Warning Header */}
        <div className="flex gap-4 items-center border-b border-border/20 pb-4">
          <div className="p-3 bg-gold/10 text-gold rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 id="risk-disclosure-title" className="text-xl font-serif font-bold text-foreground">
              Important Risk Disclosure
            </h2>
            <p className="text-xs text-muted-foreground">Mandatory regulatory compliance acknowledgment</p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
          <p>
            Digital asset investment and trading are subject to extreme market volatility, technical complexities, and regulatory instability. Cryptocurrencies, security tokens, and stablecoins are highly speculative high-risk instruments and lack the regulatory guarantees, capital protections, and deposit insurance schemes (such as the US FDIC or UK FSCS) common in traditional retail and commercial banking products.
          </p>
          <p>
            The risk of total financial loss exists when holding, trading, or collateralizing digital assets. Ironbridgemarket Institutional provides high-performance execution, custody architectures, and order routing platforms on an as-is, zero-trust basis. No content, analysis, or market data provided on this platform constitutes professional financial, legal, tax, or investment advice.
          </p>
          <p>
            By accessing Ironbridgemarket Institutional, you acknowledge and agree that you possess the necessary sophistication, capital resilience, and technical understanding to evaluate these products, and that you assume full responsibility for all transactions, market exposure, and operations executed within your accounts.
          </p>
        </div>

        {/* Acknowledgment Controls */}
        <div className="pt-4 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Regulated MPC-CMP Secure Vault Protocol</span>
          </div>
          <Button
            onClick={handleAccept}
            className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-navy font-bold px-8 py-5 rounded-xl transition-all shadow-lg shadow-gold/10"
          >
            I Understand the Risks — Continue
          </Button>
        </div>

      </div>
    </div>
  );
}
