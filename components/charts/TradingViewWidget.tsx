"use client";

import { useEffect, useRef, useState } from "react";

// Map internal asset IDs to TradingView symbols
const SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  solana: "BINANCE:SOLUSDT",
  cardano: "BINANCE:ADAUSDT",
  ripple: "BINANCE:XRPUSDT",
  polkadot: "BINANCE:DOTUSDT",
  chainlink: "BINANCE:LINKUSDT",
  "avalanche-2": "BINANCE:AVAXUSDT",
  "matic-network": "BINANCE:MATICUSDT",
  uniswap: "BINANCE:UNIUSDT",
  aapl: "NASDAQ:AAPL",
  tsla: "NASDAQ:TSLA",
  nvda: "NASDAQ:NVDA",
  amzn: "NASDAQ:AMZN",
  msft: "NASDAQ:MSFT"
};

interface TradingViewWidgetProps {
  symbol: string; // The internal asset ID or a raw TV symbol
  theme?: "dark" | "light";
  height?: number;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewWidget({ symbol, theme = "dark", height = 500 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetId = useRef(`tv_widget_${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let widget: any = null;

    const tvSymbol = SYMBOL_MAP[symbol.toLowerCase()] || symbol.toUpperCase();

    const initWidget = () => {
      if (!window.TradingView || !containerRef.current) return;
      
      setIsLoaded(true);
      
      // Clear container before initializing to avoid duplicates on re-renders
      containerRef.current.innerHTML = "";
      const div = document.createElement('div');
      div.id = widgetId.current;
      div.style.height = '100%';
      div.style.width = '100%';
      containerRef.current.appendChild(div);

      widget = new window.TradingView.widget({
        autosize: true,
        symbol: tvSymbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(10, 22, 40, 1)", // Ironbridgemarket dark navy #0A1628
        gridColor: "rgba(255, 255, 255, 0.05)",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: widgetId.current,
        hide_volume: true
      });
    };

    if (!window.TradingView) {
      script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ height }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#081221] z-10">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400 font-medium">Loading Chart Data...</div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
