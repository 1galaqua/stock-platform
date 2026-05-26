export function formatUpdatedAt(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function formatPrice(price: number, currency: string): string {
  if (currency === "ILS") {
    return `₪${new Intl.NumberFormat("he-IL", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(price)}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

export function formatNewsDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function getNextRefreshDate(
  updatedAt: string,
  intervalDays: number,
): Date {
  const next = new Date(updatedAt);
  next.setDate(next.getDate() + intervalDays);
  return next;
}

export function formatNextRefreshAt(
  updatedAt: string,
  intervalDays: number,
): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(getNextRefreshDate(updatedAt, intervalDays));
}
