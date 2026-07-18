import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://boastlib.com";
const siteName = "BoastLib";

export type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildMetadata({ title, description, path = "/", image = `${siteUrl}/og-image.png` }: SEOProps): Metadata {
  const pageTitle = `${title} | ${siteName} — SMM Panel`;
  const pageUrl = `${siteUrl}${path}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: pageUrl,
      siteName,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${siteName} preview` }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
  };
}

export function buildCommonDescription(text: string) {
  return `${text} BoastLib is an SMM panel for Instagram, TikTok, YouTube and Facebook growth.`;
}
