"use client";

import { usePortfolio } from "@/hooks/use-portfolio";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreHorizontal, Loader2 } from "lucide-react";
import { AssetIcon } from "@/components/shared/asset-icon";

export function AssetList() {
  const { data: assets, isLoading } = usePortfolio();

  // Mock price and change data for now since we don't have a live price feed yet
  const getMockPrice = (symbol: string) => {
    switch(symbol) {
      case "BTC": return { price: "$64,212.45", change: "+2.4%", up: true, val: 64212.45 };
      case "ETH": return { price: "$3,452.12", change: "-1.2%", up: false, val: 3452.12 };
      case "SOL": return { price: "$145.82", change: "+5.7%", up: true, val: 145.82 };
      case "USDC": return { price: "$1.00", change: "0.0%", up: true, val: 1.00 };
      default: return { price: "$100.00", change: "+1.0%", up: true, val: 100 };
    }
  };

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-bold">Asset Allocation</h3>
        <Button variant="ghost" size="sm">Manage Assets</Button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : assets?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No holdings found in your portfolio.
          </div>
        ) : (
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
              {assets?.map((asset) => {
                const mock = getMockPrice(asset.asset_symbol);
                const value = asset.quantity * mock.val;
                
                return (
                  <tr key={asset.asset_id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AssetIcon symbol={asset.asset_symbol} name={asset.asset_id} size="md" />
                        <div>
                          <div className="font-medium capitalize">{asset.asset_id}</div>
                          <div className="text-xs text-muted-foreground">{asset.asset_symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{asset.quantity.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{asset.asset_symbol}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{mock.price}</div>
                      <div className={`text-xs flex items-center gap-1 ${mock.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {mock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {mock.change}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </GlassCard>
  );
}
