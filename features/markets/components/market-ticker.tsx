"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const MOCK_ASSETS = [
  { symbol: "BTC", price: "64,231.50", change: "+2.4%", up: true },
  { symbol: "ETH", price: "3,452.12", change: "-1.2%", up: false },
  { symbol: "SOL", price: "145.82", change: "+5.7%", up: true },
  { symbol: "AAPL", price: "189.45", change: "+0.8%", up: true },
  { symbol: "TSLA", price: "172.63", change: "-2.1%", up: false },
  { symbol: "NVDA", price: "892.45", change: "+4.2%", up: true },
  { symbol: "EUR/USD", price: "1.0824", change: "-0.05%", up: false },
  { symbol: "GOLD", price: "2,342.10", change: "+1.1%", up: true },
];

export function MarketTicker() {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-b border-white/5 py-2 overflow-hidden select-none">
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...MOCK_ASSETS, ...MOCK_ASSETS].map((asset, index) => (
          <div key={index} className="flex items-center gap-4 text-sm font-medium">
            <span className="text-muted-foreground">{asset.symbol}</span>
            <span>${asset.price}</span>
            <span className={`flex items-center gap-1 ${asset.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {asset.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {asset.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
