"use client";

/* eslint-disable @next/next/no-img-element -- vista previa del panel: se muestran las fotos tal cual */

import { useRef, useState, type MouseEvent } from "react";
import type { Photo } from "@/content/site";
import { smallButton } from "./fields";
import { uploadPhoto, type Uploaded } from "./upload";

export const DEFAULT_FOCUS = "50% 25%";

type Preview = { label: string; aspect: string };

/** Toca la foto para marcar lo que no se puede cortar; al lado se ve cómo queda el recorte. */
export function FocusEditor({
  src,
  focus,
  onChange,
  previews,
}: {
  src: string;
  focus?: string;
  onChange: (focus: string) => void;
  previews: Preview[];
}) {
  const current = focus ?? DEFAULT_FOCUS;
  const [x, y] = current.split(" ").map((v) => parseFloat(v));

  const pick = (e: MouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = Math.round(((e.clientX - r.left) / r.width) * 100);
    const py = Math.round(((e.clientY - r.top) / r.height) * 100);
    onChange(`${Math.min(100, Math.max(0, px))}% ${Math.min(100, Math.max(0, py))}%`);
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="relative inline-block">
        <img
          src={src}
          alt=""
          onClick={pick}
          className="block max-h-72 w-auto max-w-full cursor-crosshair bg-ink/5"
          title="Toca el punto más importante de la foto"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgb(0_0_0/0.6)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {previews.map((p) => (
          <figure key={p.label} className="grid gap-1">
            <div className="h-36 overflow-hidden bg-ink/5" style={{ aspectRatio: p.aspect }}>
              <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: current }} />
            </div>
            <figcaption className="text-xs text-muted">{p.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function UploadButton({
  label = "Cambiar foto",
  multiple,
  onUploaded,
  onError,
}: {
  label?: string;
  multiple?: boolean;
  onUploaded: (u: Uploaded) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setProgress({ done: 0, total: list.length });
    for (const [i, file] of list.entries()) {
      try {
        onUploaded(await uploadPhoto(file));
      } catch (e) {
        onError(e instanceof Error ? e.message : "No se pudo subir la foto.");
      }
      setProgress({ done: i + 1, total: list.length });
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => onFiles(e.target.files)}
      />
      <button type="button" className={smallButton} disabled={!!progress} onClick={() => inputRef.current?.click()}>
        {progress ? `Subiendo ${Math.min(progress.done + 1, progress.total)} de ${progress.total}…` : label}
      </button>
    </>
  );
}

export function PhotoField({
  label,
  hint,
  value,
  onChange,
  previews,
}: {
  label: string;
  hint?: string;
  value: Photo;
  onChange: (p: Photo) => void;
  previews: Preview[];
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid gap-3 border-t border-dashed border-ink/20 pt-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label text-xs">{label}</p>
          <p className="mt-1 text-xs text-muted">{hint ?? "Toca la foto para marcar la parte que siempre debe verse."}</p>
        </div>
        <UploadButton
          onUploaded={(u) => {
            setError(null);
            onChange({ src: u.url });
          }}
          onError={setError}
        />
      </div>
      {error && <p className="text-sm text-vino">{error}</p>}
      <FocusEditor src={value.src} focus={value.focus} onChange={(focus) => onChange({ ...value, focus })} previews={previews} />
    </div>
  );
}
