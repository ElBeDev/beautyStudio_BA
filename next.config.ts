import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El contenido se edita desde /admin y se guarda en Vercel Blob, así que el sitio
  // necesita servidor (Vercel). La página sigue saliendo pre-renderizada y en caché:
  // solo se vuelve a generar cuando se guardan cambios en el panel.
  images: {
    remotePatterns: [
      // Fotos subidas desde el panel
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/uploads/**", search: "" },
    ],
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
