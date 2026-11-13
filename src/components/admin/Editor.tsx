"use client";

/* eslint-disable @next/next/no-img-element -- miniaturas del panel */

import { useEffect, useMemo, useState, useTransition } from "react";
import { logoutAction, restoreVersionAction, saveContentAction, type SaveResult } from "@/app/admin/actions";
import { blockLabel, resolveLayout, type Feature, type Photo, type PortfolioItem, type Service, type ServiceGroup, type SiteContent } from "@/content/site";
import type { Version } from "@/lib/content";
import { Card, Field, ItemControls, StringList, inputClass, moveItem, smallButton } from "./fields";
import { FocusEditor, PhotoField, UploadButton } from "./PhotoField";

const TABS = [
  ["portada", "Portada"],
  ["presentacion", "Presentación"],
  ["servicios", "Servicios"],
  ["orden", "Orden"],
  ["portafolio", "Portafolio"],
  ["frase", "Frase"],
  ["sobre", "Sobre ti"],
  ["tienda", "Tienda"],
  ["opiniones", "Opiniones"],
  ["contacto", "Contacto"],
  ["general", "General"],
  ["historial", "Historial"],
] as const;
type Tab = (typeof TABS)[number][0];

/** Posiciones del mosaico que salen grandes en computadora (ver Portfolio.tsx). */
const BIG_SLOTS = new Set([2, 6, 9]);

const PLACEHOLDER = "/images/og.jpg";

type Props = { initial: SiteContent; versions: Version[]; storeReady: boolean };

