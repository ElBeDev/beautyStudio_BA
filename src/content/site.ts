/**
 * Modelo del contenido del sitio y sus valores iniciales.
 *
 * El contenido real se edita desde el panel (/admin) y se guarda en Vercel Blob.
 * `defaultContent` es el punto de partida: se usa mientras no se haya guardado nada
 * y para rellenar campos nuevos que todavía no existan en el contenido guardado.
 */

/** Foto con el punto que se conserva al recortarla (CSS object-position, ej. "50% 30%"). */
export type Photo = { src: string; focus?: string };

export type PortfolioItem = Photo & { alt: string; width: number; height: number };

export type Service = { name: string; tag: string; description: string };

export type ServiceGroup = {
  id: string;
  title: string;
  subtitle: string;
  image: Photo;
  thumb: Photo;
  services: Service[];
};

export type Testimonial = { quote: string; author: string; context: string };

export type Highlight = { title: string; text: string };

export type SiteContent = {
  name: string;
  description: string;
  owner: { name: string; title: string };
  contact: {
    phoneDisplay: string;
    whatsapp: string;
    instagram: { handle: string; url: string };
    tiktok: { handle: string; url: string };
  };
  location: {
    street: string;
    reference: string;
    area: string;
    city: string;
    region: string;
    near: string;
    mapQuery: string;
  };
  /** `image.focus` es el recorte en móvil; `focusDesktop`, en pantallas anchas. */
  hero: { image: Photo; focusDesktop: string; labels: string[] };
  marquee: string[];
  intro: { line1: string; line2: string; line3: string; images: Photo[] };
  serviceGroups: ServiceGroup[];
  portfolio: { title: string; items: PortfolioItem[] };
  quote: { lines: string[]; image: Photo; imageAlt: string };
  about: { title: string; text: string; image: Photo; highlights: Highlight[] };
  store: { title: string; text: string; button: string };
  testimonials: Testimonial[];
  booking: { title: string; subtitle: string };
};

