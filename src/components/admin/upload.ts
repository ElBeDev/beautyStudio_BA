/**
 * Prepara y sube fotos desde el navegador.
 * Se achican a 3000 px por el lado largo y se convierten a JPEG: las fotos del celular
 * pasan de 5–10 MB a unos cientos de KB, y la orientación EXIF queda aplicada.
 */

export type Uploaded = { url: string; width: number; height: number };

const MAX_SIDE = 3000;
const QUALITY = 0.85;

async function resize(file: File) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`No se pudo leer “${file.name}”. Si es HEIC, expórtala como JPG e inténtalo de nuevo.`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no pudo procesar la foto.");
  ctx.fillStyle = "#fff"; // fondo para PNG con transparencia
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (!blob) throw new Error("Tu navegador no pudo procesar la foto.");
  return { blob, width, height };
}

export async function uploadPhoto(file: File): Promise<Uploaded> {
  const { blob, width, height } = await resize(file);
  const body = new FormData();
  body.append("file", blob, "foto.jpg");

  const res = await fetch("/api/admin/upload", { method: "POST", body });
  if (res.status === 401) throw new Error("Tu sesión expiró. Recarga la página y vuelve a entrar.");
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "No se pudo subir la foto.");
  return { url: data.url, width, height };
}
