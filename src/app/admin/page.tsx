import { redirect } from "next/navigation";
import { Editor } from "@/components/admin/Editor";
import { isAdmin } from "@/lib/auth";
import { hasBlobStore, listVersions, readContentFresh } from "@/lib/content";

async function load() {
  try {
    const [content, versions] = await Promise.all([readContentFresh(), listVersions()]);
    return { content, versions };
  } catch (e) {
    console.error("admin: no se pudo leer el contenido", e);
    return null;
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const data = await load();
  if (!data) {
    return (
      <main className="grid min-h-svh place-items-center bg-petal p-6 text-center">
        <div className="max-w-md">
          <h1 className="display text-3xl">No se pudo cargar el contenido</h1>
          <p className="mt-4 text-muted">Puede ser un problema momentáneo con el almacenamiento. Recarga la página en un momento.</p>
        </div>
      </main>
    );
  }
  return <Editor initial={data.content} versions={data.versions} storeReady={hasBlobStore()} />;
}
