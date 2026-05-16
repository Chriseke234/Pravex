"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ASSETS = [
  { name: "Bitcoin", symbol: "BTC", price: "$64,231.50", change: "+2.4%", volume: "$32.4B", mcap: "$1.2T", up: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,452.12", change: "-1.2%", volume: "$15.2B", mcap: "$415B", up: false },
  { name: "Solana", symbol: "SOL", price: "$145.82", change: "+5.7%", volume: "$4.1B", mcap: "$64B", up: true },
  { name: "Cardano", symbol: "ADA", price: "$0.45", change: "-2.1%", volume: "$340M", mcap: "$16B", up: false },
  { name: "Ripple", symbol: "XRP", price: "$0.62", change: "+1.1%", volume: "$1.2B", mcap: "$34B", up: true },
  { name: "Polkadot", symbol: "DOT", price: "$7.24", change: "+0.8%", volume: "$180M", mcap: "$10B", up: true },
  { name: "Chainlink", symbol: "LINK", price: "$18.45", change: "-0.5%", volume: "$450M", mcap: "$11B", up: false },
  { name: "Avalanche", symbol: "AVAX", price: "$35.20", change: "+3.2%", volume: "$250M", mcap: "$13B", up: true },
  { name: "Polygon", symbol: "MATIC", price: "$0.95", change: "-0.4%", volume: "$210M", mcap: "$8.5B", up: false },
  { name: "Uniswap", symbol: "UNI", price: "$11.30", change: "+1.8%", volume: "$120M", mcap: "$6.8B", up: true },
  { name: "Cosmos", symbol: "ATOM", price: "$8.75", change: "-1.5%", volume: "$95M", mcap: "$3.4B", up: false },
  { name: "Litecoin", symbol: "LTC", price: "$82.10", change: "+0.2%", volume: "$410M", mcap: "$6.1B", up: true },
  { name: "Aptos", symbol: "APT", price: "$9.40", change: "+4.5%", volume: "$180M", mcap: "$4.2B", up: true },
  { name: "Arbitrum", symbol: "ARB", price: "$1.15", change: "-3.1%", volume: "$320M", mcap: "$3.1B", up: false },
  { name: "Optimism", symbol: "OP", price: "$2.85", change: "+2.1%", volume: "$150M", mcap: "$2.9B", up: true },
];

export function AssetTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredAssets = ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "watchlist") {
      // Mock watchlist behavior: just show top 3 for demo
      return matchesSearch && ["BTC", "ETH", "SOL"].includes(asset.symbol);
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="glass" size="sm" className="flex-1 md:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant={activeTab === "all" ? "default" : "glass"} 
            size="sm" 
            className="flex-1 md:flex-none"
            onClick={() => setActiveTab("all")}
          >
            All Assets
          </Button>
          <Button 
            variant={activeTab === "watchlist" ? "default" : "glass"} 
            size="sm" 
            className="flex-1 md:flex-none"
            onClick={() => setActiveTab("watchlist")}
          >
            Watchlist
          </Button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Asset</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Volume</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Market Cap</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{asset.price}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-medium ${asset.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {asset.change}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{asset.volume}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">{asset.mcap}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href="/signup">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Trade
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
