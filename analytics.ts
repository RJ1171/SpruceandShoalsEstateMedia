import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-pine/20 bg-white shadow-[0_18px_45px_rgba(15,44,37,0.08)] ring-1 ring-white/70",
        className
      )}
      {...props}
    />
  );
}
