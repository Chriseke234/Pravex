import { MarketTicker } from "@/features/markets/components/market-ticker";
import { AssetTable } from "@/features/markets/components/asset-table";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Globe, ShieldCheck } from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="min-h-screen pt-20">
      <MarketTicker />
      
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Hero section for Markets */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gradient">
            Institutional Market Overview
          </h1>
          <p className="text-xl text-muted-foreground">
            Access real-time data across global digital assets, equities, and commodities with institutional-grade precision.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Global Reach</span>
            </div>
            <div className="text-2xl font-bold">150+ Assets</div>
            <p className="text-sm text-muted-foreground">Spanning 25+ global exchanges and liquidity providers.</p>
          </div>
          
          <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Market Health</span>
            </div>
            <div className="text-2xl font-bold">+2.45%</div>
            <p className="text-sm text-muted-foreground">Average market growth across major indices in 24h.</p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-blue-500">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Verified Data</span>
            </div>
            <div className="text-2xl font-bold">100% Validated</div>
            <p className="text-sm text-muted-foreground">All data points are cross-verified with multiple sources.</p>
          </div>
        </section>

        {/* Main Table Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">Market Assets</h2>
              <p className="text-muted-foreground">Live pricing and performance metrics.</p>
            </div>
            <Button variant="link" className="text-primary gap-2">
              Learn about our methodology <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <AssetTable />
        </section>
      </main>
    </div>
  );
}
