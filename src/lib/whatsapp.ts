import { site } from "@/content/site";

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function serviceMessage(service: string) {
  return `Hola Dailyn, vi tu página y quiero información para agendar: ${service}.`;
}

export const defaultMessage = "Hola Dailyn, vi tu página y quiero agendar una cita.";
