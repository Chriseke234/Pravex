import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  /** Subtle gold glow on the top edge */
  goldEdge?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, goldEdge = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Brand Deep Navy Card
          "bg-[#0C1A2E] border border-[#17293F] text-slate-100 rounded-2xl transition-all duration-300",
          // Optional hover lift
          hover && "hover:border-[#1C3254] hover:shadow-lg hover:shadow-black/40",
          // Optional gold top accent
          goldEdge && "border-t-amber-500/40",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
