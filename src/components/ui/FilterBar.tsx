"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";

type FilterBarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  className?: string;
};

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface p-4",
        className,
      )}
    >
      <SearchInput
        value={searchValue}
        onValueChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
