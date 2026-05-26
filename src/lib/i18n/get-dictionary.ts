import type { Locale } from "@/lib/i18n/config";
import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";
import { he } from "@/lib/i18n/dictionaries/he";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  he,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
