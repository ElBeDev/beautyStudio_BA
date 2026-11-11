import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";
import { adminConfigured } from "@/lib/session";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-svh place-items-center bg-rosa-soft p-4">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <p className="label text-muted">Panel</p>
        <h1 className="display mt-2 text-3xl">Entrar</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 text-sm text-vino">
            Falta configurar la variable <code>ADMIN_PASSWORD</code> en Vercel (Settings → Environment Variables) y volver a
            publicar.
          </p>
        )}
      </div>
    </main>
  );
}
