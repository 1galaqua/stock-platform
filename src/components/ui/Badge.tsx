import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface-hover text-foreground border-border-subtle",
  bullish: "bg-positive/10 text-positive border-positive/20",
  neutral: "bg-warning/10 text-warning border-warning/20",
  bearish: "bg-negative/10 text-negative border-negative/20",
  low: "bg-positive/10 text-positive border-positive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-negative/10 text-negative border-negative/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  outline: "bg-transparent text-muted border-border",
} as const;

export type BadgeVariant = keyof typeof variants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
