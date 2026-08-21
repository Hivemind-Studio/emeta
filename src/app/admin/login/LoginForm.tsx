"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<{ error?: string }, FormData>(loginAction, {});

  return (
    <form action={action} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">
          Password Admin
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="••••••••"
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-navy"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-navy w-full px-6 py-3 disabled:opacity-60"
      >
        {pending ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}