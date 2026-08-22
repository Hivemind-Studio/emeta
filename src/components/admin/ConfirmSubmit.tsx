"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Confirm-on-submit wrapper.
 * - Renders a checkbox "Saya yakin dengan perubahan ini" that must be checked
 *   before the submit button enables.
 * - Shows a browser-native confirm() as a second guard on click.
 * - Disables + labels the button while the server action is pending.
 */
export function ConfirmSubmit({
  label = "Simpan",
  confirmLabel = "Simpan",
  pendingLabel = "Menyimpan…",
  checkText = "Saya yakin dengan perubahan ini",
  confirmDialog = "Terapkan perubahan ini?",
}: {
  /** button text when unchecked */
  label?: string;
  /** button text once confirmed */
  confirmLabel?: string;
  /** button text while submitting */
  pendingLabel?: string;
  /** checkbox label */
  checkText?: string;
  /** native confirm dialog text (set "" to disable the dialog) */
  confirmDialog?: string;
}) {
  const [agreed, setAgreed] = useState(false);
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-ink-soft">
        <input
          type="checkbox"
          checked={agreed}
          disabled={pending}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-[18px] w-[18px] accent-[#1a60d9]"
        />
        {checkText}
      </label>
      <button
        type="submit"
        disabled={!agreed || pending}
        onClick={(e) => {
          if (confirmDialog && !window.confirm(confirmDialog)) e.preventDefault();
        }}
        className={`btn-brand px-6 py-3 text-sm transition-opacity ${
          agreed && !pending ? "" : "cursor-not-allowed opacity-50"
        }`}
      >
        {pending ? pendingLabel : agreed ? confirmLabel : label}
      </button>
      {!agreed && !pending && (
        <span className="text-xs text-graphite">Centang konfirmasi untuk mengaktifkan tombol.</span>
      )}
    </div>
  );
}

/** Small helper for delete buttons inside forms (no checkbox, just native confirm). */
export function DangerSubmit({
  children,
  confirmDialog = "Hapus data ini secara permanen?",
  className = "",
}: {
  children: ReactNode;
  confirmDialog?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmDialog)) e.preventDefault();
      }}
      className={
        className ||
        "rounded-md border border-line-soft px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
      }
    >
      {pending ? "Menghapus…" : children}
    </button>
  );
}
