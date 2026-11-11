import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático: `npm run build` genera la carpeta `out/`,
  // que se puede subir a Vercel, Hostinger o cualquier hosting.
  output: "export",
  images: { unoptimized: true },
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
