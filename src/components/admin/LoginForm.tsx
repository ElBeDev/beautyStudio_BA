"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { inputClass } from "./fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="grid gap-1.5">
        <span className="label text-xs">Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" autoFocus className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-vino">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="label flex items-center justify-between bg-ink px-6 py-4 text-rosa transition-colors hover:bg-vino disabled:opacity-50"
      >
        {pending ? "Entrando…" : "Entrar"}
        <span aria-hidden="true" className="text-xl leading-none font-light">
          +
        </span>
      </button>
    </form>
  );
}
