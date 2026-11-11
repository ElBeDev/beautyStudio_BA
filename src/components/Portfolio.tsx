"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { portfolio } from "@/content/site";

/**
 * Posición de cada foto en el mosaico de escritorio (4 columnas): columna, fila y tamaño.
 * En móvil se ignora y las fotos fluyen en 2 columnas.
 */
const slots: { c: number; r: number; s: 1 | 2 }[] = [
  { c: 1, r: 1, s: 1 },
  { c: 4, r: 1, s: 1 },
  { c: 2, r: 2, s: 2 },
  { c: 1, r: 4, s: 1 },
  { c: 4, r: 4, s: 1 },
  { c: 3, r: 5, s: 1 },
  { c: 1, r: 6, s: 2 },
  { c: 4, r: 7, s: 1 },
  { c: 3, r: 8, s: 1 },
  { c: 1, r: 9, s: 2 },
  { c: 4, r: 9, s: 1 },
  { c: 3, r: 11, s: 1 },
];

export function Portfolio() {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = portfolio;

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
      <ul className="grid grid-flow-dense grid-cols-2 lg:grid-flow-row lg:grid-cols-4">
        {items.map((item, i) => {
          const slot = slots[i % slots.length];
          const big = slot.s === 2;
          return (
            <li
              key={item.src}
              style={{ "--c": slot.c, "--r": slot.r, "--s": slot.s } as CSSProperties}
              className={`aspect-square ${big ? "col-span-2 row-span-2" : ""} lg:[grid-column:var(--c)_/_span_var(--s)] lg:[grid-row:var(--r)_/_span_var(--s)]`}
            >
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
                  sizes={big ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 17vw, 50vw"}
                  style={{ objectPosition: item.focus ?? "50% 22%" }}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            </li>
          );
        })}
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
