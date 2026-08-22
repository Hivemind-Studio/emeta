# Emeta Mobile UI — Design Review & Fix Plan

**Reviewer:** UI Designer agent · **Date:** 22 Aug 2026 · **Viewport:** 390×844 (iPhone 13)
**Scope:** All public pages — Home, Blog list, Blog article, Product detail, Coming Soon, Privacy/Terms, Footer. Admin excluded per request.
**Process:** 3 iterations. Engineer picks up each iteration's findings, implements, re-screenshots; designer re-reviews.

**Overall verdict (iteration 1):** Desktop-first layout mechanically shrunk onto mobile. Nothing overflows anymore, but spacing, hierarchy and rhythm are unpolished. The site is *usable* but reads as "compressed desktop", not a designed mobile experience.

---

## 🔴 P0 — Must fix (iteration 1)

### 1. Hero email form overflows the viewport (Home)
- **Where:** `src/components/NewsletterForm.tsx`
- **Problem:** input is fixed `w-[360px]` + button `w-[154px]` + 19px gap = 533px on a 390px screen. The "Get in Touch" button is clipped off-screen; the input touches the right edge.
- **Fix:** stack vertically on mobile: `flex-col gap-[12px] sm:flex-row sm:gap-0`, input `w-full sm:w-[360px] sm:mr-[19px]`, button full-width on mobile (`w-full sm:w-[154px]`). Keep desktop pixel-identical.

### 2. Stats band labels collide (Home, About section)
- **Where:** `src/app/page.tsx` — stats row (`flex justify-around`)
- **Problem:** "3000+" runs into "35", "Channel Partners" and "Strategic Locations" labels overlap into one unreadable line. Three columns don't fit 390px.
- **Fix:** on mobile stack vertically with dividers: `flex-col gap-[28px] sm:flex-row sm:justify-around sm:gap-0`; center text; add `text-center sm:text-left`. Desktop unchanged.

### 3. About section: heading + paragraph squeeze side-by-side
- **Where:** `src/app/page.tsx` — about flex row (`flex items-start justify-between`)
- **Problem:** "PT Emeta Teknologi Indonesia" heading and the "Founded in (YEAR)…" paragraph are forced into two ~45% columns; paragraph text wraps every 3–4 words.
- **Fix:** stack on mobile: `flex-col gap-[24px] md:flex-row md:items-start md:justify-between md:gap-10`. Heading `w-full md:w-[533px]`, paragraph `w-full md:w-[360px]`.

### 4. Product cards: header strip + tags overflow their card
- **Where:** `src/app/page.tsx` — product card (`w-[360px]` inside `flex-col gap-[24px]`)
- **Problem:** card is fixed 360px wide inside a 390px viewport with px-6 page padding (342px available) → card overflows by ~18px, blue header strip and tag pills touch/clip the right edge. Also all 3 cards have identical description text (content issue, flag to content owner).
- **Fix:** card `w-full md:w-[360px]`; inner paddings stay. Page container already `px-6`.

### 5. Coming Soon: title pushed to bottom of a 1024px-tall section
- **Where:** `src/app/coming-soon/page.tsx` (`pt-[694px]` inside `h-[1024px]`)
- **Problem:** on mobile the "Coming Soon…" title starts ~2.5 screens down; users see a giant empty blue wall first. "Go Back" button nearly touches the bottom edge.
- **Fix:** mobile: `min-h-[calc(100svh-88px)] flex items-end pb-[48px]` wrapper instead of fixed height + huge top padding; keep `md:h-[1024px] md:pt-[694px]`. Title scale down `text-[38px] md:text-[54px]`.

### 6. Footer: giant empty top area on every page
- **Where:** `src/components/Footer.tsx` (`pt-[120px]` mobile / `pt-[366px]` desktop)
- **Problem:** even at 120px the footer starts with a big blank band (the blurred icon is invisible on mobile), then columns, then ~200px of empty blue before the copyright (`mt-[82px]` + fixed `h-[1024px]`).
- **Fix (mobile only):** `pt-[48px] md:pt-[366px]`; footer container `py-[56px] md:h-[1024px]` (drop fixed height on mobile so it hugs content); copyright `mt-[40px] md:mt-[82px]`; columns `grid grid-cols-2 gap-[24px] md:flex md:gap-[80px]`.

---

## 🟡 P1 — Should fix (iteration 1, second batch)

### 7. Blog article: hero image too tall + huge dead space after content
- **Where:** `src/app/blog/[slug]/page.tsx` (`aspect-[1128/546]` hero, `min-h-[1133px]` content)
- **Problem:** hero renders ~185px on mobile — acceptable — but `min-h-[1133px]` forces ~2 screens of blank space after a short article before "Related Articles".
- **Fix:** `min-h-0 md:min-h-[1133px]`. Related section `pt-[80px] md:pt-[120px]` (already done).