export function Editor({ initial, versions: initialVersions, storeReady }: Props) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [versions, setVersions] = useState(initialVersions);
  const [tab, setTab] = useState<Tab>("portada");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (notice?.kind !== "ok") return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  /** Edita una copia del contenido y la deja como estado nuevo. */
  const update = (fn: (draft: SiteContent) => void) =>
    setContent((c) => {
      const d = structuredClone(c);
      fn(d);
      return d;
    });

  /** `sent`: lo que se mandó a guardar. Si se siguió editando mientras tanto, esas ediciones se conservan. */
  const apply = (r: SaveResult, okText: string, sent?: SiteContent) => {
    if (!r.ok) return setNotice({ kind: "error", text: r.error });
    setContent((c) => (!sent || c === sent ? r.content : c));
    setSaved(r.content);
    setVersions(r.versions);
    setNotice({ kind: "ok", text: okText });
  };

  const save = () =>
    startTransition(async () => {
      const sent = content;
      try {
        apply(await saveContentAction(sent), "Cambios publicados en la web.", sent);
      } catch {
        setNotice({ kind: "error", text: "No se pudo guardar. Revisa tu conexión o vuelve a entrar." });
      }
    });

  const restore = (v: Version) => {
    if (!window.confirm(`¿Volver a la versión del ${formatDate(v.uploadedAt)}? Se publica de inmediato.`)) return;
    startTransition(async () => {
      try {
        apply(await restoreVersionAction(v.pathname), "Versión restaurada y publicada.");
      } catch {
        setNotice({ kind: "error", text: "No se pudo restaurar. Revisa tu conexión o vuelve a entrar." });
      }
    });
  };

  const onUploadError = (text: string) => setNotice({ kind: "error", text });

  return (
    <div className="min-h-svh bg-petal pb-32">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="label truncate">
            Panel <span className="text-muted">· {content.name}</span>
          </p>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={smallButton}>
              Ver web ↗
            </a>
            <form action={logoutAction}>
              <button type="submit" className={smallButton}>
                Salir
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Secciones" className="mx-auto max-w-5xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-1 pb-2">
            {TABS.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  aria-current={tab === id ? "page" : undefined}
                  onClick={() => setTab(id)}
                  className={`label whitespace-nowrap px-3 py-2 text-xs transition-colors ${
                    tab === id ? "bg-ink text-rosa" : "hover:bg-rosa-soft"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {!storeReady && (
          <p className="border border-vino/40 bg-rosa-soft p-4 text-sm">
            <strong>Falta conectar el almacenamiento.</strong> Puedes recorrer el panel, pero no guardar ni subir fotos hasta crear
            un Blob store público en Vercel (Storage → Create → Blob) y conectarlo a este proyecto.
          </p>
        )}

        {tab === "portada" && (
          <>
            <Card title="Foto de portada" hint="La foto grande del inicio. En celular se ve vertical y en computadora, horizontal.">
              <PhotoField
                label="Foto"
                value={content.hero.image}
                onChange={(p) => update((d) => void (d.hero.image = p))}
                previews={[{ label: "Celular", aspect: "9/16" }]}
              />
              <div className="grid gap-3">
                <p className="label text-xs">Recorte en computadora</p>
                <FocusEditor
                  src={content.hero.image.src}
                  focus={content.hero.focusDesktop}
                  onChange={(f) => update((d) => void (d.hero.focusDesktop = f))}
                  previews={[{ label: "Computadora", aspect: "16/9" }]}
                />
              </div>
            </Card>
            <Card title="Textos de portada">
              <StringList
                label="Palabras sobre la línea punteada"
                items={content.hero.labels}
                max={4}
                onChange={(v) => update((d) => void (d.hero.labels = v))}
              />
              <StringList
                label="Cinta rosa (texto que se desplaza)"
                items={content.marquee}
                max={12}
                onChange={(v) => update((d) => void (d.marquee = v))}
              />
            </Card>
          </>
        )}

        {tab === "presentacion" && (
          <Card title="Presentación" hint={`El título dice: “${content.name} es el estudio de ${content.owner.name}”. Nombre y estudio se cambian en General.`}>
            <Field label="Línea 1 (debajo del título)" value={content.intro.line1} onChange={(v) => update((d) => void (d.intro.line1 = v))} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Línea 2 (izquierda)" value={content.intro.line2} onChange={(v) => update((d) => void (d.intro.line2 = v))} />
              <Field label="Línea 2 (derecha)" value={content.intro.line3} onChange={(v) => update((d) => void (d.intro.line3 = v))} />
            </div>
            {content.intro.images.map((img, i) => (
              <PhotoField
                key={i}
                label={`Foto ${i + 1}`}
                value={img}
                onChange={(p) => update((d) => void (d.intro.images[i] = p))}
                previews={[{ label: "Recorte", aspect: "4/5" }]}
              />
            ))}
          </Card>
        )}

        {tab === "servicios" && (
          <>
            <ServicesTab groups={content.serviceGroups} update={update} />
            <FeaturesTab content={content} update={update} />
          </>
        )}

        {tab === "orden" && <OrderTab content={content} update={update} />}

        {tab === "portafolio" && <PortfolioTab portfolio={content.portfolio} update={update} onError={onUploadError} />}

        {tab === "frase" && (
          <Card title="Frase sobre foto" hint="Cada línea se reparte a los dos lados: la última palabra va a la derecha.">
            <StringList label="Líneas" items={content.quote.lines} max={4} onChange={(v) => update((d) => void (d.quote.lines = v))} />
            <PhotoField
              label="Foto de fondo"
              value={content.quote.image}
              onChange={(p) => update((d) => void (d.quote.image = p))}
              previews={[
                { label: "Celular", aspect: "3/4" },
                { label: "Computadora", aspect: "16/9" },
              ]}
            />
            <Field
              label="Descripción de la foto"
              hint="Para lectores de pantalla y Google."
              value={content.quote.imageAlt}
              onChange={(v) => update((d) => void (d.quote.imageAlt = v))}
            />
          </Card>
        )}

        {tab === "sobre" && (
          <Card title="Detrás del estudio">
            <Field label="Título" value={content.about.title} onChange={(v) => update((d) => void (d.about.title = v))} />
            <Field label="Texto" rows={4} maxLength={800} value={content.about.text} onChange={(v) => update((d) => void (d.about.text = v))} />
            <PhotoField
              label="Retrato"
              value={content.about.image}
              onChange={(p) => update((d) => void (d.about.image = p))}
              previews={[{ label: "Recorte", aspect: "4/5" }]}
            />
            <div className="grid gap-3">
              <p className="label text-xs">Datos destacados</p>
              {content.about.highlights.map((h, i) => (
                <div key={i} className="grid gap-3 border border-ink/10 p-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                  <Field label="Dato" value={h.title} onChange={(v) => update((d) => void (d.about.highlights[i].title = v))} />
                  <Field label="Detalle" value={h.text} onChange={(v) => update((d) => void (d.about.highlights[i].text = v))} />
                  <ItemControls
                    index={i}
                    count={content.about.highlights.length}
                    onMove={(a, b) => update((d) => void (d.about.highlights = moveItem(d.about.highlights, a, b)))}
                    onRemove={(j) => update((d) => void d.about.highlights.splice(j, 1))}
                  />
                </div>
              ))}
              {content.about.highlights.length < 6 && (
                <button
                  type="button"
                  className={`${smallButton} justify-self-start`}
                  onClick={() => update((d) => void d.about.highlights.push({ title: "", text: "" }))}
                >
                  + Agregar dato
                </button>
              )}
            </div>
          </Card>
        )}

        {tab === "tienda" && (
          <Card title="Tienda de maquillaje">
            <Field label="Título" rows={2} hint="Usa Enter para partir la línea." value={content.store.title} onChange={(v) => update((d) => void (d.store.title = v))} />
            <Field label="Texto" rows={3} maxLength={400} value={content.store.text} onChange={(v) => update((d) => void (d.store.text = v))} />
            <Field label="Texto del botón" value={content.store.button} onChange={(v) => update((d) => void (d.store.button = v))} />
          </Card>
        )}

        {tab === "opiniones" && (
          <Card title="Opiniones de clientas" hint="La sección aparece en la web solo cuando hay al menos una opinión.">
            {content.testimonials.map((t, i) => (
              <div key={i} className="grid gap-3 border border-ink/10 p-4">
                <Field label="Opinión" rows={3} maxLength={600} value={t.quote} onChange={(v) => update((d) => void (d.testimonials[i].quote = v))} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre" value={t.author} onChange={(v) => update((d) => void (d.testimonials[i].author = v))} />
                  <Field
                    label="Servicio o evento"
                    placeholder="XV años, novia…"
                    value={t.context}
                    onChange={(v) => update((d) => void (d.testimonials[i].context = v))}
                  />
                </div>
                <ItemControls
                  index={i}
                  count={content.testimonials.length}
                  onMove={(a, b) => update((d) => void (d.testimonials = moveItem(d.testimonials, a, b)))}
                  onRemove={(j) => update((d) => void d.testimonials.splice(j, 1))}
                  confirmText="¿Quitar esta opinión?"
                />
              </div>
            ))}
            <button
              type="button"
              className={`${smallButton} justify-self-start`}
              onClick={() => update((d) => void d.testimonials.push({ quote: "", author: "", context: "" }))}
            >
              + Agregar opinión
            </button>
          </Card>
        )}

        {tab === "contacto" && (
          <>
            <Card title="WhatsApp y redes">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Teléfono (como se muestra)"
                  inputMode="tel"
                  value={content.contact.phoneDisplay}
                  onChange={(v) => update((d) => void (d.contact.phoneDisplay = v))}
                />
                <Field
                  label="Número de WhatsApp"
                  inputMode="numeric"
                  hint="Con código de país y sin espacios. Ej: 573115403780"
                  value={content.contact.whatsapp}
                  onChange={(v) => update((d) => void (d.contact.whatsapp = v.replace(/\D/g, "")))}
                />
                <Field
                  label="Instagram (usuario)"
                  value={content.contact.instagram.handle}
                  onChange={(v) => update((d) => void (d.contact.instagram.handle = v))}
                />
                <Field
                  label="Instagram (enlace)"
                  inputMode="url"
                  value={content.contact.instagram.url}
                  onChange={(v) => update((d) => void (d.contact.instagram.url = v))}
                />
                <Field label="TikTok (usuario)" value={content.contact.tiktok.handle} onChange={(v) => update((d) => void (d.contact.tiktok.handle = v))} />
                <Field
                  label="TikTok (enlace)"
                  inputMode="url"
                  value={content.contact.tiktok.url}
                  onChange={(v) => update((d) => void (d.contact.tiktok.url = v))}
                />
              </div>
            </Card>
            <Card title="Dirección">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Calle" value={content.location.street} onChange={(v) => update((d) => void (d.location.street = v))} />
                <Field label="Referencia" value={content.location.reference} onChange={(v) => update((d) => void (d.location.reference = v))} />
                <Field label="Zona" value={content.location.area} onChange={(v) => update((d) => void (d.location.area = v))} />
                <Field label="Ciudad" value={content.location.city} onChange={(v) => update((d) => void (d.location.city = v))} />
                <Field label="Estado" value={content.location.region} onChange={(v) => update((d) => void (d.location.region = v))} />
                <Field label="Cerca de" value={content.location.near} onChange={(v) => update((d) => void (d.location.near = v))} />
              </div>
              <Field
                label="Búsqueda del mapa"
                hint="Una dirección o las coordenadas exactas del local (ej. 7.8146,-72.4430)."
                value={content.location.mapQuery}
                onChange={(v) => update((d) => void (d.location.mapQuery = v))}
              />
            </Card>
            <Card title="Sección “Agenda tu cita”">
              <Field label="Título" value={content.booking.title} onChange={(v) => update((d) => void (d.booking.title = v))} />
              <Field label="Subtítulo" value={content.booking.subtitle} onChange={(v) => update((d) => void (d.booking.subtitle = v))} />
            </Card>
          </>
        )}

        {tab === "general" && (
          <Card title="General">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre del estudio" value={content.name} onChange={(v) => update((d) => void (d.name = v))} />
              <Field
                label="Tu nombre"
                hint="El primer nombre se usa en los mensajes de WhatsApp y en el menú."
                value={content.owner.name}
                onChange={(v) => update((d) => void (d.owner.name = v))}
              />
            </div>
            <Field label="Tu título profesional" value={content.owner.title} onChange={(v) => update((d) => void (d.owner.title = v))} />
            <Field
              label="Descripción para Google y redes"
              rows={4}
              maxLength={320}
              hint="Es lo que aparece en los resultados de Google y al compartir el enlace."
              value={content.description}
              onChange={(v) => update((d) => void (d.description = v))}
            />
          </Card>
        )}

        {tab === "historial" && (
          <Card title="Historial" hint="Cada vez que guardas se crea una copia. Se conservan las últimas 30.">
            {versions.length === 0 ? (
              <p className="text-sm text-muted">Todavía no hay versiones guardadas.</p>
            ) : (
              <ul className="divide-y divide-dashed divide-ink/20">
                {versions.map((v, i) => (
                  <li key={v.pathname} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span>
                      {formatDate(v.uploadedAt)}
                      {i === 0 && <span className="label ml-3 text-xs text-vino">Publicada</span>}
                    </span>
                    {i > 0 && (
                      <button type="button" className={smallButton} disabled={pending} onClick={() => restore(v)}>
                        Restaurar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </main>

      {/* Barra de guardado */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p role="status" className={`text-sm ${notice?.kind === "error" ? "text-vino" : "text-muted"}`}>
            {notice?.text ?? (dirty ? "Tienes cambios sin guardar." : "Todo está publicado.")}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button
                type="button"
                className={smallButton}
                disabled={pending}
                onClick={() => window.confirm("¿Descartar los cambios sin guardar?") && setContent(saved)}
              >
                Descartar
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || pending || !storeReady}
              className="label flex items-center gap-4 bg-ink px-6 py-3 text-rosa transition-colors hover:bg-vino disabled:opacity-40"
            >
              {pending ? "Guardando…" : "Guardar y publicar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });
}

/* ───────────── Servicios ───────────── */

/**
 * Las pestañas reciben `update`, que siempre parte del estado más reciente:
 * así una foto que termina de subir no pisa lo que se escribió mientras tanto.
 */
type Update = (fn: (draft: SiteContent) => void) => void;

function ServicesTab({ groups, update }: { groups: ServiceGroup[]; update: Update }) {
  const setGroup = (i: number, fn: (g: ServiceGroup) => void) =>
    update((d) => {
      if (d.serviceGroups[i]) fn(d.serviceGroups[i]);
    });
  const onChange = (fn: (g: ServiceGroup[]) => ServiceGroup[]) => update((d) => void (d.serviceGroups = fn(d.serviceGroups)));

  return (
    <>
      <p className="text-sm text-muted">
        Cada categoría es un bloque con foto en la página. Sus servicios aparecen en la lista de servicios y en el formulario para
        agendar.
      </p>
      {groups.map((g, i) => (
        <Card
          key={g.id}
          title={g.title || "Categoría sin nombre"}
          actions={
            <ItemControls
              index={i}
              count={groups.length}
              onMove={(a, b) => onChange((gs) => moveItem(gs, a, b))}
              onRemove={(j) => onChange((gs) => gs.filter((_, k) => k !== j))}
              removeLabel="Quitar categoría"
              confirmText={`¿Quitar la categoría “${g.title}” con todos sus servicios?`}
            />
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Título" value={g.title} onChange={(v) => setGroup(i, (d) => void (d.title = v))} />
            <Field label="Subtítulo" value={g.subtitle} onChange={(v) => setGroup(i, (d) => void (d.subtitle = v))} />
          </div>
          <PhotoField
            label="Foto grande"
            value={g.image}
            onChange={(p) => setGroup(i, (d) => void (d.image = p))}
            previews={[{ label: "Recorte", aspect: "4/5" }]}
          />
          <Field
            label="Texto (opcional)"
            hint="Sale debajo del subtítulo. Escribe lo que quieras: detalles, precios, promociones…"
            rows={3}
            maxLength={600}
            value={g.description}
            onChange={(v) => setGroup(i, (d) => void (d.description = v))}
          />
          <OptionalPhoto
            label="Foto pequeña (encima del botón)"
            addLabel="+ Agregar foto pequeña"
            hint="Opcional: si la quitas, el bloque queda solo con texto."
            aspect="5/3"
            value={g.thumb ?? undefined}
            onChange={(p) => setGroup(i, (d) => void (d.thumb = p ?? null))}
          />
          <Field
            label="Texto del botón"
            hint="Abre WhatsApp. Déjalo vacío para no mostrar botón."
            value={g.button}
            maxLength={40}
            onChange={(v) => setGroup(i, (d) => void (d.button = v))}
          />
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-ink"
              checked={g.showList}
              onChange={(e) => setGroup(i, (d) => void (d.showList = e.target.checked))}
            />
            Mostrar los nombres de los servicios al pie del bloque
          </label>
          <div className="grid gap-3 border-t border-dashed border-ink/20 pt-5">
            <p className="label text-xs">Servicios</p>
            {g.services.map((s, k) => (
              <div key={k} className="grid gap-3 border border-ink/10 p-3">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                  <Field label="Nombre" value={s.name} onChange={(v) => setGroup(i, (d) => void (d.services[k].name = v))} />
                  <Field label="Etiqueta" value={s.tag} onChange={(v) => setGroup(i, (d) => void (d.services[k].tag = v))} />
                </div>
                <Field
                  label="Descripción"
                  rows={2}
                  maxLength={400}
                  value={s.description}
                  onChange={(v) => setGroup(i, (d) => void (d.services[k].description = v))}
                />
                <MoveTo
                  groups={groups}
                  current={i}
                  onMove={(to) => update((d) => moveService(d, { group: i, index: k }, to))}
                />
                <OptionalPhoto
                  label="Foto del servicio"
                  addLabel="+ Agregar foto"
                  hint="Opcional: sale junto al nombre en la lista de servicios."
                  aspect="4/5"
                  value={s.image}
                  onChange={(p) =>
                    setGroup(i, (d) => {
                      if (p) d.services[k].image = p;
                      else delete d.services[k].image;
                    })
                  }
                />
                <ItemControls
                  index={k}
                  count={g.services.length}
                  onMove={(a, b) => setGroup(i, (d) => void (d.services = moveItem(d.services, a, b)))}
                  onRemove={(j) => setGroup(i, (d) => void d.services.splice(j, 1))}
                  confirmText={`¿Quitar “${s.name || "este servicio"}”?`}
                />
              </div>
            ))}
            <button
              type="button"
              className={`${smallButton} justify-self-start`}
              onClick={() => setGroup(i, (d) => void d.services.push({ name: "", tag: "", description: "" }))}
            >
              + Agregar servicio
            </button>
          </div>
        </Card>
      ))}
      {groups.length < 8 && (
        <button
          type="button"
          className={`${smallButton} justify-self-start`}
          onClick={() =>
            onChange((gs) => [
              ...gs,
              {
                id: `grupo-${Date.now()}`,
                title: "Nueva categoría",
                subtitle: "",
                description: "",
                image: { src: PLACEHOLDER },
                thumb: null,
                button: "Consultar",
                showList: true,
                services: [],
              },
            ])
          }
        >
          + Agregar categoría
        </button>
      )}
    </>
  );
}

/** Destino de un servicio: el índice de una categoría o "suelto" (bloque propio). */
type Destination = number | "suelto";

const isPlaceholder = (p: Photo) => p.src === PLACEHOLDER;

/** Saca un servicio de donde está (categoría o servicio suelto) y lo pone en `to`. */
function moveService(d: SiteContent, from: { group: number; index: number } | { feature: number }, to: Destination) {
  let s: Service;
  if ("feature" in from) {
    const [f] = d.features.splice(from.feature, 1);
    if (!f) return;
    s = { name: f.name, tag: f.tag, description: f.description, ...(isPlaceholder(f.image) ? {} : { image: f.image }) };
  } else {
    const [found] = d.serviceGroups[from.group]?.services.splice(from.index, 1) ?? [];
    if (!found) return;
    s = found;
  }
  if (to === "suelto") {
    d.features.push({ id: `suelto-${Date.now()}`, name: s.name, tag: s.tag, description: s.description, image: s.image ?? { src: PLACEHOLDER } });
  } else {
    d.serviceGroups[to]?.services.push(s);
  }
}

/** Menú para mandar un servicio a otra categoría o dejarlo como bloque propio. */
function MoveTo({ groups, current, onMove }: { groups: ServiceGroup[]; current: Destination; onMove: (to: Destination) => void }) {
  const others = groups.map((g, j) => [j, g.title || "Categoría sin nombre"] as const).filter(([j]) => j !== current);
  return (
    <label className="flex flex-wrap items-center gap-2 text-xs">
      <span className="label">Mover a</span>
      <select
        className={`${inputClass} w-auto max-w-full py-1.5 text-sm`}
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (v) onMove(v === "suelto" ? "suelto" : Number(v));
        }}
      >
        <option value="">Elegir…</option>
        {others.map(([j, title]) => (
          <option key={j} value={j}>
            Categoría: {title}
          </option>
        ))}
        {current !== "suelto" && <option value="suelto">Servicio suelto (bloque propio con foto)</option>}
      </select>
    </label>
  );
}

/* ───────────── Servicios sueltos ───────────── */

function FeaturesTab({ content, update }: { content: SiteContent; update: Update }) {
  const { features, serviceGroups } = content;
  const setFeature = (i: number, fn: (f: Feature) => void) =>
    update((d) => {
      if (d.features[i]) fn(d.features[i]);
    });

  return (
    <Card
      title="Servicios sueltos"
      hint="Servicios que no van dentro de una categoría: cada uno sale como un bloque propio con foto, descripción y botón para agendar. Lo puedes acomodar en cualquier parte de la página desde la pestaña Orden."
    >
      {features.map((f, i) => (
        <div key={f.id} className="grid gap-4 border border-ink/10 p-4">
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <Field label="Nombre" value={f.name} onChange={(v) => setFeature(i, (d) => void (d.name = v))} />
            <Field label="Etiqueta" value={f.tag} onChange={(v) => setFeature(i, (d) => void (d.tag = v))} />
          </div>
          <Field
            label="Descripción"
            rows={3}
            maxLength={600}
            value={f.description}
            onChange={(v) => setFeature(i, (d) => void (d.description = v))}
          />
          <PhotoField label="Foto" value={f.image} onChange={(p) => setFeature(i, (d) => void (d.image = p))} previews={[{ label: "Recorte", aspect: "4/5" }]} />
          <MoveTo groups={serviceGroups} current="suelto" onMove={(to) => update((d) => moveService(d, { feature: i }, to))} />
          <ItemControls
            index={i}
            count={features.length}
            onMove={(a, b) => update((d) => void (d.features = moveItem(d.features, a, b)))}
            onRemove={(j) => update((d) => void d.features.splice(j, 1))}
            confirmText={`¿Quitar “${f.name || "este servicio"}”?`}
          />
        </div>
      ))}
      {features.length < 12 && (
        <button
          type="button"
          className={`${smallButton} justify-self-start`}
          onClick={() =>
            update((d) => void d.features.push({ id: `suelto-${Date.now()}`, name: "", tag: "", description: "", image: { src: PLACEHOLDER } }))
          }
        >
          + Agregar servicio suelto
        </button>
      )}
      <p className="text-xs text-muted">Un servicio sin nombre no se guarda. Sube una foto propia: mientras no la cambies sale una de muestra.</p>
    </Card>
  );
}

/* ───────────── Orden de la página ───────────── */

function OrderTab({ content, update }: { content: SiteContent; update: Update }) {
  const layout = resolveLayout(content);
  return (
    <Card
      title="Orden de la página"
      hint="Sube o baja cada bloque para acomodarlo donde quieras. La portada siempre va primero y el pie de página al final."
    >
      <ol className="grid gap-2">
        {layout.map((key, i) => {
          const { kind, name } = blockLabel(content, key);
          return (
            <li key={key} className="flex flex-wrap items-center justify-between gap-3 border border-ink/10 px-3 py-2.5">
              <span className="min-w-0">
                <span className="label block text-[0.7rem] text-muted">{kind}</span>
                <span className="block truncate">{name}</span>
              </span>
              <ItemControls index={i} count={layout.length} onMove={(a, b) => update((d) => void (d.layout = moveItem(resolveLayout(d), a, b)))} />
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        className={`${smallButton} justify-self-start`}
        onClick={() => window.confirm("¿Volver al orden original de la página?") && update((d) => void (d.layout = []))}
      >
        Restablecer orden
      </button>
    </Card>
  );
}

/** Foto opcional: se puede agregar, cambiar o quitar. */
function OptionalPhoto({
  label,
  addLabel,
  hint,
  aspect,
  value,
  onChange,
}: {
  label: string;
  addLabel: string;
  hint: string;
  aspect: string;
  value?: Photo;
  onChange: (p: Photo | undefined) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  if (!value) {
    return (
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton
            label={addLabel}
            onUploaded={(u) => {
              setError(null);
              onChange({ src: u.url });
            }}
            onError={setError}
          />
          <span className="text-xs text-muted">{hint}</span>
        </div>
        {error && <p className="text-sm text-vino">{error}</p>}
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      <PhotoField label={label} value={value} onChange={onChange} previews={[{ label: "Recorte", aspect }]} />
      <button type="button" className={`${smallButton} justify-self-start text-vino`} onClick={() => onChange(undefined)}>
        Quitar foto
      </button>
    </div>
  );
}

/* ───────────── Portafolio ───────────── */

function PortfolioTab({
  portfolio: { title, items },
  update,
  onError,
}: {
  portfolio: SiteContent["portfolio"];
  update: Update;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const onItems = (fn: (items: PortfolioItem[]) => PortfolioItem[]) =>
    update((d) => void (d.portfolio.items = fn(d.portfolio.items)));
  const set = (i: number, patch: Partial<PortfolioItem>) =>
    onItems((list) => list.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <Card
      title="Portafolio"
      hint="El orden es el del mosaico. En computadora, las fotos 3, 7 y 10 salen grandes. Las fotos nuevas entran al principio."
      actions={
        <UploadButton
          label="+ Agregar fotos"
          multiple
          onUploaded={(u) => onItems((list) => [{ src: u.url, alt: "", width: u.width, height: u.height }, ...list])}
          onError={onError}
        />
      }
    >
      <Field label="Título de la sección" rows={2} hint="Usa Enter para partir la línea." value={title} onChange={(v) => update((d) => void (d.portfolio.title = v))} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => {
          const open = editing === it.src;
          return (
            <li key={it.src} className={`grid content-start gap-2 border border-ink/10 bg-white p-2 ${open ? "col-span-full" : ""}`}>
              {open ? (
                <FocusEditor
                  src={it.src}
                  focus={it.focus}
                  onChange={(focus) => set(i, { focus })}
                  previews={[{ label: "En el mosaico", aspect: "1/1" }]}
                />
              ) : (
                <div className="relative aspect-square overflow-hidden bg-ink/5">
                  <img
                    src={it.src}
                    alt={it.alt}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: it.focus ?? "50% 22%" }}
                  />
                  <span className="label absolute top-1.5 left-1.5 bg-white px-1.5 py-0.5 text-xs">
                    {i + 1}
                    {BIG_SLOTS.has(i % 12) && " · grande"}
                  </span>
                </div>
              )}
              <input
                aria-label={`Descripción de la foto ${i + 1}`}
                className={`${inputClass} py-2 text-sm`}
                placeholder="Descripción (ej. Maquillaje de novia)"
                value={it.alt}
                onChange={(e) => set(i, { alt: e.target.value })}
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className={smallButton}
                  disabled={i === 0}
                  onClick={() => onItems((list) => moveItem(list, i, i - 1))}
                  aria-label="Mover antes"
                >
                  ←
                </button>
                <button
                  type="button"
                  className={smallButton}
                  disabled={i === items.length - 1}
                  onClick={() => onItems((list) => moveItem(list, i, i + 1))}
                  aria-label="Mover después"
                >
                  →
                </button>
                <button type="button" className={smallButton} onClick={() => setEditing(open ? null : it.src)}>
                  {open ? "Listo" : "Recorte"}
                </button>
                <button
                  type="button"
                  className={`${smallButton} text-vino`}
                  onClick={() => window.confirm("¿Quitar esta foto del portafolio?") && onItems((list) => list.filter((_, j) => j !== i))}
                >
                  Quitar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {items.length === 0 && <p className="text-sm text-muted">No hay fotos. Usa “Agregar fotos”.</p>}
    </Card>
  );
}
