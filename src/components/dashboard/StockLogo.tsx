"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type StockLogoProps = {
  ticker: string;
  logoUrl?: string;
  companyName: string;
  className?: string;
};

export function StockLogo({
  ticker,
  logoUrl,
  companyName,
  className,
}: StockLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = ticker.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface",
        className,
      )}
    >
      {logoUrl && !failed ? (
        <Image
          src={logoUrl}
          alt={`${companyName} logo`}
          fill
          sizes="44px"
          loading="lazy"
          className="object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted"
          aria-hidden={Boolean(logoUrl && failed)}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
