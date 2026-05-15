import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glassmorphism rounded-xl p-6 transition-all duration-300",
          hover && "hover:border-white/20 hover:bg-white/5 hover:translate-y-[-2px]",
          className
        )}
        {...props}
      />
    )
  }
)

GlassCard.displayName = "GlassCard"
