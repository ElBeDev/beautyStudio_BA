/**
 * Todo el contenido del sitio vive aquí.
 * Para cambiar textos, servicios, fotos o datos de contacto, edita solo este archivo.
 */

export const site = {
  name: "Beauty Studio DA",
  tagline: "Maquillaje · PMU · Estilismo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://beautystudioda.com",
  description:
    "Beauty Studio DA de Dailyn Angulo: maquillaje y estilismo para toda ocasión, micropigmentación de cejas y labios, lifting de pestañas, uñas, hidratación capilar, depilación y tienda de maquillaje en San Antonio del Táchira, frontera con Cúcuta.",

  owner: {
    name: "Dailyn Angulo",
    titles: [
      "Especialista en PMU certificada",
      "Maquilladora profesional con más de 7 años de experiencia",
    ],
    yearsExperience: 7,
  },

  contact: {
    phoneDisplay: "311 540 3780",
    phoneE164: "+573115403780",
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
    country: "VE",
    near: "Frontera con Cúcuta",
    // Reemplazar por las coordenadas exactas del local (ej. "7.8146,-72.4430") cuando se tengan.
    mapQuery: "Avenida 1ro de Mayo, San Antonio del Táchira, Táchira, Venezuela",
  },
} as const;

export type PortfolioItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Punto de la foto que se conserva al recortarla en cuadrado (por defecto, la parte alta). */
  focus?: string;
};

/** El orden importa: define la posición de cada foto en el mosaico (las posiciones 3, 7 y 10 salen grandes). */
export const portfolio: PortfolioItem[] = [
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
];

export type Service = { name: string; tag: string; description: string };
export type ServiceGroup = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  /** Punto de la foto que se conserva al recortar. */
  imageFocus?: string;
  thumb: string;
  thumbFocus?: string;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "maquillaje",
    title: "Maquillaje y estilismo",
    subtitle: "Para toda ocasión",
    image: "/images/glam-1.jpg",
    thumb: "/images/novia-1.jpg",
    thumbFocus: "50% 30%",
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
        description:
          "Ondas, recogidos y semirecogidos que acompañan tu maquillaje, tu vestido y el estilo de tu evento.",
      },
    ],
  },
  {
    id: "pmu",
    title: "Micropigmentación",
    subtitle: "Cejas y labios",
    image: "/images/pmu-cejas-2.jpg",
    imageFocus: "50% 35%",
    thumb: "/images/pmu-labios-1.jpg",
    thumbFocus: "50% 55%",
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
    image: "/images/lash-lifting-2.jpg",
    imageFocus: "50% 50%",
    thumb: "/images/cejas-henna.jpg",
    thumbFocus: "50% 38%",
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
    image: "/images/estilismo-ondas.jpg",
    imageFocus: "50% 45%",
    thumb: "/images/estilismo-recogido.jpg",
    thumbFocus: "50% 40%",
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
];

export const allServiceNames = serviceGroups.flatMap((g) => g.services.map((s) => s.name));

/**
 * Testimonios reales de clientas. La sección se oculta mientras esta lista esté vacía.
 * Ejemplo: { quote: "…", author: "Valentina", context: "XV años", photo: "/images/social-1.jpg" }
 */
export const testimonials: { quote: string; author: string; context: string; photo?: string }[] = [];
