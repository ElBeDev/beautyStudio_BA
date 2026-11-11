import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { siteUrl } from "@/content/site";
import { getContent } from "@/lib/content";
import "./globals.css";

// Clash Display (Indian Type Foundry, licencia gratuita de Fontshare)
const clash = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

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
  themeColor: "#ffc2d1",
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
  return (
    <html
      lang="es"
      className={`${clash.variable} ${inter.variable} h-full`}
    >
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
