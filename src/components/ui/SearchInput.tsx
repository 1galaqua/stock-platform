"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  onValueChange?: (value: string) => void;
};

export function SearchInput({
  className,
  placeholder = "Search by ticker or company…",
  onValueChange,
  onChange,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
        />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-border-subtle bg-surface py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
          "transition-colors hover:border-border focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
        )}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      />
    </div>
  );
}
