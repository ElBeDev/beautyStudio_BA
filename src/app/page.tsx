import Image from "next/image";
import type { CSSProperties } from "react";
import { BookingForm } from "@/components/BookingForm";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { allServiceNames, firstName } from "@/content/site";
import { getContent } from "@/lib/content";
import { defaultMessage, serviceMessage, storeMessage, whatsappUrl } from "@/lib/whatsapp";

const pad = "px-4 sm:px-8";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const blockColors = ["bg-rosa", "bg-cream", "bg-rosa-soft", "bg-rosa"];

function Plus() {
  return (
    <span aria-hidden="true" className="text-xl leading-none font-light">
      +
    </span>
  );
}

/** "Beauty Studio DA" → Beauty / Studio DA, con la última palabra resaltada. */
function StudioName({ name, accent }: { name: string; accent?: string }) {
  const words = name.trim().split(/\s+/);
  const [first, ...rest] = words;
  const last = rest.pop();
  return (
    <>
      {first}
      {(rest.length > 0 || last) && <br className="lg:hidden" />}
      {rest.length > 0 && ` ${rest.join(" ")}`}
      {last && (
        <>
          {" "}
          <span className={accent}>{last}</span>
        </>
      )}
    </>
  );
}

/** "se queda en" → ["se queda", "en"]: la última palabra va a la derecha. */
const splitLine = (line: string): [string, string] => {
  const i = line.trim().lastIndexOf(" ");
  return i === -1 ? [line.trim(), ""] : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
};

const pos = (focus: string | undefined, fallback: string): CSSProperties => ({ objectPosition: focus ?? fallback });

