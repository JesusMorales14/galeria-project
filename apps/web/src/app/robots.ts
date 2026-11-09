import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/colecciones"] },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
