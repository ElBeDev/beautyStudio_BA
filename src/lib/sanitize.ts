import {
  defaultContent,
  type Feature,
  type Highlight,
  type Photo,
  type PortfolioItem,
  type Service,
  type ServiceGroup,
  type SiteContent,
  type Testimonial,
} from "@/content/site";

/**
 * Convierte cualquier valor (lo que manda el panel o lo que hay guardado en Blob)
 * en un `SiteContent` válido. Lo que falte o no tenga el tipo correcto toma el valor
 * de `fallback`, así que el contenido guardado sigue funcionando si el modelo crece.
 */

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});

const str = (v: unknown, fallback: string, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : fallback);

const list = <T>(v: unknown, fallback: T[], max: number, item: (x: unknown, i: number) => T | null): T[] =>
  Array.isArray(v) ? v.slice(0, max).map(item).filter((x): x is T => x !== null) : fallback;

/** Fotos permitidas: las del proyecto (`/images/…`) o las subidas al Blob del sitio (`…/uploads/…`). */
const PHOTO_SRC = /^(\/images\/[\w.-]+|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/uploads\/[\w.-]+)$/i;
export const isAllowedPhotoSrc = (src: string) => PHOTO_SRC.test(src);

const FOCUS = /^\d{1,3}(\.\d{1,2})?% \d{1,3}(\.\d{1,2})?%$/;
const focus = (v: unknown, fallback?: string) => (typeof v === "string" && FOCUS.test(v) ? v : fallback);

const photo = (v: unknown, fallback: Photo): Photo => {
  const o = obj(v);
  const src = typeof o.src === "string" && isAllowedPhotoSrc(o.src) ? o.src : fallback.src;
  const f = focus(o.focus, src === fallback.src ? fallback.focus : undefined);
  return f ? { src, focus: f } : { src };
};

const httpsUrl = (v: unknown, fallback: string) => {
  const s = str(v, fallback, 300);
  if (s === "") return "";
  try {
    return new URL(s).protocol === "https:" ? s : fallback;
  } catch {
    return fallback;
  }
};

