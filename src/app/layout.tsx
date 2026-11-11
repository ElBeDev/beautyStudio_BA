import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content/site";
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

const title = `${site.name} · Maquillaje y micropigmentación en San Antonio del Táchira`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: [
    "maquillaje San Antonio del Táchira",
    "maquilladora Cúcuta",
    "maquillaje quinceañeras",
    "maquillaje novias",
    "micropigmentación de cejas",
    "micropigmentación de labios",
    "lifting de pestañas",
    "diseño de cejas",
    "uñas en resina",
    "Dailyn Angulo",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/images/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#ffc2d1",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/images/og.jpg`,
  telephone: site.contact.phoneE164,
  founder: { "@type": "Person", name: site.owner.name, jobTitle: site.owner.titles[0] },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.location.street} (${site.location.reference})`,
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: site.location.country,
  },
  areaServed: [site.location.city, "Cúcuta"],
  sameAs: [site.contact.instagram.url, site.contact.tiktok.url],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${clash.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
