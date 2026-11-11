# Beauty Studio DA — sitio web

Sitio de una sola página para **Beauty Studio DA** (Dailyn Angulo), basado en `Propuesta_Beauty_Studio_DA_v2.pdf`.

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera el sitio estático en out/
```

`out/` se sube tal cual a cualquier hosting (Vercel, Hostinger, Netlify…).

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| Textos, servicios, contacto, dirección, testimonios | `src/content/site.ts` |
| Fotos del portafolio | `public/images/` + lista `portfolio` en `src/content/site.ts` |
| Mensajes prellenados de WhatsApp | `src/lib/whatsapp.ts` |
| Colores (rosa / vino / crema) | `@theme` en `src/app/globals.css` |
| Tipografías (Clash Display + Inter) | `src/app/layout.tsx`, `src/fonts/` |
| Menú flotante y botón fijo de agendar | `src/components/Nav.tsx` |
| Mosaico del portafolio (posiciones) | `src/components/Portfolio.tsx` |
| Secciones de la página | `src/app/page.tsx` |

La sección **Opiniones** aparece sola cuando se agregan testimonios a `testimonials`.

Dominio: define `NEXT_PUBLIC_SITE_URL` (por defecto `https://beautystudioda.com`) para canonical, sitemap y Open Graph.
