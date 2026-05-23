import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "glass" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, ...props }, ref) => {
    const variants = {
      primary: "primary-gradient text-zinc-950 font-bold hover:opacity-95 active:scale-95 shadow-sm shadow-primary/15 border border-primary/20",
      accent: "accent-gradient text-zinc-950 font-bold hover:opacity-95 active:scale-95 shadow-sm shadow-accent/15 border border-accent/20",
      secondary: "bg-zinc-900 text-primary hover:bg-black font-bold hover:text-white border border-zinc-800 transition-all duration-300 active:scale-95 shadow-md shadow-black/10",
      tertiary: "bg-transparent text-zinc-800 hover:text-primary hover:bg-zinc-100 active:scale-95",
      glass: "glass text-foreground border border-white/20 hover:bg-white/40 active:scale-95",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm font-semibold",
      lg: "px-8 py-4 text-base font-bold",
    };

    return (
      <button
        ref={ref}
        disabled={props.disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
