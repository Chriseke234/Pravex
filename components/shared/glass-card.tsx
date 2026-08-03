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
          // Base glassmorphism
          "glassmorphism rounded-2xl transition-all duration-300",
          // Optional hover lift
          hover && "hover:border-white/15 hover:shadow-lg hover:shadow-slate-950/40",
          // Optional gold top accent
          goldEdge && "border-t-amber-500/30 [border-top-color:rgba(212,167,44,0.3)]",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
