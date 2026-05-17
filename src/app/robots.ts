import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/applied",
    },
    sitemap: "https://bthanda.com/sitemap.xml",
  };
}
