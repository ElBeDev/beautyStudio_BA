"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/content/site";

export function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openAt = (i: number) => {
    setActive(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setActive(null);
    d.addEventListener("keydown", onKey);
    d.addEventListener("close", onClose);
    return () => {
      d.removeEventListener("keydown", onKey);
      d.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = active !== null ? items[active] : null;

  return (
    <>
      {/* Cuadrícula pareja: todas las fotos del mismo tamaño y formato vertical. */}
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
        {items.map((item, i) => (
          <li key={item.src} className="aspect-[4/5]">
            <button
              type="button"
              onClick={() => openAt(i)}
              className="group relative block h-full w-full overflow-hidden"
              aria-label={`Ver foto: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                style={{ objectPosition: item.focus ?? "50% 22%" }}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Foto del portafolio"
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/95"
      >
        {current && (
          <div
            className="flex h-full w-full items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <figure>
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="max-h-[80dvh] w-auto object-contain"
              />
              <figcaption className="mt-4 text-center text-sm text-white/70 italic">{current.alt}</figcaption>
            </figure>
            <button onClick={close} aria-label="Cerrar" className="label absolute top-4 right-4 p-3 text-rosa">
              Cerrar +
            </button>
            <button
              onClick={() => step(-1)}
              aria-label="Foto anterior"
              className="label absolute bottom-4 left-4 p-3 text-white sm:top-1/2 sm:bottom-auto sm:left-6"
            >
              ← Ant.
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Foto siguiente"
              className="label absolute right-4 bottom-4 p-3 text-white sm:top-1/2 sm:right-6 sm:bottom-auto"
            >
              Sig. →
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
