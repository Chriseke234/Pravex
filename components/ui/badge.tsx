"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Badge Variants ─────────────────────────────────────── */
type BadgeVariant =
  | "default"
  | "gold"
  | "navy"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-slate-800/80 text-slate-300 border-slate-700/50",
  gold:
    "bg-amber-500/15 text-amber-300 border-amber-500/30",
  navy:
    "bg-blue-900/40 text-blue-300 border-blue-800/40",
  success:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  warning:
    "bg-amber-500/10 text-amber-400 border-amber-500/25",
  danger:
    "bg-rose-500/10 text-rose-400 border-rose-500/25",
  info:
    "bg-sky-500/10 text-sky-400 border-sky-500/25",
  outline:
    "bg-transparent text-foreground border-border",
};

type SizeVariant = "sm" | "md" | "lg";
const sizeClasses: Record<SizeVariant, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: SizeVariant;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full shrink-0",
            {
              "bg-amber-400": variant === "gold" || variant === "warning",
              "bg-emerald-400": variant === "success",
              "bg-rose-400": variant === "danger",
              "bg-sky-400": variant === "info",
              "bg-slate-400": variant === "default" || variant === "outline",
              "bg-blue-400": variant === "navy",
            }
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ─── Convenience helper for transaction/vault status ─────── */
export function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "").toLowerCase();
  let variant: BadgeVariant = "default";
  if (["completed", "approved", "active", "verified"].includes(normalized)) variant = "success";
  else if (["pending", "processing", "awaiting_approval"].includes(normalized)) variant = "warning";
  else if (["failed", "rejected", "cancelled", "suspended"].includes(normalized)) variant = "danger";

  return (
    <Badge variant={variant} dot size="sm">
      {status}
    </Badge>
  );
}
