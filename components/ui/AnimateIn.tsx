"use client";

import React from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface AnimateInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  direction?: "up" | "left" | "right";
}

export function AnimateIn({
  children,
  delay = 0,
  duration = 800,
  direction = "up",
  className,
  style,
  ...props
}: AnimateInProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const getTransform = () => {
    if (isVisible) return "translateX(0) translateY(0)";
    switch (direction) {
      case "left":  return "translateX(-32px)";
      case "right": return "translateX(32px)";
      case "up":
      default:      return "translateY(32px)";
    }
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