export const defaultContent: SiteContent = {
  name: "Beauty Studio DA",
  description:
    "Beauty Studio DA de Dailyn Angulo: maquillaje y estilismo para toda ocasión, micropigmentación de cejas y labios, lifting de pestañas, uñas, hidratación capilar, depilación y tienda de maquillaje en San Antonio del Táchira, frontera con Cúcuta.",

  owner: {
    name: "Dailyn Angulo",
    title: "Especialista en PMU certificada",
  },

  contact: {
    phoneDisplay: "311 540 3780",
    whatsapp: "573115403780",
    instagram: { handle: "@beautystudio_da", url: "https://www.instagram.com/beautystudio_da/" },
    tiktok: { handle: "@beautystudio_da", url: "https://www.tiktok.com/@beautystudio_da" },
  },

  location: {
    street: "Avenida Primero de Mayo, frente a la CANTV",
    reference: "Antiguo local de Churromania",
    area: "Centro de San Antonio",
    city: "San Antonio del Táchira",
    region: "Táchira",
    near: "Frontera con Cúcuta",
    mapQuery: "Avenida 1ro de Mayo, San Antonio del Táchira, Táchira, Venezuela",
  },

  hero: {
    image: { src: "/images/hero.jpg", focus: "78% 20%" },
    focusDesktop: "50% 14%",
    labels: ["Maquillaje", "PMU", "Estilismo"],
  },

  marquee: ["Agenda tu cita", "Quinceañeras", "Novias", "Micropigmentación", "Cejas y pestañas", "Uñas", "Estilismo"],

  intro: {
    line1: "especialista en PMU certificada,",
    line2: "maquilladora profesional",
    line3: "+7 años de experiencia.",
    images: [
      { src: "/images/quince-1.jpg", focus: "50% 30%" },
      { src: "/images/novia-2.jpg", focus: "50% 30%" },
    ],
  },

  serviceGroups: [
    {
      id: "maquillaje",
      title: "Maquillaje y estilismo",
      subtitle: "Para toda ocasión",
      image: { src: "/images/glam-1.jpg" },
      thumb: { src: "/images/novia-1.jpg", focus: "50% 30%" },
      services: [
        {
          name: "Maquillaje para toda ocasión",
          tag: "quince · novias · social",
          description:
            "Quinceañeras, novias, grados, fiestas y sesiones de fotos. Un acabado pensado para durar y verse impecable en cámara.",
        },
        {
          name: "Estilismo para toda ocasión",
          tag: "peinados",
          description: "Ondas, recogidos y semirecogidos que acompañan tu maquillaje, tu vestido y el estilo de tu evento.",
        },
      ],
    },
    {
      id: "pmu",
      title: "Micropigmentación",
      subtitle: "Cejas y labios",
      image: { src: "/images/pmu-cejas-2.jpg", focus: "50% 35%" },
      thumb: { src: "/images/pmu-labios-1.jpg", focus: "50% 55%" },
      services: [
        {
          name: "Micropigmentación de cejas",
          tag: "PMU",
          description:
            "Cejas definidas y naturales todos los días, sin maquillarte. Realizada por especialista certificada en PMU.",
        },
        {
          name: "Micropigmentación de labios",
          tag: "PMU",
          description: "Color uniforme y contorno definido, con un tono elegido para ti.",
        },
      ],
    },
    {
      id: "mirada",
      title: "Cejas y pestañas",
      subtitle: "Diseño y lifting",
      image: { src: "/images/lash-lifting-2.jpg", focus: "50% 50%" },
      thumb: { src: "/images/cejas-henna.jpg", focus: "50% 38%" },
      services: [
        {
          name: "Diseño de cejas",
          tag: "a tu medida",
          description: "Un diseño pensado para la forma de tu rostro, que enmarca tu mirada.",
        },
        {
          name: "Lifting de pestañas",
          tag: "sin extensiones",
          description: "Curvatura y elevación para tus pestañas naturales.",
        },
      ],
    },
    {
      id: "cuidado",
      title: "Cabello, uñas y cuerpo",
      subtitle: "Hidratación, resina y depilación",
      image: { src: "/images/estilismo-ondas.jpg", focus: "50% 45%" },
      thumb: { src: "/images/estilismo-recogido.jpg", focus: "50% 40%" },
      services: [
        {
          name: "Uñas en resina y semipermanentes",
          tag: "manicure",
          description: "Manos cuidadas con acabado brillante, en resina o semipermanente.",
        },
        {
          name: "Hidrataciones capilares",
          tag: "tratamiento",
          description: "Tratamientos para devolverle brillo, suavidad y vida a tu cabello.",
        },
        {
          name: "Depilación corporal",
          tag: "cuerpo",
          description: "Piel suave, con atención en un espacio cómodo y privado.",
        },
      ],
    },
  ],

  portfolio: {
    title: "Trabajos que hablan\npor sí solos",
    items: [
      { src: "/images/quince-1.jpg", alt: "Maquillaje de quinceañera con corona", width: 1200, height: 1600 },
      { src: "/images/pmu-labios-2.jpg", alt: "Micropigmentación de labios", width: 900, height: 1600, focus: "50% 50%" },
      { src: "/images/novia-2.jpg", alt: "Maquillaje de novia con ondas largas", width: 900, height: 1600 },
      { src: "/images/estilismo-trenza.jpg", alt: "Estilismo: trenza con flores", width: 1200, height: 1600, focus: "50% 35%" },
      { src: "/images/social-2.jpg", alt: "Maquillaje social", width: 1200, height: 1600 },
      { src: "/images/pmu-cejas-1.jpg", alt: "Micropigmentación de cejas", width: 1200, height: 1600, focus: "50% 50%" },
      { src: "/images/quince-2.jpg", alt: "Maquillaje y peinado de quinceañera", width: 900, height: 1600 },
      { src: "/images/lash-lifting-1.jpg", alt: "Lash lifting", width: 1200, height: 1600, focus: "50% 50%" },
      { src: "/images/glam-2.jpg", alt: "Maquillaje glam", width: 900, height: 1600 },
      { src: "/images/social-1.jpg", alt: "Maquillaje social de noche", width: 900, height: 1600 },
      { src: "/images/estilismo-recogido.jpg", alt: "Estilismo: recogido", width: 1200, height: 1600, focus: "50% 40%" },
      { src: "/images/novia-1.jpg", alt: "Maquillaje de novia con velo", width: 900, height: 1600 },
    ],
  },

  quote: {
    lines: ["Belleza que", "se queda en", "la foto"],
    image: { src: "/images/quince-rojo.jpg", focus: "50% 28%" },
    imageAlt: "Quinceañera con vestido rojo y corona",
  },

  about: {
    title: "Detrás del estudio",
    text: "En Beauty Studio DA cada clienta recibe un trabajo pensado para ella: su rostro, su evento y su estilo.",
    image: { src: "/images/dailyn.jpg", focus: "50% 0%" },
    highlights: [
      { title: "+7 años", text: "Maquilladora profesional" },
      { title: "PMU", text: "Especialista certificada" },
      { title: "Todo en un lugar", text: "Maquillaje, peinado, cejas, uñas y tienda" },
    ],
  },

  store: {
    title: "Tienda de\nmaquillaje",
    text: "llévate tu look a casa: productos para tu día a día, disponibles en el estudio.",
    button: "Preguntar por productos",
  },

  testimonials: [],

  booking: {
    title: "Agenda tu cita",
    subtitle: "cuéntanos tu fecha y te respondemos por WhatsApp.",
  },
};

/** URL pública del sitio (canonical, sitemap, Open Graph). */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beautystudioda.com";

export const firstName = (c: SiteContent) => c.owner.name.trim().split(/\s+/)[0] ?? "";

export const allServiceNames = (c: SiteContent) => c.serviceGroups.flatMap((g) => g.services.map((s) => s.name));
