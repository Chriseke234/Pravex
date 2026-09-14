"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ─── StatCard ────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: { value: string; positive: boolean };
  icon?: LucideIcon;
  /** Accent colour scheme */
  accent?: "gold" | "emerald" | "blue" | "rose" | "slate";
  loading?: boolean;
  className?: string;
}

const accentStyles = {
  gold: {
    icon: "bg-amber-500/15 text-amber-400",
    glow: "before:bg-amber-500/10",
    delta_pos: "text-amber-400",
    delta_neg: "text-rose-400",
    border: "border-amber-500/15",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400",
    glow: "before:bg-emerald-500/10",
    delta_pos: "text-emerald-400",
    delta_neg: "text-rose-400",
    border: "border-emerald-500/15",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-400",
    glow: "before:bg-blue-500/10",
    delta_pos: "text-emerald-400",
    delta_neg: "text-rose-400",
    border: "border-blue-500/15",
  },
  rose: {
    icon: "bg-rose-500/15 text-rose-400",
    glow: "before:bg-rose-500/10",
    delta_pos: "text-emerald-400",
    delta_neg: "text-rose-400",
    border: "border-rose-500/15",
  },
  slate: {
    icon: "bg-slate-700/50 text-slate-300",
    glow: "before:bg-slate-700/10",
    delta_pos: "text-emerald-400",
    delta_neg: "text-rose-400",
    border: "border-slate-700/30",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  delta,
  icon: Icon,
  accent = "gold",
  loading = false,
  className,
}: StatCardProps) {
  const styles = accentStyles[accent];

  if (loading) {
    return (
      <div
        className={cn(
          "relative p-5 rounded-2xl bg-slate-900/80 border border-slate-800/60 overflow-hidden shimmer",
          className
        )}
      >
        <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
        <div className="h-8 w-32 bg-slate-800 rounded mb-2" />
        <div className="h-3 w-16 bg-slate-800 rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative p-5 rounded-2xl bg-[#0C1A2E] border border-[#17293F] overflow-hidden",
        "hover:border-[#1C3254] transition-all duration-300 shadow-sm",
        className
      )}
    >
      {/* Subtle glow blob */}
      <div
        className={cn(
          "absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-60 transition-opacity group-hover:opacity-80",
          styles.glow.replace("before:", "")
        )}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
            {title}
          </p>
          <p className="text-2xl font-bold text-white tracking-tight truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
          {delta && (
            <p
              className={cn(
                "text-xs font-semibold mt-1.5",
                delta.positive ? styles.delta_pos : styles.delta_neg
              )}
            >
              {delta.positive ? "↑" : "↓"} {delta.value}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              "shrink-0 p-3 rounded-xl",
              styles.icon
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  );
}
