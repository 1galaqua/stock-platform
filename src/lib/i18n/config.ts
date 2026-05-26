export const LOCALE_COOKIE = "stock-platform-locale";

export type Locale = "en" | "he";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Locale[] = ["en", "he"];

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "he";
}

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "he" ? "rtl" : "ltr";
}

export function getDateLocale(locale: Locale): string {
  return locale === "he" ? "he-IL" : "en-US";
}
