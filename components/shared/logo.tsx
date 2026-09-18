"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** Size variant: "sm" (h-8), "md" (h-9), "lg" (h-11) */
  size?: "sm" | "md" | "lg";
  /** Color theme variant: "light" (dark text on light bg) or "dark" (white text on dark bg) */
  variant?: "light" | "dark";
  /** Whether to render brand name text next to the emblem */
  showText?: boolean;
  /** Custom destination link or null for plain container */
  href?: string | null;
  /** Extra class names for wrapper */
  className?: string;
  /** Extra class names specifically for text */
  textClassName?: string;
  /** Click event handler */
  onClick?: () => void;
}

/**
 * Luxury Shield and Architectural Arch SVG Emblem
 */
export function LogoIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main Gold Shield Gradient */}
          <linearGradient id="ibb-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Gold Highlight Shine */}
          <linearGradient id="ibb-gold-shine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>

          {/* Deep Core Navy */}
          <linearGradient id="ibb-core-navy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>
        </defs>

        {/* Shield Outer Body */}
        <path
          d="M22 3L6 9.5V20.5C6 30.2 12.8 39.1 22 41.5C31.2 39.1 38 30.2 38 20.5V9.5L22 3Z"
          fill="url(#ibb-gold-grad)"
        />

        {/* Shield Inner Inset Background */}
        <path
          d="M22 5.5L8.5 11.2V20.5C8.5 28.6 14.3 36.3 22 38.5C29.7 36.3 35.5 28.6 35.5 20.5V11.2L22 5.5Z"
          fill="url(#ibb-core-navy)"
        />

        {/* Top Gold Shine Inset */}
        <path
          d="M22 6L9.5 11.5V19C9.5 22.5 10.5 26 12.5 29L22 8L31.5 29C33.5 26 34.5 22.5 34.5 19V11.5L22 6Z"
          fill="url(#ibb-gold-shine)"
          opacity="0.35"
        />

        {/* Architectural Suspension Bridge Deck */}
        <path
          d="M12 25.5H32"
          stroke="#F59E0B"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Lower Arch */}
        <path
          d="M13 25.5C15 20.5 18 17.5 22 17.5C26 17.5 29 20.5 31 25.5"
          stroke="#FCD34D"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Center Keystone / Security Pillar */}
        <path
          d="M22 14V25.5"
          stroke="#FBBF24"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left Cable Stay */}
        <path
          d="M17 19.5V25.5"
          stroke="#F59E0B"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Right Cable Stay */}
        <path
          d="M27 19.5V25.5"
          stroke="#F59E0B"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Center Diamond Security Star */}
        <path
          d="M22 28.5L23.75 31L22 33.5L20.25 31L22 28.5Z"
          fill="#FCD34D"
        />
      </svg>
    </div>
  );
}

/**
 * Universal Brand Logo Component
 */
export function Logo({
  size = "md",
  variant = "light",
  showText = true,
  href = "/",
  className,
  textClassName,
  onClick,
}: LogoProps) {
  const textSizeClasses = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl lg:text-2xl",
  };

  const isDark = variant === "dark";

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 sm:gap-3 group select-none",
        className
      )}
      onClick={onClick}
    >
      <LogoIcon size={size} />

      {showText && (
        <div className="flex items-center tracking-tight leading-none whitespace-nowrap">
          <span
            className={cn(
              "font-serif font-bold transition-colors duration-200",
              isDark ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-amber-600",
              textSizeClasses[size],
              textClassName
            )}
          >
            Iron{" "}
            <span
              className={cn(
                "font-sans font-extrabold tracking-normal",
                isDark ? "text-amber-400" : "text-amber-600"
              )}
            >
              Bridge
            </span>
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Iron Bridge Home">
        {content}
      </Link>
    );
  }

  return content;
}
