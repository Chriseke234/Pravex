"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { TrendingUp, TrendingDown, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
  { name: "Sui", symbol: "SUI", price: "$1.45", change: "+5.1%", volume: "$200M", mcap: "$1.8B", up: true },
  { name: "Injective", symbol: "INJ", price: "$28.30", change: "-4.2%", volume: "$110M", mcap: "$2.6B", up: false },
  { name: "Stellar", symbol: "XLM", price: "$0.11", change: "+0.5%", volume: "$85M", mcap: "$3.1B", up: true },
  { name: "Filecoin", symbol: "FIL", price: "$5.80", change: "-1.8%", volume: "$130M", mcap: "$2.9B", up: false },
  { name: "Internet Computer", symbol: "ICP", price: "$12.40", change: "+3.6%", volume: "$170M", mcap: "$5.7B", up: true },
  { name: "VeChain", symbol: "VET", price: "$0.03", change: "+1.2%", volume: "$45M", mcap: "$2.4B", up: true },
  { name: "Maker", symbol: "MKR", price: "$2,850.00", change: "-2.5%", volume: "$80M", mcap: "$2.6B", up: false },
  { name: "Render", symbol: "RNDR", price: "$10.20", change: "+8.4%", volume: "$300M", mcap: "$3.9B", up: true },
  { name: "The Graph", symbol: "GRT", price: "$0.32", change: "-0.9%", volume: "$65M", mcap: "$3.0B", up: false },
  { name: "Lido DAO", symbol: "LDO", price: "$2.15", change: "+1.7%", volume: "$90M", mcap: "$1.9B", up: true },
];

export function AssetTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterMode, setFilterMode] = useState<"all" | "gainers" | "losers">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cycleFilter = () => {
    if (filterMode === "all") setFilterMode("gainers");
    else if (filterMode === "gainers") setFilterMode("losers");
    else setFilterMode("all");
    setCurrentPage(1); // Reset page on filter
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on tab change
  };

  const filteredAssets = ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "watchlist") {
      // Mock watchlist behavior: just show top a few for demo
      matchesTab = ["BTC", "ETH", "SOL", "AVAX", "LINK"].includes(asset.symbol);
    }
    
    let matchesFilter = true;
    if (filterMode === "gainers") matchesFilter = asset.up === true;
    if (filterMode === "losers") matchesFilter = asset.up === false;

    return matchesSearch && matchesTab && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  const filterLabels = {
    all: "Filter",
    gainers: "Gainers",
    losers: "Losers"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant={filterMode === "all" ? "glass" : "default"} 
            size="sm" 
            className="flex-1 md:flex-none min-w-[100px]"
            onClick={cycleFilter}
          >
            <Filter className="w-4 h-4 mr-2" />
            {filterLabels[filterMode]}
          </Button>
          <Button 
            variant={activeTab === "all" ? "default" : "glass"} 
            size="sm" 
            className="flex-1 md:flex-none"
            onClick={() => handleTabChange("all")}
          >
            All Assets
          </Button>
          <Button 
            variant={activeTab === "watchlist" ? "default" : "glass"} 
            size="sm" 
            className="flex-1 md:flex-none"
            onClick={() => handleTabChange("watchlist")}
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
              {paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-white">{startIndex + 1}</span> to <span className="font-medium text-white">{Math.min(startIndex + itemsPerPage, filteredAssets.length)}</span> of <span className="font-medium text-white">{filteredAssets.length}</span> assets
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
