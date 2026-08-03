import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /* ─── Primary: Institutional Gold ─── */
        default:
          "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30",

        /* ─── Navy Filled ─────────────────── */
        navy:
          "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-sm",

        /* ─── Destructive ─────────────────── */
        destructive:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-500/20",

        /* ─── Outline ─────────────────────── */
        outline:
          "border border-slate-700 bg-transparent text-white hover:bg-slate-800/80 hover:border-slate-600",

        /* ─── Gold Outline ────────────────── */
        "outline-gold":
          "border border-amber-500/40 bg-transparent text-amber-400 hover:bg-amber-500/10 hover:border-amber-400",

        /* ─── Ghost ───────────────────────── */
        ghost:
          "text-slate-300 hover:bg-slate-800/80 hover:text-white",

        /* ─── Link ────────────────────────── */
        link:
          "text-amber-400 underline-offset-4 hover:underline p-0 h-auto",

        /* ─── Glassmorphism ───────────────── */
        glass:
          "glassmorphism text-white hover:bg-white/10 border border-white/10",

        /* ─── Premium Gold Gradient ───────── */
        premium:
          "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-size-200 text-slate-950 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 hover:bg-right",
      },
      size: {
        sm:      "h-8 px-3 text-xs rounded-lg",
        default: "h-10 px-5 py-2",
        lg:      "h-12 px-7 text-base rounded-xl",
        xl:      "h-14 px-8 text-base rounded-2xl",
        icon:    "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
