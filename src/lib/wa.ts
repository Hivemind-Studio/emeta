/**
 * WhatsApp conversion helpers — used everywhere a CTA targets WhatsApp.
 * Pure string building, safe to import from client components.
 */

export function waNumber(number: string): string {
  // Normalize to digits; keep leading country code.
  return number.replace(/[^\d]/g, "");
}

export function waLink(number: string, message?: string): string {
  const n = waNumber(number);
  const base = `https://wa.me/${n}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Default inquiry message shown in the floating WhatsApp button. */
export function defaultWaMessage(brandName: string): string {
  return `Halo ${brandName}, saya ingin berkonsultasi tentang sistem pendingin udara / AC.`;
}

/** Per-service inquiry message. */
export function serviceWaMessage(brandName: string, serviceTitle: string): string {
  return `Halo ${brandName}, saya tertarik dengan layanan *${serviceTitle}*. Mohon informasinya.`;
}

/** Consultation banner message. */
export function consultationWaMessage(brandName: string): string {
  return `Halo ${brandName}, saya ingin konsultasi AC skala bisnis / rumah tangga.`;
}

/** Promo claim message. */
export function promoWaMessage(brandName: string): string {
  return `Halo ${brandName}, saya ingin klaim promo Clean & Service. Mohon detailnya.`;
}