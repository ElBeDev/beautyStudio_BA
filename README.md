# Beauty Studio DA — sitio web

Sitio de una sola página para **Beauty Studio DA** (Dailyn Angulo), con panel de administración en `/admin`.

## Comandos

```bash
npm install
vercel env pull   # baja BLOB_READ_WRITE_TOKEN a .env.local
npm run dev       # http://localhost:3000  (panel: /admin)
npm run build
```

Se publica en Vercel con cada push a `main`.

## Panel de administración (`/admin`)

Desde el panel se editan textos, fotos (con recorte), servicios, portafolio, opiniones, contacto y SEO.
Cada guardado se publica al instante y queda una copia en **Historial** (últimas 30) para poder volver atrás.

| Variable (Vercel) | Para qué |
| --- | --- |
| `ADMIN_PASSWORD` | Contraseña del panel. Cambiarla cierra todas las sesiones. |
| `BLOB_READ_WRITE_TOKEN` | La pone Vercel al conectar el Blob store `beautystudioba-fotos` (público). |
| `NEXT_PUBLIC_SITE_URL` | Opcional. Dominio para canonical, sitemap y Open Graph (por defecto `https://beautystudioda.com`). |

Cómo funciona:

- El contenido se guarda en Vercel Blob (`content/site.json`, historial en `content/history/`). Las fotos subidas van a `uploads/`.
- La home es estática y queda en caché; guardar en el panel la invalida (`updateTag` + `revalidatePath`).
- Mientras no haya nada guardado, el sitio usa `defaultContent` de `src/content/site.ts`.
- Todo lo que llega del panel pasa por `src/lib/sanitize.ts` (longitudes, enlaces https, fotos solo de `/images/` o del Blob).

## Dónde está cada cosa en el código

| Qué | Archivo |
| --- | --- |
| Modelo del contenido y valores iniciales | `src/content/site.ts` |
| Lectura/escritura en Blob | `src/lib/content.ts` |
| Sesión del panel | `src/lib/session.ts`, `src/lib/auth.ts`, `src/proxy.ts` |
| Pantallas del panel | `src/app/admin/`, `src/components/admin/` |
| Subida de fotos | `src/app/api/admin/upload/route.ts` |
| Mensajes prellenados de WhatsApp | `src/lib/whatsapp.ts` |
| Colores (rosa / vino / crema) | `@theme` en `src/app/globals.css` |
| Tipografías (Clash Display + Inter) | `src/app/layout.tsx`, `src/fonts/` |
| Mosaico del portafolio (posiciones) | `src/components/Portfolio.tsx` |
| Secciones de la página | `src/app/page.tsx` |
