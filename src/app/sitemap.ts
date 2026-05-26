import { ROUTES } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl(ROUTES.home),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl(ROUTES.global),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl(ROUTES.israel),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
