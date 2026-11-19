import type { SiteContent } from "@/content/site";

export function whatsappUrl(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Dirección corta para los mensajes: calle (referencia), ciudad. Sale de Contacto → Dirección en el panel. */
export function addressText(loc: SiteContent["location"]) {
  const street = [loc.street, loc.reference && `(${loc.reference.charAt(0).toLowerCase()}${loc.reference.slice(1)})`].filter(Boolean).join(" ");
  return [street, loc.city].filter(Boolean).join(", ");
}

/** Mensaje del botón "Agendar cita" y del WhatsApp del pie. */
export const defaultMessage = (loc: SiteContent["location"]) => {
  const address = addressText(loc);
  return address ? `Hola, quiero agendar cita en tu local ubicado en ${address}.` : "Hola, quiero agendar cita.";
};

export const serviceMessage = (firstName: string, service: string) =>
  `Hola ${firstName}, vi tu página y quiero información para agendar: ${service}.`;

export const storeMessage = (firstName: string) => `Hola ${firstName}, quiero preguntar por productos de la tienda de maquillaje.`;
