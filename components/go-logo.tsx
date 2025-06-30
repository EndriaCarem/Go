"use client";

import { cn } from "@/lib/utils";

interface GoLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export function GoLogo({
  size = "md",
  className,
  showText = true,
}: GoLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-8 h-8 text-lg",
    lg: "w-10 h-10 text-xl",
    xl: "w-12 h-12 text-2xl",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "go-gradient rounded-xl flex items-center justify-center font-bold text-white go-shadow animate-pulse-glow",
          sizeClasses[size]
        )}
      >
        Go
      </div>
      {showText && (
        <span className={cn("font-bold go-gradient-text", textSizes[size])}>
          Go
        </span>
      )}
    </div>
  );
}
