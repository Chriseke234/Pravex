import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circle" | "rect";
}

export function Skeleton({
  width,
  height,
  className,
  variant = "rect",
  style,
  ...props
}: SkeletonProps) {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return (
    <div
      className={cn(
        "shimmer bg-white/[0.05] relative overflow-hidden",
        {
          "rounded-md": variant === "text",
          "rounded-full": variant === "circle",
          "rounded-2xl": variant === "rect",
        },
        className
      )}
      style={customStyle}
      {...props}
    />
  );
}
