"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { TrendingUp, TrendingDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const ASSETS = [
  { name: "Bitcoin", symbol: "BTC", price: "$64,231.50", change: "+2.4%", volume: "$32.4B", mcap: "$1.2T", up: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,452.12", change: "-1.2%", volume: "$15.2B", mcap: "$415B", up: false },
  { name: "Solana", symbol: "SOL", price: "$145.82", change: "+5.7%", volume: "$4.1B", mcap: "$64B", up: true },
  { name: "Cardano", symbol: "ADA", price: "$0.45", change: "-2.1%", volume: "$340M", mcap: "$16B", up: false },
  { name: "Ripple", symbol: "XRP", price: "$0.62", change: "+1.1%", volume: "$1.2B", mcap: "$34B", up: true },
  { name: "Polkadot", symbol: "DOT", price: "$7.24", change: "+0.8%", volume: "$180M", mcap: "$10B", up: true },
  { name: "Chainlink", symbol: "LINK", price: "$18.45", change: "-0.5%", volume: "$450M", mcap: "$11B", up: false },
];

export function AssetTable() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="glass" size="sm" className="flex-1 md:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="glass" size="sm" className="flex-1 md:flex-none">All Assets</Button>
          <Button variant="glass" size="sm" className="flex-1 md:flex-none">Watchlist</Button>
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
              {ASSETS.map((asset) => (
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
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Trade
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
