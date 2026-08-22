"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * "Book a Demo" CTA → jumps to the contact form and pre-fills the message
 * with a demo request (?demo=1). Reads the query param on mount.
 */
function DemoMessageFillerInner() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("demo") !== "1") return;
    const el = document.querySelector<HTMLTextAreaElement>(
      '#contact form textarea[name="message"]',
    );
    if (el && el.value.trim() === "") {
      el.value =
        "I want to request a demo. Please contact me to schedule a product demonstration.";
    }
  }, [params]);

  return null;
}

export function DemoMessageFiller() {
  return (
    <Suspense fallback={null}>
      <DemoMessageFillerInner />
    </Suspense>
  );
}
