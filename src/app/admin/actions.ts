"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SiteContent } from "@/content/site";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG, hasBlobStore, listVersions, readVersion, writeContent, type Version } from "@/lib/content";
import { sanitizeContent } from "@/lib/sanitize";
import { SESSION_COOKIE, SESSION_DAYS, adminConfigured, checkPassword, createSessionToken } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Falta configurar ADMIN_PASSWORD en Vercel." };

  const password = String(form.get("password") ?? "");
  if (!(await checkPassword(password))) {
    // Frena los intentos de adivinar la contraseña.
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "Contraseña incorrecta." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export type SaveResult =
  | { ok: true; content: SiteContent; versions: Version[] }
  | { ok: false; error: string };

const NO_STORE =
  "Todavía no hay almacenamiento conectado. En Vercel: Storage → Create → Blob (público) y conéctalo a este proyecto.";

async function publish(content: SiteContent): Promise<SaveResult> {
  await writeContent(content);
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, content, versions: await listVersions() };
}

export async function saveContentAction(input: unknown): Promise<SaveResult> {
  await requireAdmin();
  if (!hasBlobStore()) return { ok: false, error: NO_STORE };
  try {
    return await publish(sanitizeContent(input));
  } catch (e) {
    console.error("saveContentAction", e);
    return { ok: false, error: "No se pudo guardar. Intenta de nuevo en un momento." };
  }
}

export async function restoreVersionAction(pathname: string): Promise<SaveResult> {
  await requireAdmin();
  if (!hasBlobStore()) return { ok: false, error: NO_STORE };
  try {
    const content = await readVersion(pathname);
    if (!content) return { ok: false, error: "Esa versión ya no existe." };
    return await publish(content);
  } catch (e) {
    console.error("restoreVersionAction", e);
    return { ok: false, error: "No se pudo restaurar. Intenta de nuevo en un momento." };
  }
}
