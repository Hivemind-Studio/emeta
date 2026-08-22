"use client";

import { useState } from "react";

/**
 * Newsletter email capture (hero "Get in Touch").
 * Validates the format client-side, posts to /api/newsletter (saved to DB),
 * then shows inline success/error feedback.
 */
export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", body: data });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && json.ok) {
        setState("ok");
        setMsg("Thanks! Your email has been saved.");
        form.reset();
      } else {
        setState("error");
        setMsg(json.error || "Please enter a valid email address.");
      }
    } catch {
      setState("error");
      setMsg("Network error — please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex" noValidate>
        <input
          type="email"
          placeholder="Email"
          name="email"
          aria-label="Email for newsletter"
          className="mr-[19px] h-[48px] w-[360px] rounded-[8px] border border-[#e5e7eb] bg-paper px-4 font-inter text-[14px] text-ink-soft outline-none placeholder:text-graphite"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex h-[47px] w-[154px] items-center justify-center rounded-[8px] bg-brand-light px-6 font-inter text-[16px] font-semibold text-white transition-colors hover:bg-[#6fa8ee] disabled:opacity-60"
        >
          {state === "loading" ? "Sending…" : "Get in Touch"}
        </button>
      </form>
      {state === "ok" && <p className="mt-[12px] text-[14px] text-white/90">✓ {msg}</p>}
      {state === "error" && (
        <p className="mt-[12px] text-[14px] text-red-200">{msg}</p>
      )}
    </div>
  );
}
