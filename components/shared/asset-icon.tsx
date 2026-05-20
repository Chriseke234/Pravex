"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AssetIconProps {
  src?: string;
  symbol: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AssetIcon({ src, symbol, name, className = "", size = "md" }: AssetIconProps) {
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  // Determine size classes
  const sizeMap = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-8 h-8 text-[10px]",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-lg",
  };

  const sizeClass = sizeMap[size] || sizeMap.md;

  if (error || !src) {
    // Generate deterministic gradient colors based on symbol name
    const colors = [
      "from-blue-600 to-indigo-700 border-blue-500/30",
      "from-emerald-600 to-teal-700 border-emerald-500/30",
      "from-purple-600 to-pink-700 border-purple-500/30",
      "from-amber-500 to-orange-600 border-amber-400/30",
      "from-rose-600 to-red-700 border-rose-500/30",
      "from-cyan-500 to-blue-600 border-cyan-400/30",
      "from-violet-600 to-fuchsia-700 border-violet-500/30",
    ];

    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    const gradient = colors[colorIndex];

    // Clean up symbol to fit (e.g. BTC -> BTC, EUR/USD -> EUR)
    const initials = symbol.includes("/") ? symbol.split("/")[0] : symbol;

    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shrink-0 border shadow-md tracking-wider ${className}`}
        title={name}
      >
        {initials.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-white/5 overflow-hidden relative shrink-0 border border-white/10 ${className}`}>
      <Image
        src={src}
        alt={symbol}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 48px, 48px"
      />
    </div>
  );
}
