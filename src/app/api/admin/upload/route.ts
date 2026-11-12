import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";
import { hasBlobStore } from "@/lib/content";

/**
 * Sube una foto al Blob. El panel ya la achica en el navegador (máx. 3000 px, JPEG),
 * así que llega muy por debajo del límite de 4.5 MB de las funciones de Vercel.
 */

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!hasBlobStore()) {
    return Response.json({ error: "Todavía no hay almacenamiento conectado (Vercel Blob)." }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No llegó ninguna foto." }, { status: 400 });

  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Formato no permitido. Usa JPG, PNG o WebP." }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "La foto pesa demasiado (máx. 4 MB)." }, { status: 413 });

  try {
    const blob = await put(`uploads/${crypto.randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return Response.json({ url: blob.url });
  } catch (e) {
    console.error("upload", e);
    return Response.json({ error: "No se pudo subir la foto. Intenta de nuevo." }, { status: 502 });
  }
}
