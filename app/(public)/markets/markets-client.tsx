"use client";

import { useState, useEffect, useMemo } from "react";
import { useMarketData } from "@/hooks/useMarketData";
import { Asset } from "@/app/api/markets/route";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, Star, TrendingUp, ChevronLeft, ChevronRight, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { AssetIcon } from "@/components/shared/asset-icon";

// Sparkline Component using raw SVG
function Sparkline({ data, colorClass }: { data: number[], colorClass: string }) {
  if (!data || data.length === 0) return <div className="w-24 h-8 bg-white/5 rounded" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 30 - ((val - min) / range) * 30;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className={`w-24 h-8 ${colorClass}`} viewBox="0 -2 100 34" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Skeleton rows shown while data is loading
function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-border/20">
          {/* Watchlist star */}
          <td className="py-4 px-4 hidden md:table-cell">
            <Skeleton variant="circle" width={20} height={20} />
          </td>
          {/* Asset name */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" width={32} height={32} />
              <div className="space-y-1.5">
                <Skeleton variant="text" width={100} height={14} />
                <Skeleton variant="text" width={50} height={10} />
              </div>
            </div>
          </td>
          {/* Price */}
          <td className="py-4 px-4 text-right">
            <Skeleton variant="text" width={80} height={14} className="ml-auto" />
          </td>
          {/* 24h % */}
          <td className="py-4 px-4 text-right">
            <Skeleton variant="text" width={60} height={14} className="ml-auto" />
          </td>
          {/* Volume — hidden on mobile */}
          <td className="py-4 px-4 text-right hidden md:table-cell">
            <Skeleton variant="text" width={80} height={14} className="ml-auto" />
          </td>
          {/* Market Cap — hidden on mobile */}
          <td className="py-4 px-4 text-right hidden md:table-cell">
            <Skeleton variant="text" width={80} height={14} className="ml-auto" />
          </td>
          {/* 7-day chart — hidden on mobile */}
          <td className="py-4 px-4 hidden md:table-cell">
            <Skeleton variant="rect" width={96} height={32} />
          </td>
          {/* Action */}
          <td className="py-4 px-4 text-right">
            <Skeleton variant="rect" width={64} height={28} className="ml-auto rounded-lg" />
          </td>
        </tr>
      ))}
    </>
  );
}

// Stat card skeletons
function StatSkeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/[0.02] border border-border/20 p-6 rounded-2xl space-y-2">
          <Skeleton variant="text" width={120} height={12} />
          <Skeleton variant="text" width={160} height={32} />
        </div>
      ))}
    </>
  );
}

