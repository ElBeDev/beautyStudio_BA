import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { BODY_FONTS, DISPLAY_FONTS, findFont, siteUrl, type Theme } from "@/content/site";
import { getContent } from "@/lib/content";
import { fontVariables } from "./fonts";
import "./globals.css";

/** Variables CSS con las letras elegidas en el panel (las usan `display`, `label` y el texto normal). */
function themeStyle(theme: Theme): CSSProperties {
  const display = findFont(DISPLAY_FONTS, theme.displayFont);
  const body = findFont(BODY_FONTS, theme.bodyFont);
  return {
    "--font-display": `var(${display.cssVar}), ${display.fallback}`,
    "--font-sans": `var(${body.cssVar}), ${body.fallback}`,
    "--display-weight": String(display.weight),
    "--display-tracking": display.tracking,
    "--display-case": theme.uppercase ? "uppercase" : "none",
  } as CSSProperties;
}

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  const title = `${c.name} · Maquillaje y micropigmentación en ${c.location.city}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${c.name}` },
    description: c.description,
    keywords: [
      `maquillaje ${c.location.city}`,
      "maquilladora Cúcuta",
      "maquillaje quinceañeras",
      "maquillaje novias",
      "micropigmentación de cejas",
      "micropigmentación de labios",
      "lifting de pestañas",
      "diseño de cejas",
      "uñas en resina",
      c.owner.name,
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: "/",
      siteName: c.name,
      title,
      description: c.description,
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: c.name }],
    },
    twitter: { card: "summary_large_image", title, description: c.description, images: ["/images/og.jpg"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#e6d8c3",
};

async function jsonLd() {
  const c = await getContent();
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: c.name,
    description: c.description,
    url: siteUrl,
    image: `${siteUrl}/images/og.jpg`,
    telephone: `+${c.contact.whatsapp}`,
    founder: { "@type": "Person", name: c.owner.name, jobTitle: c.owner.title },
    address: {
      "@type": "PostalAddress",
      streetAddress: [c.location.street, c.location.reference && `(${c.location.reference})`].filter(Boolean).join(" "),
      addressLocality: c.location.city,
      addressRegion: c.location.region,
      addressCountry: "VE",
    },
    areaServed: [c.location.city, "Cúcuta"],
    sameAs: [c.contact.instagram.url, c.contact.tiktok.url].filter(Boolean),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const ld = await jsonLd();
  const { theme } = await getContent();
  return (
    <html lang="es" className={`${fontVariables} h-full`} style={themeStyle(theme)}>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
