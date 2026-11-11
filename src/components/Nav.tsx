"use client";

import { useEffect, useState } from "react";
import { defaultMessage, whatsappUrl } from "@/lib/whatsapp";

/** Caja flotante con el nombre y el menú, y botón fijo para agendar. */
export function Nav({ name, firstName, whatsapp }: { name: string; firstName: string; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#servicios", label: "Servicios" },
    { href: "#portafolio", label: "Portafolio" },
    { href: "#dailyn", label: firstName || "Nosotras" },
    { href: "#tienda", label: "Tienda" },
    { href: "#contacto", label: "Contacto" },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-40 bg-white text-ink shadow-sm sm:top-6 sm:right-auto sm:left-8 sm:w-[300px]">
        <div className="flex h-11 items-center justify-between pl-4">
          <a href="#inicio" className="label" onClick={() => setOpen(false)}>
            {name}
          </a>
          <button
            type="button"
            className="relative flex h-11 w-14 items-center justify-center"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-6 bg-ink transition-transform ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-px w-6 bg-ink transition-transform ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
        <nav id="menu" aria-label="Principal" hidden={!open} className="border-t border-dashed border-ink/40 px-4 pb-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display flex items-center justify-between border-b border-dashed border-ink/25 py-3.5 text-2xl last:border-b-0 hover:text-vino"
            >
              {l.label}
              <span aria-hidden="true" className="text-base font-light">
                +
              </span>
            </a>
          ))}
        </nav>
      </header>

      <a
        href={whatsappUrl(whatsapp, defaultMessage(firstName))}
        target="_blank"
        rel="noopener noreferrer"
        className="label fixed right-4 bottom-4 z-30 flex items-center gap-4 bg-ink px-6 py-3.5 text-rosa transition-colors hover:bg-vino sm:right-6 sm:bottom-6"
      >
        Agendar cita
        <span aria-hidden="true" className="text-xl leading-none font-light">
          +
        </span>
      </a>
    </>
  );
}