export default async function Home() {
  const c = await getContent();
  const first = firstName(c);
  const wa = (msg?: string) => whatsappUrl(c.contact.whatsapp, msg);
  const allServices = c.serviceGroups.flatMap((g) => g.services);

  return (
    <>
      <Nav name={c.name} firstName={first} whatsapp={c.contact.whatsapp} />
      <main id="inicio">
        {/* PORTADA */}
        <section className="relative isolate flex h-svh min-h-[620px] flex-col justify-end overflow-hidden bg-vino text-white">
          <Image
            src={c.hero.image.src}
            alt={`${c.owner.name}, maquilladora y especialista en PMU, en sesión de estudio`}
            fill
            preload
            sizes="100vw"
            style={{ "--f": c.hero.image.focus ?? "50% 20%", "--fd": c.hero.focusDesktop } as CSSProperties}
            className="-z-20 object-cover object-[var(--f)] lg:object-[var(--fd)]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/5 to-black/15" />

          <p className={`display absolute top-24 right-0 text-2xl text-rosa sm:top-32 sm:text-4xl ${pad}`}>{c.owner.name}</p>

          {c.hero.labels.length > 0 && (
            <div className={`absolute inset-x-0 top-1/2 ${pad}`}>
              <div className="label flex justify-between border-b border-dashed border-white/70 pb-5 text-xs sm:text-sm">
                {c.hero.labels.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </div>
            </div>
          )}

          <h1 className={`display pb-20 text-[19vw] leading-[0.82] sm:pb-8 lg:text-[10.6vw] lg:whitespace-nowrap ${pad}`}>
            <StudioName name={c.name} accent="text-rosa" />
          </h1>
        </section>

        {/* CINTA */}
        {c.marquee.length > 0 && (
          <div className="overflow-hidden bg-rosa py-6 sm:py-8" aria-hidden="true">
            <div className="flex w-max animate-marquee">
              {[0, 1].map((n) => (
                <ul key={n} className="display flex shrink-0 text-2xl sm:text-3xl">
                  {c.marquee.map((m, i) => (
                    <li key={i} className="flex items-center whitespace-nowrap">
                      <span className="px-6">{m}</span>
                      <span>*</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}

        {/* PRESENTACIÓN */}
        <section className={`mx-auto max-w-5xl py-24 text-center sm:py-32 ${pad}`}>
          <h2 className="display text-3xl sm:text-5xl">
            {c.name} es el estudio de {c.owner.name}
          </h2>
          {c.intro.line1 && <p className="mt-4 text-2xl font-light italic sm:text-3xl">{c.intro.line1}</p>}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:gap-6">
            {c.intro.images.map((img, i) => (
              <div key={i} className="relative aspect-[4/5]">
                <Image src={img.src} alt="" fill sizes="(min-width: 768px) 320px, 50vw" style={pos(img.focus, "50% 30%")} className="object-cover" />
              </div>
            ))}
          </div>
          {(c.intro.line2 || c.intro.line3) && (
            <p className="mt-10 flex items-center justify-center gap-4 text-xl font-light italic sm:text-3xl">
              <span>{c.intro.line2}</span>
              <span className="h-px min-w-8 flex-1 bg-ink" />
              <span>{c.intro.line3}</span>
            </p>
          )}
        </section>

        {/* CATEGORÍAS */}
        <section aria-label="Categorías de servicios">
          {c.serviceGroups.map((g, i) => (
            <div key={g.id} className="grid lg:grid-cols-2">
              <div className={`relative aspect-[4/5] lg:aspect-[6/7] ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={g.image.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" style={pos(g.image.focus, "50% 25%")} className="object-cover" />
              </div>
              <div className={`flex flex-col items-center justify-between gap-12 px-6 py-16 text-center lg:py-24 ${blockColors[i % blockColors.length]}`}>
                <div>
                  <h3 className="display text-3xl sm:text-4xl">{g.title}</h3>
                  {g.subtitle && <p className="mt-3 text-lg font-light italic">{g.subtitle}</p>}
                </div>
                <a href={wa(serviceMessage(first, g.title))} {...ext} className="group flex flex-col items-center">
                  <span className="relative block aspect-[5/3] w-52 overflow-hidden">
                    <Image
                      src={g.thumb.src}
                      alt=""
                      fill
                      sizes="208px"
                      style={pos(g.thumb.focus, "50% 25%")}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="label mt-5 flex items-center gap-3">
                    Consultar <Plus />
                  </span>
                </a>
                <ul className="text-sm font-light italic">
                  {g.services.map((s, k) => (
                    <li key={k}>{s.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* PORTAFOLIO */}
        <section id="portafolio" className={`scroll-mt-0 bg-vino py-20 text-rosa-soft sm:py-28 ${pad}`}>
          <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="display text-3xl leading-[1.25] whitespace-pre-line sm:text-[2rem]">{c.portfolio.title}</h2>
              <p className="display mt-3 text-4xl text-rosa sm:text-[2.6rem]">
                Portafolio <sup className="font-sans text-lg font-light italic normal-case">{c.portfolio.items.length}</sup>
              </p>
              {c.contact.instagram.url && (
                <a
                  href={c.contact.instagram.url}
                  {...ext}
                  className="label mt-10 inline-flex items-center gap-3 border-b border-dashed border-rosa-soft/60 pb-2 hover:text-rosa"
                >
                  Más en {c.contact.instagram.handle} <Plus />
                </a>
              )}
            </div>
            <Portfolio items={c.portfolio.items} />
          </div>
        </section>

        {/* FRASE */}
        <section className="relative isolate overflow-hidden bg-black text-rosa">
          <Image src={c.quote.image.src} alt={c.quote.imageAlt} fill sizes="100vw" style={pos(c.quote.image.focus, "50% 28%")} className="-z-20 object-cover" />
          <div className="halftone absolute inset-0 -z-10" />
          <h2 className={`display grid min-h-[70svh] content-around py-16 text-4xl sm:text-5xl lg:min-h-[760px] ${pad}`}>
            {c.quote.lines.map(splitLine).map(([a, b], i) => (
              <span key={i} className="flex justify-between gap-6">
                <span>{a}</span>
                <span>{b}</span>
              </span>
            ))}
          </h2>
        </section>

        {/* SOBRE */}
        <section id="dailyn" className={`bg-petal py-20 sm:py-28 ${pad}`}>
          <h2 className="display text-3xl text-vino sm:text-[2rem]">{c.about.title}</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div className="relative aspect-[4/5]">
              <Image
                src={c.about.image.src}
                alt={`Retrato de ${c.owner.name}`}
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                style={pos(c.about.image.focus, "50% 0%")}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="display text-5xl sm:text-7xl">{c.owner.name}</p>
                <p className="mt-6 max-w-xl text-xl leading-relaxed font-light whitespace-pre-line italic">{c.about.text}</p>
              </div>
              {c.about.highlights.length > 0 && (
                <dl className="border-t border-dashed border-ink/50">
                  {c.about.highlights.map((h, i) => (
                    <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-ink/50 py-5">
                      <dt className="display text-2xl sm:text-3xl">{h.title}</dt>
                      <dd className="font-light italic">{h.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className={`bg-rosa-soft py-20 sm:py-24 ${pad}`}>
          <h2 className="display text-3xl text-vino sm:text-[2rem]">Servicios</h2>
          <ul className="mt-10 flex flex-wrap gap-x-12 gap-y-7 border-y border-dashed border-vino/60 py-10">
            {allServices.map((s, i) => (
              <li key={i}>
                <a href={wa(serviceMessage(first, s.name))} {...ext} className="group flex items-center gap-4">
                  <span className="display text-[clamp(1.6rem,3.7vw,3.4rem)] transition-colors group-hover:text-vino">{s.name}</span>
                  <span className="shrink-0 text-xs leading-5 text-muted sm:text-sm">
                    {s.tag && <span className="block capitalize">{s.tag}</span>}
                    <span className="block">Consultar +</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* TIENDA */}
        <section id="tienda" className={`bg-cream py-20 sm:py-24 ${pad}`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="display text-5xl whitespace-pre-line sm:text-7xl">{c.store.title}</h2>
              <p className="mt-5 max-w-lg text-xl font-light italic">{c.store.text}</p>
            </div>
            <a href={wa(storeMessage(first))} {...ext} className="label flex items-center justify-between gap-8 bg-ink px-6 py-5 text-rosa transition-colors hover:bg-vino">
              {c.store.button} <Plus />
            </a>
          </div>
        </section>

        {/* OPINIONES (solo si hay testimonios cargados) */}
        {c.testimonials.length > 0 && (
          <section className={`bg-white py-20 sm:py-24 ${pad}`}>
            <h2 className="display text-3xl text-vino sm:text-[2rem]">Opiniones</h2>
            <ul className="mt-10 grid gap-10 md:grid-cols-2">
              {c.testimonials.map((t, i) => (
                <li key={i} className="border-t border-dashed border-ink/50 pt-6">
                  <blockquote>
                    <p className="text-2xl leading-snug font-light italic">“{t.quote}”</p>
                    <footer className="label mt-5">{[t.author, t.context].filter(Boolean).join(" · ")}</footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CONTACTO */}
        <section id="contacto" className={`bg-white py-20 sm:py-28 ${pad}`}>
          <h2 className="display text-5xl sm:text-7xl">{c.booking.title}</h2>
          <p className="mt-4 text-xl font-light italic sm:text-2xl">{c.booking.subtitle}</p>
          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <BookingForm services={allServiceNames(c)} firstName={first} whatsapp={c.contact.whatsapp} />
            <div className="relative min-h-[360px] bg-rosa-soft">
              <iframe
                title={`Mapa de ${c.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(c.location.mapQuery)}&z=16&output=embed`}
                className="absolute inset-0 h-full w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className={`bg-black pt-20 pb-24 text-white sm:pb-10 ${pad}`}>
        <div className="grid gap-12 lg:grid-cols-2">
          <p className="display text-2xl leading-[1.3] text-rosa sm:text-[2rem]">
            Maquillaje, micropigmentación y estilismo en {c.location.city}
            {c.location.near && `, ${c.location.near.toLowerCase()}`}.
          </p>
          <address className="grid gap-8 not-italic sm:grid-cols-3">
            <div>
              <p className="label">Dirección</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {[c.location.street, c.location.reference, c.location.area].filter(Boolean).map((l, i) => (
                  <span key={i} className="block">
                    {l}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="label">WhatsApp</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                <a href={wa(defaultMessage(first))} {...ext} className="hover:text-rosa">
                  {c.contact.phoneDisplay}
                </a>
              </p>
            </div>
            <div>
              <p className="label">Redes</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {c.contact.instagram.url && (
                  <a href={c.contact.instagram.url} {...ext} className="block hover:text-rosa">
                    Instagram {c.contact.instagram.handle}
                  </a>
                )}
                {c.contact.tiktok.url && (
                  <a href={c.contact.tiktok.url} {...ext} className="block hover:text-rosa">
                    TikTok {c.contact.tiktok.handle}
                  </a>
                )}
              </p>
            </div>
          </address>
        </div>
        <div className="label mt-20 flex flex-wrap justify-between gap-4 border-t border-dashed border-rosa/70 pt-6 text-rosa">
          <span>{c.name}</span>
          <span>© {new Date().getFullYear()}</span>
          <span>{c.owner.name}</span>
        </div>
        <p aria-hidden="true" className="display mt-16 text-[19vw] leading-[0.82] lg:text-[10.6vw] lg:whitespace-nowrap">
          <StudioName name={c.name} />
        </p>
      </footer>
    </>
  );
}
