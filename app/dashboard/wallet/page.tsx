"use client";

import { useState } from "react";
import { WalletOverview } from "@/features/dashboard/components/wallet-overview";
import { PortfolioChart } from "@/features/dashboard/components/portfolio-chart";
import { AssetList } from "@/features/dashboard/components/asset-list";
import { FiatWallet } from "@/features/dashboard/components/fiat-wallet";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search, ShieldCheck, Coins } from "lucide-react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"crypto" | "fiat">("crypto");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet & Portfolio</h1>
          <p className="text-muted-foreground">Detailed breakdown of your institutional assets and cash funds.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === "crypto" ? (
            <>
              <Button variant="glass" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> Export Statement
              </Button>
              <Button variant="premium" size="sm" onClick={() => setActiveTab("fiat")}>Manage Funding</Button>
            </>
          ) : (
            <Button variant="glass" size="sm" className="gap-2" onClick={() => setActiveTab("crypto")}>
              <Coins className="w-4 h-4" /> View Crypto Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("crypto")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
            activeTab === "crypto" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"
          }`}
        >
          Crypto Custody
        </button>
        <button
          onClick={() => setActiveTab("fiat")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
            activeTab === "fiat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"
          }`}
        >
          Institutional Cash Wallet
        </button>
      </div>

      {activeTab === "crypto" ? (
        <>
          {/* Main Stats */}
          <WalletOverview />

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PortfolioChart />
            </div>
            <div>
              {/* Portfolio Health */}
              <div className="glassmorphism p-6 rounded-3xl border border-white/5 h-full space-y-6">
                <h3 className="text-lg font-bold">Portfolio Health</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score</span>
                      <span className="font-bold text-muted-foreground">N/A</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/10 w-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diversification</span>
                      <span className="font-bold text-muted-foreground">N/A</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white/10 w-0" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Status</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Risk analysis and rebalancing insights require a live market data feed. Connect a price oracle to activate this panel.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" disabled>Rebalance Now</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Assets */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-bold">Holdings</h2>
              <div className="flex gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search holdings..." 
                    className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none"
                  />
                </div>
                <Button variant="glass" size="sm">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
            </div>
            <AssetList />
          </div>
        </>
      ) : (
        <FiatWallet />
      )}
    </div>
  );
}

