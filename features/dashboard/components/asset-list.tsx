"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

const USER_ASSETS = [
  { name: "Bitcoin", symbol: "BTC", amount: "4.52", value: "$290,240.12", price: "$64,212.45", change: "+2.4%", up: true },
  { name: "Ethereum", symbol: "ETH", amount: "82.40", value: "$284,450.24", price: "$3,452.12", change: "-1.2%", up: false },
  { name: "Solana", symbol: "SOL", amount: "1,240.00", value: "$180,816.80", price: "$145.82", change: "+5.7%", up: true },
  { name: "USD Coin", symbol: "USDC", amount: "125,000.00", value: "$125,000.00", price: "$1.00", change: "0.0%", up: true },
  { name: "Apple Inc.", symbol: "AAPL", amount: "520.00", value: "$98,514.00", price: "$189.45", change: "+0.8%", up: true },
];

export function AssetList() {
  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-bold">Asset Allocation</h3>
        <Button variant="ghost" size="sm">Manage Assets</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allocation</th>
              <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {USER_ASSETS.map((asset) => (
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
                <td className="px-6 py-4">
                  <div className="font-medium">{asset.amount}</div>
                  <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                </td>
                <td className="px-6 py-4 font-bold">{asset.value}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{asset.price}</div>
                  <div className={`text-xs flex items-center gap-1 ${asset.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {asset.change}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.random() * 40 + 10}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
