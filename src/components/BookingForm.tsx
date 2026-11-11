"use client";

import { useState } from "react";
import { allServiceNames } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";

const field =
  "w-full rounded-none border-0 border-b border-dashed border-ink/50 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/40 placeholder:italic focus:border-solid focus:border-ink focus:outline-none";

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
}

export function BookingForm() {
  const [name, setName] = useState("");
  const [service, setService] = useState(allServiceNames[0]);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `Hola Dailyn, ${name.trim() ? `soy ${name.trim()} y ` : ""}quiero agendar una cita.`,
      `Servicio: ${service}`,
      date ? `Fecha: ${formatDate(date)}` : null,
      notes.trim() ? `Detalles: ${notes.trim()}` : null,
    ].filter(Boolean);
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-7">
      <label className="grid gap-1">
        <span className="label">Tu nombre</span>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" placeholder="¿Cómo te llamas?" />
      </label>
      <label className="grid gap-1">
        <span className="label">Servicio</span>
        <select className={`${field} cursor-pointer`} value={service} onChange={(e) => setService(e.target.value)}>
          {allServiceNames.map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>Tienda de maquillaje</option>
          <option>Otro / no estoy segura</option>
        </select>
      </label>
      <label className="grid gap-1">
        <span className="label">Fecha deseada</span>
        <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="grid gap-1">
        <span className="label">Detalles (opcional)</span>
        <textarea
          rows={2}
          className={`${field} resize-none`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tipo de evento, hora, si necesitas peinado…"
        />
      </label>
      <button
        type="submit"
        className="label mt-2 flex items-center justify-between bg-ink px-6 py-5 text-rosa transition-colors hover:bg-vino"
      >
        Enviar por WhatsApp
        <span aria-hidden="true" className="text-xl leading-none font-light">
          +
        </span>
      </button>
      <p className="text-sm text-muted italic">Se abre WhatsApp con tu mensaje listo. Dailyn te confirma disponibilidad.</p>
    </form>
  );
}