export function MarketsClient() {
  const { data: assets, loading, error, priceDirections } = useMarketData();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"All" | "Crypto" | "Equities" | "Forex" | "Commodities" | "Watchlist">("All");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Asset | null, direction: "asc" | "desc" }>({ key: "marketCap", direction: "desc" });
  const [page, setPage] = useState(1);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const saved = localStorage.getItem("pavex_watchlist");
    if (saved) {
      try { setWatchlist(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newWatchlist = watchlist.includes(id)
      ? watchlist.filter((x) => x !== id)
      : [...watchlist, id];
    setWatchlist(newWatchlist);
    localStorage.setItem("pavex_watchlist", JSON.stringify(newWatchlist));
  };

  const stats = useMemo(() => {
    let totalCap = 0, totalVol = 0, btcCap = 0, totalCryptoCap = 0;
    assets.forEach((a) => {
      totalCap += a.marketCap || 0;
      totalVol += a.volume24h || 0;
      if (a.type === "crypto") {
        totalCryptoCap += a.marketCap || 0;
        if (a.symbol === "BTC") btcCap = a.marketCap || 0;
      }
    });
    const btcDom = totalCryptoCap > 0 ? ((btcCap / totalCryptoCap) * 100).toFixed(1) : "0.0";
    return {
      cap: totalCap > 0 ? `$${(totalCap / 1e12).toFixed(2)}T` : "-",
      vol: totalVol > 0 ? `$${(totalVol / 1e9).toFixed(2)}B` : "-",
      btcDom: `${btcDom}%`,
    };
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let result = [...assets];
    if (tab === "Watchlist") {
      result = result.filter((a) => watchlist.includes(a.id));
    } else if (tab !== "All") {
      result = result.filter((a) => a.type.toLowerCase() === tab.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [assets, tab, search, sortConfig, watchlist]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filteredAssets.length, totalPages, page]);

  const currentAssets = filteredAssets.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key: keyof Asset) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return "-";
    if (val >= 1000) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(val);
  };

  const formatCompact = (val: number) => {
    if (val === undefined || val === null) return "-";
    return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short", style: "currency", currency: "USD" }).format(val);
  };

  const formatPercent = (val: number) => {
    if (val === undefined || val === null) return "-";
    return `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <main className="max-w-7xl mx-auto px-4 space-y-8">

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Live Markets</h1>
          <p className="text-xl text-muted-foreground">Real-time institutional pricing, analytics, and charting.</p>
        </div>

        {/* HEADER STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && assets.length === 0 ? (
            <StatSkeletons />
          ) : (
            <>
              <div className="bg-white/[0.02] border border-border/20 p-6 rounded-2xl">
                <div className="text-sm text-muted-foreground mb-1">Total Market Cap</div>
                <div className="text-3xl font-bold">{stats.cap}</div>
              </div>
              <div className="bg-white/[0.02] border border-border/20 p-6 rounded-2xl">
                <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
                <div className="text-3xl font-bold">{stats.vol}</div>
              </div>
              <div className="bg-white/[0.02] border border-border/20 p-6 rounded-2xl">
                <div className="text-sm text-muted-foreground mb-1">BTC Dominance</div>
                <div className="text-3xl font-bold text-gold">{stats.btcDom}</div>
              </div>
            </>
          )}
        </div>

        {/* FILTER/SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02] border border-border/20 p-4 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {(["All", "Crypto", "Equities", "Forex", "Commodities", "Watchlist"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  tab === t
                    ? "bg-gold text-navy"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {t === "Watchlist" && <Star className="inline w-4 h-4 mr-1.5 -mt-0.5" />}
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-accent/50 border border-border/40 rounded-xl py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* ASSET TABLE */}
        <div className="bg-white/[0.02] border border-border/20 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/20 text-muted-foreground text-sm">
                {/* Star — hidden on mobile */}
                <th className="py-4 px-4 w-12 hidden md:table-cell" />
                {/* Asset name — always visible */}
                <th
                  className="py-4 px-4 font-medium cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("marketCap")}
                >
                  Asset{sortConfig.key === "marketCap" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                {/* Price — always visible */}
                <th
                  className="py-4 px-4 font-medium text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("price")}
                >
                  Price{sortConfig.key === "price" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                {/* 24h % — always visible */}
                <th
                  className="py-4 px-4 font-medium text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("changePercent24h")}
                >
                  24h %{sortConfig.key === "changePercent24h" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                {/* Volume — hidden on mobile */}
                <th
                  className="py-4 px-4 font-medium text-right cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => handleSort("volume24h")}
                >
                  Volume{sortConfig.key === "volume24h" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                {/* Market Cap — hidden on mobile */}
                <th
                  className="py-4 px-4 font-medium text-right cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => handleSort("marketCap")}
                >
                  Mkt Cap{sortConfig.key === "marketCap" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                {/* 7 Day Chart — hidden on mobile */}
                <th className="py-4 px-4 font-medium text-center hidden md:table-cell">7 Day</th>
                {/* Action — always visible */}
                <th className="py-4 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading && assets.length === 0 ? (
                <TableSkeletonRows />
              ) : currentAssets.length > 0 ? (
                currentAssets.map((asset) => {
                  const isWatchlisted = watchlist.includes(asset.id);
                  const isPositive = asset.changePercent24h >= 0;
                  const flashClass =
                    priceDirections[asset.id] === "up"
                      ? "price-up"
                      : priceDirections[asset.id] === "down"
                      ? "price-down"
                      : "";

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-accent/30 transition-colors cursor-pointer group"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {/* Star */}
                      <td
                        className="py-4 px-4 hidden md:table-cell"
                        onClick={(e) => toggleWatchlist(asset.id, e)}
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            isWatchlisted
                              ? "text-gold fill-gold"
                              : "text-muted-foreground/30 hover:text-muted-foreground"
                          }`}
                        />
                      </td>
                      {/* Asset */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <AssetIcon src={asset.logo} symbol={asset.symbol} name={asset.name} size="md" />
                          <div>
                            <div className="font-bold text-foreground">{asset.name}</div>
                            <div className="text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                              <span className="bg-accent px-1.5 py-0.5 rounded text-[10px]">{asset.type}</span>
                              {asset.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="py-4 px-4 text-right">
                        <span className={`font-medium text-foreground transition-colors duration-150 inline-block ${flashClass}`}>
                          {formatCurrency(asset.price)}
                        </span>
                      </td>
                      {/* 24h % */}
                      <td className="py-4 px-4 text-right">
                        <div className={`inline-flex items-center gap-1 font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {formatPercent(asset.changePercent24h)}
                        </div>
                      </td>
                      {/* Volume — hidden on mobile */}
                      <td className="py-4 px-4 text-right text-muted-foreground font-medium hidden md:table-cell">
                        {formatCompact(asset.volume24h)}
                      </td>
                      {/* Market Cap — hidden on mobile */}
                      <td className="py-4 px-4 text-right text-muted-foreground font-medium hidden md:table-cell">
                        {formatCompact(asset.marketCap)}
                      </td>
                      {/* Sparkline — hidden on mobile */}
                      <td className="py-4 px-4 text-center hidden md:table-cell">
                        <div className="inline-block opacity-70 group-hover:opacity-100 transition-opacity">
                          <Sparkline data={asset.sparkline} colorClass={isPositive ? "text-emerald-500" : "text-red-500"} />
                        </div>
                      </td>
                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <Link href="/signup" onClick={(e) => e.stopPropagation()}>
                          <button className="bg-accent hover:bg-gold text-foreground hover:text-navy font-bold py-1.5 px-4 rounded-lg transition-colors text-sm whitespace-nowrap">
                            Trade →
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAssets.length === 0 ? 0 : (page - 1) * itemsPerPage + 1}–
            {Math.min(page * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded-lg bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

      </main>

      {/* ASSET DETAIL MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAsset(null)} />

          <div className="relative w-full max-w-4xl bg-background border border-border/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <div className="flex items-center gap-4">
                <AssetIcon src={selectedAsset.logo} symbol={selectedAsset.symbol} name={selectedAsset.name} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {selectedAsset.name}
                    <span className="text-muted-foreground text-lg">{selectedAsset.symbol}</span>
                  </h2>
                  <div className="text-3xl font-bold mt-1">
                    {formatCurrency(selectedAsset.price)}
                    <span className={`text-lg ml-3 ${selectedAsset.changePercent24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {formatPercent(selectedAsset.changePercent24h)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Market Cap", value: formatCompact(selectedAsset.marketCap) },
                  { label: "Volume (24h)", value: formatCompact(selectedAsset.volume24h) },
                  { label: "Asset Type", value: selectedAsset.type.toUpperCase() },
                ].map((item) => (
                  <div key={item.label} className="bg-accent/30 p-4 rounded-xl border border-border/20">
                    <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                    <div className="font-bold">{item.value}</div>
                  </div>
                ))}
                <div className="bg-accent/30 p-4 rounded-xl border border-border/20">
                  <div className="text-sm text-muted-foreground mb-1">Watchlist</div>
                  <button
                    onClick={(e) => toggleWatchlist(selectedAsset.id, e)}
                    className="font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Star className={`w-4 h-4 ${watchlist.includes(selectedAsset.id) ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                    <span className={watchlist.includes(selectedAsset.id) ? "text-foreground" : "text-muted-foreground"}>
                      {watchlist.includes(selectedAsset.id) ? "Starred" : "Add to Watch"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-accent/10 border border-border/20 rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-background/40 z-10 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-background border border-gold/30 p-8 rounded-2xl shadow-2xl text-center max-w-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 blur-2xl rounded-full" />
                    <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4 relative z-10" />
                    <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">Advanced Charting</h3>
                    <p className="text-muted-foreground text-sm mb-8 relative z-10">Full TradingView integration available for registered institutions.</p>
                    <Link href="/signup" className="relative z-10">
                      <Button className="w-full bg-gold hover:bg-gold-hover text-navy font-bold py-6 text-lg rounded-xl">
                        Open Account to Trade
                      </Button>
                    </Link>
                  </div>
                </div>
                <svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q25,20 50,50 T100,10" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
                  <path d="M0,90 Q30,40 60,70 T100,30" fill="none" stroke="#34d399" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            <div className="p-6 border-t border-border/20 bg-accent/10 flex justify-end gap-4">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-accent transition-colors border border-transparent hover:border-border/20"
              >
                Close
              </button>
              <Link href="/signup">
                <button className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-bold transition-colors shadow-lg flex items-center gap-2">
                  Trade {selectedAsset.symbol} <ArrowUpRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