const int = (v: unknown, fallback: number, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : fallback;

const emptyPhoto: Photo = { src: "/images/og.jpg" };

const service = (v: unknown): Service | null => {
  const o = obj(v);
  const name = str(o.name, "", 80);
  if (!name) return null;
  const base = { name, tag: str(o.tag, "", 60), description: str(o.description, "", 400) };
  const img = obj(o.image);
  if (typeof img.src !== "string" || !isAllowedPhotoSrc(img.src)) return base;
  const f = focus(img.focus);
  return { ...base, image: f ? { src: img.src, focus: f } : { src: img.src } };
};

const serviceGroup = (v: unknown, i: number, fallback: ServiceGroup[]): ServiceGroup | null => {
  const o = obj(v);
  const fb = fallback[i];
  const title = str(o.title, fb?.title ?? "", 80);
  if (!title) return null;
  const id = str(o.id, fb?.id ?? "", 40).replace(/[^\w-]/g, "") || `grupo-${i + 1}`;
  return {
    id,
    title,
    subtitle: str(o.subtitle, fb?.subtitle ?? "", 120),
    image: photo(o.image, fb?.image ?? emptyPhoto),
    thumb: photo(o.thumb, fb?.thumb ?? emptyPhoto),
    services: list(o.services, fb?.services ?? [], 12, service),
  };
};

const feature = (v: unknown, i: number): Feature | null => {
  const o = obj(v);
  const name = str(o.name, "", 80);
  if (!name) return null;
  return {
    id: str(o.id, "", 40).replace(/[^\w-]/g, "") || `suelto-${i + 1}`,
    name,
    tag: str(o.tag, "", 60),
    description: str(o.description, "", 600),
    image: photo(o.image, emptyPhoto),
  };
};

const BLOCK_KEY = /^[\w:-]{1,60}$/;

const portfolioItem = (v: unknown): PortfolioItem | null => {
  const o = obj(v);
  if (typeof o.src !== "string" || !isAllowedPhotoSrc(o.src)) return null;
  const f = focus(o.focus);
  return {
    src: o.src,
    alt: str(o.alt, "", 160),
    width: int(o.width, 1200, 1, 10000),
    height: int(o.height, 1600, 1, 10000),
    ...(f ? { focus: f } : {}),
  };
};

const testimonial = (v: unknown): Testimonial | null => {
  const o = obj(v);
  const quote = str(o.quote, "", 600);
  if (!quote) return null;
  return { quote, author: str(o.author, "", 80), context: str(o.context, "", 80) };
};

const highlight = (v: unknown): Highlight | null => {
  const o = obj(v);
  const title = str(o.title, "", 60);
  if (!title) return null;
  return { title, text: str(o.text, "", 160) };
};

const words = (v: unknown, fallback: string[], max: number, maxLen = 60) =>
  list(v, fallback, max, (x) => {
    const s = str(x, "", maxLen);
    return s ? s : null;
  });

export function sanitizeContent(input: unknown, fallback: SiteContent = defaultContent): SiteContent {
  const c = obj(input);
  const owner = obj(c.owner);
  const contact = obj(c.contact);
  const ig = obj(contact.instagram);
  const tt = obj(contact.tiktok);
  const loc = obj(c.location);
  const hero = obj(c.hero);
  const intro = obj(c.intro);
  const portfolio = obj(c.portfolio);
  const quote = obj(c.quote);
  const about = obj(c.about);
  const store = obj(c.store);
  const booking = obj(c.booking);
  const F = fallback;

  const introImages = Array.isArray(intro.images) ? intro.images : [];

  return {
    name: str(c.name, F.name, 60) || F.name,
    description: str(c.description, F.description, 320),
    owner: {
      name: str(owner.name, F.owner.name, 80) || F.owner.name,
      title: str(owner.title, F.owner.title, 120),
    },
    contact: {
      phoneDisplay: str(contact.phoneDisplay, F.contact.phoneDisplay, 30),
      whatsapp: str(contact.whatsapp, F.contact.whatsapp, 20).replace(/\D/g, "") || F.contact.whatsapp,
      instagram: { handle: str(ig.handle, F.contact.instagram.handle, 60), url: httpsUrl(ig.url, F.contact.instagram.url) },
      tiktok: { handle: str(tt.handle, F.contact.tiktok.handle, 60), url: httpsUrl(tt.url, F.contact.tiktok.url) },
    },
    location: {
      street: str(loc.street, F.location.street, 120),
      reference: str(loc.reference, F.location.reference, 120),
      area: str(loc.area, F.location.area, 120),
      city: str(loc.city, F.location.city, 80),
      region: str(loc.region, F.location.region, 80),
      near: str(loc.near, F.location.near, 80),
      mapQuery: str(loc.mapQuery, F.location.mapQuery, 200),
    },
    hero: {
      image: photo(hero.image, F.hero.image),
      focusDesktop: focus(hero.focusDesktop, F.hero.focusDesktop) ?? F.hero.focusDesktop,
      labels: words(hero.labels, F.hero.labels, 4, 24),
    },
    marquee: words(c.marquee, F.marquee, 12, 40),
    intro: {
      line1: str(intro.line1, F.intro.line1, 120),
      line2: str(intro.line2, F.intro.line2, 120),
      line3: str(intro.line3, F.intro.line3, 120),
      images: [0, 1].map((i) => photo(introImages[i], F.intro.images[i] ?? emptyPhoto)),
    },
    serviceGroups: list(c.serviceGroups, F.serviceGroups, 8, (x, i) => serviceGroup(x, i, F.serviceGroups)),
    features: list(c.features, F.features, 12, feature),
    layout: list(c.layout, F.layout, 80, (x) => (typeof x === "string" && BLOCK_KEY.test(x) ? x : null)),
    portfolio: {
      title: str(portfolio.title, F.portfolio.title, 120),
      items: list(portfolio.items, F.portfolio.items, 60, portfolioItem),
    },
    quote: {
      lines: words(quote.lines, F.quote.lines, 4, 40),
      image: photo(quote.image, F.quote.image),
      imageAlt: str(quote.imageAlt, F.quote.imageAlt, 160),
    },
    about: {
      title: str(about.title, F.about.title, 80),
      text: str(about.text, F.about.text, 800),
      image: photo(about.image, F.about.image),
      highlights: list(about.highlights, F.about.highlights, 6, highlight),
    },
    store: {
      title: str(store.title, F.store.title, 80),
      text: str(store.text, F.store.text, 400),
      button: str(store.button, F.store.button, 60) || F.store.button,
    },
    testimonials: list(c.testimonials, F.testimonials, 24, testimonial),
    booking: {
      title: str(booking.title, F.booking.title, 80),
      subtitle: str(booking.subtitle, F.booking.subtitle, 200),
    },
  };
}
