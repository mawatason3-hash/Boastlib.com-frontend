import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/dev", "/new-order", "/orders", "/add-funds", "/transactions", "/profile"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://boastlib.com"}/sitemap.xml`,
  };
}
