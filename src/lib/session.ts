/**
 * Sesión del panel: una cookie firmada con HMAC-SHA256.
 * La clave se deriva de ADMIN_PASSWORD (y ADMIN_SESSION_SECRET si existe), así que
 * cambiar la contraseña cierra todas las sesiones abiertas.
 * Solo usa Web Crypto, para funcionar igual en Proxy, Server Actions y Route Handlers.
 */

export const SESSION_COOKIE = "bsda_admin";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

async function key() {
  const secret = `${process.env.ADMIN_PASSWORD ?? ""}::${process.env.ADMIN_SESSION_SECRET ?? "beauty-studio-da"}`;
  const raw = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(payload: string) {
  return b64url(await crypto.subtle.sign("HMAC", await key(), enc.encode(payload)));
}

/** Compara en tiempo constante, para no filtrar información por el tiempo de respuesta. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${await sign(`admin.${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(`admin.${exp}`));
}

export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Se comparan los HMAC (mismo largo) en lugar de los textos.
  const [a, b] = await Promise.all([sign(`pw.${input}`), sign(`pw.${expected}`)]);
  return safeEqual(a, b);
}
