"use client";

import { useId, type ReactNode } from "react";

export const inputClass =
  "w-full border border-ink/20 bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none";

export const smallButton =
  "label inline-flex items-center gap-2 border border-ink/25 bg-white px-3 py-2 text-xs transition-colors hover:border-ink disabled:opacity-40";

export function Card({ title, hint, children, actions }: { title: string; hint?: ReactNode; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="border border-ink/10 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="display text-xl sm:text-2xl">{title}</h2>
          {hint && <p className="mt-1.5 max-w-2xl text-sm text-muted">{hint}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: ReactNode;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  inputMode?: "text" | "tel" | "url" | "numeric";
};

export function Field({ label, value, onChange, hint, placeholder, maxLength, rows, inputMode }: FieldProps) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="label text-xs">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          className={`${inputClass} resize-y`}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className={inputClass}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {(hint || (maxLength && rows)) && (
        <p className="flex justify-between gap-4 text-xs text-muted">
          <span>{hint}</span>
          {maxLength && rows ? (
            <span className="shrink-0 tabular-nums">
              {value.length}/{maxLength}
            </span>
          ) : null}
        </p>
      )}
    </div>
  );
}

/** Botones para mover / quitar un elemento de una lista. */
export function ItemControls({
  index,
  count,
  onMove,
  onRemove,
  removeLabel = "Quitar",
  confirmText,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (i: number) => void;
  removeLabel?: string;
  confirmText?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={smallButton} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Mover antes">
        ↑
      </button>
      <button
        type="button"
        className={smallButton}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label="Mover después"
      >
        ↓
      </button>
      <button
        type="button"
        className={`${smallButton} text-vino`}
        onClick={() => (!confirmText || window.confirm(confirmText)) && onRemove(index)}
      >
        {removeLabel}
      </button>
    </div>
  );
}

/** Lista de textos cortos (cinta, etiquetas, líneas de la frase). */
export function StringList({
  label,
  hint,
  items,
  onChange,
  max,
  placeholder,
}: {
  label: string;
  hint?: ReactNode;
  items: string[];
  onChange: (items: string[]) => void;
  max: number;
  placeholder?: string;
}) {
  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  const move = (from: number, to: number) => onChange(moveItem(items, from, to));
  return (
    <div className="grid gap-2">
      <p className="label text-xs">{label}</p>
      {hint && <p className="-mt-1 text-xs text-muted">{hint}</p>}
      {items.map((item, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <input
            aria-label={`${label} ${i + 1}`}
            className={`${inputClass} min-w-0 flex-1`}
            value={item}
            placeholder={placeholder}
            onChange={(e) => set(i, e.target.value)}
          />
          <ItemControls index={i} count={items.length} onMove={move} onRemove={(j) => onChange(items.filter((_, k) => k !== j))} />
        </div>
      ))}
      {items.length < max && (
        <button type="button" className={`${smallButton} justify-self-start`} onClick={() => onChange([...items, ""])}>
          + Agregar
        </button>
      )}
    </div>
  );
}

export function moveItem<T>(arr: T[], from: number, to: number) {
  const next = [...arr];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}
