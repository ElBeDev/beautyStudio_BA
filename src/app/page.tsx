import Image from "next/image";
import { BookingForm } from "@/components/BookingForm";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { portfolio, serviceGroups, site, testimonials } from "@/content/site";
import { defaultMessage, serviceMessage, whatsappUrl } from "@/lib/whatsapp";

const pad = "px-4 sm:px-8";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const marquee = ["Agenda tu cita", "Quinceañeras", "Novias", "Micropigmentación", "Cejas y pestañas", "Uñas", "Estilismo"];
const blockColors = ["bg-rosa", "bg-cream", "bg-rosa-soft", "bg-rosa"];
const storeMessage = "Hola Dailyn, quiero preguntar por productos de la tienda de maquillaje.";

function Plus() {
  return (
    <span aria-hidden="true" className="text-xl leading-none font-light">
      +
    </span>
  );
}

export default function Home() {
  const allServices = serviceGroups.flatMap((g) => g.services);

  return (
    <>
      <Nav />
      <main id="inicio">
        {/* PORTADA */}
        <section className="relative isolate flex h-svh min-h-[620px] flex-col justify-end overflow-hidden bg-vino text-white">
          <Image
            src="/images/hero.jpg"
            alt={`${site.owner.name}, maquilladora y especialista en PMU, en sesión de estudio`}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[78%_20%] lg:object-[50%_14%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/5 to-black/15" />

          <p className={`display absolute top-24 right-0 text-2xl text-rosa sm:top-32 sm:text-4xl ${pad}`}>
            {site.owner.name}
          </p>

          <div className={`absolute inset-x-0 top-1/2 ${pad}`}>
            <div className="label flex justify-between border-b border-dashed border-white/70 pb-5 text-xs sm:text-sm">
              <span>Maquillaje</span>
              <span>PMU</span>
              <span>Estilismo</span>
            </div>
          </div>

          <h1 className={`display pb-20 text-[19vw] leading-[0.82] sm:pb-8 lg:text-[10.6vw] lg:whitespace-nowrap ${pad}`}>
            Beauty <br className="lg:hidden" />
            Studio <span className="text-rosa">DA</span>
          </h1>
        </section>

        {/* CINTA */}
        <div className="overflow-hidden bg-rosa py-6 sm:py-8" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((n) => (
              <ul key={n} className="display flex shrink-0 text-2xl sm:text-3xl">
                {marquee.map((m) => (
                  <li key={m} className="flex items-center whitespace-nowrap">
                    <span className="px-6">{m}</span>
                    <span>*</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* PRESENTACIÓN */}
        <section className={`mx-auto max-w-5xl py-24 text-center sm:py-32 ${pad}`}>
          <h2 className="display text-3xl sm:text-5xl">Beauty Studio DA es el estudio de {site.owner.name}</h2>
          <p className="mt-4 text-2xl font-light italic sm:text-3xl">especialista en PMU certificada,</p>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:gap-6">
            {["/images/quince-1.jpg", "/images/novia-2.jpg"].map((src) => (
              <div key={src} className="relative aspect-[4/5]">
                <Image src={src} alt="" fill sizes="(min-width: 768px) 320px, 50vw" className="object-cover object-[50%_30%]" />
              </div>
            ))}
          </div>
          <p className="mt-10 flex items-center justify-center gap-4 text-xl font-light italic sm:text-3xl">
            <span>maquilladora profesional</span>
            <span className="h-px min-w-8 flex-1 bg-ink" />
            <span>+{site.owner.yearsExperience} años de experiencia.</span>
          </p>
        </section>

        {/* CATEGORÍAS */}
        <section aria-label="Categorías de servicios">
          {serviceGroups.map((g, i) => (
            <div key={g.id} className="grid lg:grid-cols-2">
              <div className={`relative aspect-[4/5] lg:aspect-[6/7] ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={g.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" style={{ objectPosition: g.imageFocus ?? "50% 25%" }} className="object-cover" />
              </div>
              <div className={`flex flex-col items-center justify-between gap-12 px-6 py-16 text-center lg:py-24 ${blockColors[i % blockColors.length]}`}>
                <div>
                  <h3 className="display text-3xl sm:text-4xl">{g.title}</h3>
                  <p className="mt-3 text-lg font-light italic">{g.subtitle}</p>
                </div>
                <a href={whatsappUrl(serviceMessage(g.title))} {...ext} className="group flex flex-col items-center">
                  <span className="relative block aspect-[5/3] w-52 overflow-hidden">
                    <Image src={g.thumb} alt="" fill sizes="208px" style={{ objectPosition: g.thumbFocus ?? "50% 25%" }} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </span>
                  <span className="label mt-5 flex items-center gap-3">
                    Consultar <Plus />
                  </span>
                </a>
                <ul className="text-sm font-light italic">
                  {g.services.map((s) => (
                    <li key={s.name}>{s.name}</li>
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
              <h2 className="display text-3xl leading-[1.25] sm:text-[2rem]">
                Trabajos que hablan
                <br />
                por sí solos
              </h2>
              <p className="display mt-3 text-4xl text-rosa sm:text-[2.6rem]">
                Portafolio <sup className="font-sans text-lg font-light italic normal-case">{portfolio.length}</sup>
              </p>
              <a href={site.contact.instagram.url} {...ext} className="label mt-10 inline-flex items-center gap-3 border-b border-dashed border-rosa-soft/60 pb-2 hover:text-rosa">
                Más en {site.contact.instagram.handle} <Plus />
              </a>
            </div>
            <Portfolio />
          </div>
        </section>

        {/* FRASE */}
        <section className="relative isolate overflow-hidden bg-black text-rosa">
          <Image src="/images/quince-rojo.jpg" alt="Quinceañera con vestido rojo y corona" fill sizes="100vw" className="-z-20 object-cover object-[50%_28%]" />
          <div className="halftone absolute inset-0 -z-10" />
          <h2 className={`display grid min-h-[70svh] content-around py-16 text-4xl sm:text-5xl lg:min-h-[760px] ${pad}`}>
            {[
              ["Belleza", "que"],
              ["se queda", "en"],
              ["la", "foto"],
            ].map(([a, b]) => (
              <span key={a} className="flex justify-between">
                <span>{a}</span>
                <span>{b}</span>
              </span>
            ))}
          </h2>
        </section>

        {/* DAILYN */}
        <section id="dailyn" className={`bg-petal py-20 sm:py-28 ${pad}`}>
          <h2 className="display text-3xl text-vino sm:text-[2rem]">Detrás del estudio</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div className="relative aspect-[4/5]">
              <Image src="/images/dailyn.jpg" alt={`Retrato de ${site.owner.name}`} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover object-top" />
            </div>
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="display text-5xl sm:text-7xl">{site.owner.name}</p>
                <p className="mt-6 max-w-xl text-xl leading-relaxed font-light italic">
                  En Beauty Studio DA cada clienta recibe un trabajo pensado para ella: su rostro, su evento y su estilo.
                </p>
              </div>
              <dl className="border-t border-dashed border-ink/50">
                {[
                  [`+${site.owner.yearsExperience} años`, "Maquilladora profesional"],
                  ["PMU", "Especialista certificada"],
                  ["Todo en un lugar", "Maquillaje, peinado, cejas, uñas y tienda"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-dashed border-ink/50 py-5">
                    <dt className="display text-2xl sm:text-3xl">{k}</dt>
                    <dd className="font-light italic">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className={`bg-rosa-soft py-20 sm:py-24 ${pad}`}>
          <h2 className="display text-3xl text-vino sm:text-[2rem]">Servicios</h2>
          <ul className="mt-10 flex flex-wrap gap-x-12 gap-y-7 border-y border-dashed border-vino/60 py-10">
            {allServices.map((s) => (
              <li key={s.name}>
                <a href={whatsappUrl(serviceMessage(s.name))} {...ext} className="group flex items-center gap-4">
                  <span className="display text-[clamp(1.6rem,3.7vw,3.4rem)] transition-colors group-hover:text-vino">{s.name}</span>
                  <span className="shrink-0 text-xs leading-5 text-muted sm:text-sm">
                    <span className="block capitalize">{s.tag}</span>
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
              <h2 className="display text-5xl sm:text-7xl">
                Tienda de <br />
                maquillaje
              </h2>
              <p className="mt-5 max-w-lg text-xl font-light italic">
                llévate tu look a casa: productos para tu día a día, disponibles en el estudio.
              </p>
            </div>
            <a href={whatsappUrl(storeMessage)} {...ext} className="label flex items-center justify-between gap-8 bg-ink px-6 py-5 text-rosa transition-colors hover:bg-vino">
              Preguntar por productos <Plus />
            </a>
          </div>
        </section>

        {/* OPINIONES (solo si hay testimonios cargados) */}
        {testimonials.length > 0 && (
          <section className={`bg-white py-20 sm:py-24 ${pad}`}>
            <h2 className="display text-3xl text-vino sm:text-[2rem]">Opiniones</h2>
            <ul className="mt-10 grid gap-10 md:grid-cols-2">
              {testimonials.map((t) => (
                <li key={t.author} className="border-t border-dashed border-ink/50 pt-6">
                  <blockquote>
                    <p className="text-2xl leading-snug font-light italic">“{t.quote}”</p>
                    <footer className="label mt-5">
                      {t.author} · {t.context}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CONTACTO */}
        <section id="contacto" className={`bg-white py-20 sm:py-28 ${pad}`}>
          <h2 className="display text-5xl sm:text-7xl">Agenda tu cita</h2>
          <p className="mt-4 text-xl font-light italic sm:text-2xl">cuéntanos tu fecha y te respondemos por WhatsApp.</p>
          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <BookingForm />
            <div className="relative min-h-[360px] bg-rosa-soft">
              <iframe
                title={`Mapa de ${site.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.location.mapQuery)}&z=16&output=embed`}
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
            Maquillaje, micropigmentación y estilismo en {site.location.city}, {site.location.near.toLowerCase()}.
          </p>
          <address className="grid gap-8 not-italic sm:grid-cols-3">
            <div>
              <p className="label">Dirección</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {site.location.street}
                <br />
                {site.location.reference}
                <br />
                {site.location.area}
              </p>
            </div>
            <div>
              <p className="label">WhatsApp</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                <a href={whatsappUrl(defaultMessage)} {...ext} className="hover:text-rosa">
                  {site.contact.phoneDisplay}
                </a>
              </p>
            </div>
            <div>
              <p className="label">Redes</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                <a href={site.contact.instagram.url} {...ext} className="hover:text-rosa">
                  Instagram {site.contact.instagram.handle}
                </a>
                <br />
                <a href={site.contact.tiktok.url} {...ext} className="hover:text-rosa">
                  TikTok {site.contact.tiktok.handle}
                </a>
              </p>
            </div>
          </address>
        </div>
        <div className="label mt-20 flex flex-wrap justify-between gap-4 border-t border-dashed border-rosa/70 pt-6 text-rosa">
          <span>{site.name}</span>
          <span>© {new Date().getFullYear()}</span>
          <span>{site.owner.name}</span>
        </div>
        <p aria-hidden="true" className="display mt-16 text-[19vw] leading-[0.82] lg:text-[10.6vw] lg:whitespace-nowrap">
          Beauty <br className="lg:hidden" />
          Studio DA
        </p>
      </footer>
    </>
  );
}
