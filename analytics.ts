import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
};

export function buttonClassName(variant: ButtonProps["variant"] = "primary", className?: string) {
  return cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" && "bg-pine text-white hover:bg-forest",
    variant === "secondary" && "border border-pine/20 bg-white text-pine hover:bg-offWhite",
    variant === "ghost" && "text-pine hover:bg-white/60",
    variant === "gold" && "bg-gold text-forest hover:bg-[#d4b36f]",
    className
  );
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClassName(variant, className)}
      {...props}
    />
  );
}
