export function whatsappUrl(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultMessage = (firstName: string) => `Hola ${firstName}, vi tu página y quiero agendar una cita.`;

export const serviceMessage = (firstName: string, service: string) =>
  `Hola ${firstName}, vi tu página y quiero información para agendar: ${service}.`;

export const storeMessage = (firstName: string) => `Hola ${firstName}, quiero preguntar por productos de la tienda de maquillaje.`;
