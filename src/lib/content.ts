import { del, get, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { defaultContent, type SiteContent } from "@/content/site";
import { sanitizeContent } from "@/lib/sanitize";

/**
 * Lectura y escritura del contenido en Vercel Blob (solo servidor).
 *
 * - `content/site.json`: versión publicada.
 * - `content/history/<fecha>.json`: copia de cada guardado, para poder volver atrás.
 */

export const CONTENT_TAG = "site-content";
const CURRENT = "content/site.json";
const HISTORY = "content/history/";
const KEEP_VERSIONS = 30;

/** Hay un Blob store conectado (token clásico u OIDC). Sin él, el sitio usa el contenido inicial. */
export const hasBlobStore = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

async function readJson(pathname: string): Promise<unknown | null> {
  const res = await get(pathname, { access: "public", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}

/** Lee el contenido directo del Blob, sin caché. Para el panel. */
export async function readContentFresh(): Promise<SiteContent> {
  if (!hasBlobStore()) return defaultContent;
  const raw = await readJson(CURRENT);
  return raw ? sanitizeContent(raw) : defaultContent;
}

// La caché de Next persiste entre despliegues; con el id del despliegue en la clave,
// cada despliegue nuevo vuelve a leer el Blob una vez.
const readCached = unstable_cache(readContentFresh, [CONTENT_TAG, process.env.VERCEL_DEPLOYMENT_ID ?? "local"], {
  tags: [CONTENT_TAG],
});

/**
 * Contenido para el sitio público. Queda en caché hasta que el panel guarda cambios
 * (que llama a `updateTag(CONTENT_TAG)`), así que la página sigue siendo estática y rápida.
 */
export async function getContent(): Promise<SiteContent> {
  return sanitizeContent(await readCached());
}

export async function writeContent(content: SiteContent) {
  const body = JSON.stringify(content);
  const opts = { access: "public", contentType: "application/json", cacheControlMaxAge: 60 } as const;
  await put(CURRENT, body, { ...opts, allowOverwrite: true });
  await put(`${HISTORY}${new Date().toISOString().replace(/[:.]/g, "-")}.json`, body, opts);
  await pruneHistory();
}

export type Version = { pathname: string; uploadedAt: string };

export async function listVersions(): Promise<Version[]> {
  if (!hasBlobStore()) return [];
  const { blobs } = await list({ prefix: HISTORY, limit: 1000 });
  return blobs
    .map((b) => ({ pathname: b.pathname, uploadedAt: b.uploadedAt.toISOString() }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function readVersion(pathname: string): Promise<SiteContent | null> {
  if (!pathname.startsWith(HISTORY) || !/^[\w/.-]+\.json$/.test(pathname)) return null;
  const raw = await readJson(pathname);
  return raw ? sanitizeContent(raw) : null;
}

async function pruneHistory() {
  const versions = await listVersions();
  const old = versions.slice(KEEP_VERSIONS).map((v) => v.pathname);
  if (old.length) await del(old);
}
