import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type InterpolationValues = Record<string, string | number>;

function getNestedValue(
  dictionary: Dictionary,
  key: string,
): string | undefined {
  const parts = key.split(".");
  let current: unknown = dictionary;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function createTranslator(dictionary: Dictionary) {
  return function t(key: string, values?: InterpolationValues): string {
    const template = getNestedValue(dictionary, key) ?? key;

    if (!values) return template;

    return template.replace(/\{(\w+)\}/g, (_, token: string) =>
      String(values[token] ?? `{${token}}`),
    );
  };
}

export type TranslateFn = ReturnType<typeof createTranslator>;
