"use client";

import { useState } from "react";

/**
 * "Send a Message" contact form — posts via fetch and shows inline
 * feedback on the page (no redirect).
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("loading");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: new FormData(form) });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && json.ok) {
        setState("ok");
        setMsg("Your message has been sent. We will get back to you soon.");
        form.reset();
      } else {
        setState("error");
        setMsg(json.error || "Failed to send your message. Please try again.");
      }
    } catch {
      setState("error");
      setMsg("Network error — please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-[28px] space-y-[16px]" noValidate={false}>
      {(["Name", "Email", "Message"] as const).map((label) => (
        <div key={label}>
          <label className="text-[14px] font-semibold text-graphite">{label}</label>
          {label === "Message" ? (
            <textarea name="message" required placeholder="Describe your requirements..." rows={3}
              className="mt-[8px] h-[100px] w-full rounded-[8px] border-none bg-white px-4 py-3 text-[14px] text-graphite outline-none placeholder:text-graphite" />
          ) : (
            <input type={label === "Email" ? "email" : "text"} name={label.toLowerCase()} required
              placeholder={label === "Name" ? "Your name" : "your@email.com"}
              className="mt-[8px] h-[48px] w-full rounded-[8px] border-none bg-white px-4 text-[14px] text-graphite outline-none placeholder:text-graphite" />
          )}
        </div>
      ))}
      <button type="submit" disabled={state === "loading"}
        className="inline-flex h-[48px] w-[168px] items-center justify-center rounded-[8px] bg-brand text-[16px] font-semibold text-white transition-opacity disabled:opacity-60">
        {state === "loading" ? "Sending…" : "Submit Inquiry"}
      </button>
      {state === "ok" && (
        <p className="text-[14px] font-medium text-emerald-600">✓ {msg}</p>
      )}
      {state === "error" && (
        <p className="text-[14px] font-medium text-red-600">{msg}</p>
      )}
    </form>
  );
}
