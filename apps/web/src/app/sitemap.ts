import type { MetadataRoute } from "next";
import { FEATURED_ARTWORK_IDS, siteUrl } from "@/shared/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const url = (path: string) => new URL(path, base).href;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/buscar"), changeFrequency: "weekly", priority: 0.8 },
    ...FEATURED_ARTWORK_IDS.map((id) => ({
      url: url(`/obra/${id}`),
      changeFrequency: "monthly" as const,
    })),
  ];
}
