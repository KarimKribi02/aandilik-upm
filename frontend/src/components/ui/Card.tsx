import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "low" | "default" | "high" | "highest" | "lowest";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "lowest", ...props }, ref) => {
    const variants = {
      lowest: "bg-surface-lowest",
      low: "bg-surface-low",
      default: "bg-surface-container",
      high: "bg-surface-high",
      highest: "bg-surface-highest",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const GlassContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-xl border border-white/20 p-6",
          className
        )}
        {...props}
      />
    );
  }
);
GlassContainer.displayName = "GlassContainer";
