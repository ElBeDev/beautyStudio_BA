import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** ¿La petición actual tiene una sesión de administrador válida? */
export async function isAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** Para Server Actions y Route Handlers: corta la ejecución si no hay sesión. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("No autorizado");
}