### 8. Related Articles cards: excerpt clipped to 1 line mid-word
- **Where:** `src/components/NewsCard.tsx` (excerpt `line-clamp-1` on mobile card width)
- **Problem:** at 358px card width the 1-line clamp shows "How PT Emeta Teknologi…" — teaser value lost.
- **Fix:** excerpt `line-clamp-2` on mobile, `line-clamp-1 md:line-clamp-1`… actually simplest: `line-clamp-2` everywhere; card height 400px has room (verified: title 3 lines + 2-line excerpt + date fits).

### 9. CTA band: blob artwork overwhelms text on mobile
- **Where:** `src/components/CtaContact.tsx` — CTA section
- **Problem:** the purple blob + white icon sit behind/over the heading at full opacity on mobile; "Here For you" text has poor contrast over the blob; panel feels cramped (`h-[332px]` fixed).
- **Fix (mobile only):** panel `min-h-[280px] md:h-[332px]`; blob layer `opacity-60 md:opacity-100`; content `pb-[32px]` so button isn't glued to edge; heading `text-[30px]` (done), add `max-w-[85%]`.

### 10. Contact info rows: labels and values tight; map missing on product page mobile
- **Where:** `src/components/CtaContact.tsx` — ContactSection
- **Problem:** "Our Office/Phone/Email" blocks fine, but the map iframe is 240px tall full-width — looks okay; the real issue: between info block and map there's a stray empty rounded box (the map renders blank/white on mobile screenshot — lazy iframe may not paint in emulator; verify on real device).
- **Fix:** give the map container a subtle `bg-brand-soft` placeholder + `loading="lazy"` already set. Add `mt-[24px] md:mt-[40px]` between info and map for breathing room.

### 11. Section vertical rhythm inconsistent on Home
- **Where:** `src/app/page.tsx`
- **Problem:** About section has no bottom padding before Offerings (stats band → giant white gap → OFFERINGS). Offerings/News use `py-[100px]` but About uses fixed `md:h-[512px]` with no mobile padding — rhythm jumps.
- **Fix:** About `py-[80px] md:h-[512px] md:py-0`; keep others.

### 12. Header: logo + Get in Touch crowd the hamburger
- **Where:** `src/components/Header.tsx`
- **Problem:** logo (174px) + button (154px) + hamburger = 360px of 390px; only ~15px gaps. Button label "Get in Touch" at 16px feels oversized next to the burger.
- **Fix (mobile only):** logo `h-[40px] w-auto md:h-[52px] md:w-[174px]`; CTA button `h-[40px] px-4 text-sm md:h-[47px] md:w-[154px] md:text-base`; ensure `gap-3`.

---

## 🟢 P2 — Polish (iteration 2/3 candidates)

13. **Blog featured panel:** inner cards are full-width but the blue panel padding (32px) + card shadow reads heavy; consider `px-[16px] md:px-[32px]` and panel `pb-[60px] md:pb-[120px]` (done partially).
14. **Tag pills on product detail** wrap to 2 rows with tight 8px gap — fine, but pill height 23px is a small tap target; acceptable since non-interactive.
15. **"Go Back" button** on Coming Soon is `w-[120px]` fixed — fine, but add `active:scale-95` transition for tactile feel.
16. **Footer social icons** 36px circles — meets 44px guideline only with spacing; add `h-[40px] w-[40px]` on mobile.
17. **Legal pages** (Privacy/Terms): content column has no `px-6` on mobile? Verified has px-6 — but title "Kebijakan Privasi" (Indonesian) vs English site language — content decision for owner.
18. **Product detail date** shows "21 Agustus 2026" (id-ID) while blog shows English months — unify to `en-US` like the blog card.

---

## Engineer checklist for iteration 1 (P0 + selected P1)

- [ ] 1. NewsletterForm stack on mobile
- [ ] 2. Stats band stack on mobile
- [ ] 3. About section stack on mobile
- [ ] 4. Product card `w-full md:w-[360px]`
- [ ] 5. Coming Soon mobile layout (no 694px push)
- [ ] 6. Footer mobile rhythm (pt-48, no fixed height, tighter copyright)
- [ ] 7. Remove `min-h-[1133px]` on mobile article
- [ ] 8. NewsCard excerpt `line-clamp-2`
- [ ] 9. CTA band mobile polish (min-height, blob opacity, padding)
- [ ] 10. Contact map spacing + placeholder bg
- [ ] 11. About section mobile padding rhythm
- [ ] 12. Header mobile sizes
- [ ] 18. Product date locale → en-US

**Rule: every change behind `md:` breakpoint or mobile-first default with `md:` restore — desktop must remain pixel-identical to Figma.**
