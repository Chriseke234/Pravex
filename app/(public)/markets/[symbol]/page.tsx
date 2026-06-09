"use client";

import { useMarketData } from "@/hooks/useMarketData";
import { TradingViewWidget } from "@/components/charts/TradingViewWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AssetIcon } from "@/components/shared/asset-icon";

export default function AssetDetailPage() {
  const params = useParams();
  const rawSymbol = params.symbol as string;
  const { data: assets, loading } = useMarketData();

  const asset = assets.find(a => a.id === rawSymbol || a.symbol.toLowerCase() === rawSymbol.toLowerCase());

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '-';
    if (val >= 1000) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(val);
  };

  const formatCompact = (val?: number) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short", style: 'currency', currency: 'USD' }).format(val);
  };

  const isPositive = asset && asset.changePercent24h >= 0;

  if (loading && !asset) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!asset && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-4">Asset Not Found</h1>
        <Link href="/markets">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </Button>
        </Link>
      </div>
    );
  }

  if (!asset) return null; // Fallback during loading

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background">
      <main className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Breadcrumb & Header */}
        <div>
          <Link href="/markets" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-6 text-sm font-medium transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <AssetIcon src={asset.logo} symbol={asset.symbol} name={asset.name} size="xl" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-3">
                  {asset.name} 
                  <span className="text-muted-foreground text-2xl">{asset.symbol}</span>
                </h1>
                <div className="text-3xl md:text-4xl font-bold text-foreground mt-2 flex items-center gap-4">
                  {formatCurrency(asset.price)}
                  <div className={`text-xl flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    {Math.abs(asset.changePercent24h || 0).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link href="/signup">
                <button className="bg-gold hover:bg-gold-hover text-navy font-bold py-3 px-8 rounded-xl shadow-lg shadow-gold/20 transition-all hover:scale-105">
                  Start Trading
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full">
          <TradingViewWidget symbol={asset.id} height={500} theme="dark" />
        </div>

        {/* Key Statistics Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/[0.02] border border-border/30 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                Market Cap <Info className="w-3 h-3" />
              </div>
              <div className="text-2xl font-bold text-foreground">{formatCompact(asset.marketCap)}</div>
            </div>
            <div className="bg-card/[0.02] border border-border/30 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                Volume (24h) <Info className="w-3 h-3" />
              </div>
              <div className="text-2xl font-bold text-foreground">{formatCompact(asset.volume24h)}</div>
            </div>
            <div className="bg-card/[0.02] border border-border/30 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-2">Asset Class</div>
              <div className="text-xl font-bold text-foreground uppercase">{asset.type}</div>
            </div>
            <div className="bg-card/[0.02] border border-border/30 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-2">24h Price Change</div>
              <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {asset.change24h > 0 ? '+' : ''}{formatCurrency(asset.change24h)}
              </div>
            </div>
          </div>
        </div>

        {/* About / Description (Mock text) */}
        <div className="bg-card/[0.02] border border-border/30 p-8 rounded-3xl mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">About {asset.name}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            {asset.name} ({asset.symbol}) is currently trading at {formatCurrency(asset.price)} with a 24-hour trading volume of {formatCompact(asset.volume24h)}. 
            Institutional investors utilize Ironbridgemarket to gain exposure to {asset.name} via regulated custodial accounts with microsecond execution latency and deep aggregated liquidity.
          </p>
        </div>

      </main>
    </div>
  );
}
