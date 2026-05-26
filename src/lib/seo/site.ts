import { APP_NAME } from "@/lib/config";

function optionalPublic(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export const siteConfig = {
  name: APP_NAME,
  description:
    "Modern stock analysis platform with global and Israeli TASE dashboards, weekly recommendations, and AI summaries.",
  url:
    optionalPublic("NEXT_PUBLIC_SITE_URL")?.replace(/\/$/, "") ??
    "http://localhost:3000",
  locale: "en_US",
  twitterHandle: optionalPublic("NEXT_PUBLIC_TWITTER_HANDLE"),
} as const;

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
