import { MetadataRoute } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://boastlib.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(`${apiUrl}/api/public/services/platforms`, { cache: "no-store" });
  const platforms = response.ok ? (await response.json()) as Array<{ platform: string; lastmod: string }> : [];

  const platformUrls = platforms.map((row) => ({
    url: `${siteUrl}/services/${encodeURIComponent(row.platform.toLowerCase())}`,
    lastModified: row.lastmod ? new Date(row.lastmod).toISOString() : undefined,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/services` },
    { url: `${siteUrl}/rwanda` },
    { url: `${siteUrl}/faq` },
    ...platformUrls,
  ];

  return staticUrls;
}
