# Emeta Mobile UI — Iteration 2 Design Review

**Reviewer:** UI Designer agent · **Viewport:** 390×844 · **After:** iteration 1 fixes deployed
**Verdict:** Big improvement — no overflow, sections stack, forms full-width. Remaining issues are polish-level: vertical rhythm is still desktop-scaled (paddings too big), a few fixed-size elements feel oversized on small screens, and the CTA/hero art needs contrast tuning.

---

## Findings (iteration 2)

### A. Rhythm & spacing
1. **MEDIUM — Desktop-scale section paddings on mobile.** `Contact Us` heading still has `pt-[80px]` before it after the CTA band; blog "News & Blogs" heading `pt-[80px]` reads fine but the Featured→grid gap (`mt-[64px]`) plus card gap 64px makes long empty runs. **Fix:** mobile paddings: contact `pt-[56px]`, grid gaps `gap-y-[40px] md:gap-y-[64px]`, featured panel bottom `pb-[60px]` (done) — also reduce `#news` heading → grid margin to `mt-[40px] md:mt-[64px]`.
2. **MEDIUM — Hero (home): form sits close under body copy; hero total height now 720px but content ends ~600px leaving blue void below the button.** **Fix:** hero mobile height `h-auto min-h-[620px] pb-[64px]` instead of fixed 720px; keeps gradient bleed without dead space.
3. **LOW — Stats band:** stacked values look good; add subtle dividers or keep — fine. No change needed.
4. **MEDIUM — Product & Solutions cards:** blue title strip + tags + description + Learn More all left-aligned nicely, but card corner radius 16 vs image-less design feels plain on mobile; acceptable. Keep.

### B. Typography
5. **MEDIUM — Product detail title "WrenAI" still renders at 54px on mobile.** The h1 uses `text-[54px]` without a mobile override (only the wrapper font-size changed). At 390px it wraps awkwardly and dominates. **Fix:** `text-[38px] leading-[46px] md:text-[54px] md:leading-[64px]`.
6. **LOW — Product date "August 21, 2026" at 18px matches body weight — good.** No change.
7. **LOW — Blog article h1 at 32px works well.** No change.

### C. Components
8. **HIGH — Product hero fallback shows the full OG cover art (with text/pills baked in)** when product has no icon — looks like a misplaced banner rather than a product image. **Fix:** use a neutral branded treatment: brand-blue background with centered white Emeta *icon only* (`brandUrl("iconWhite")` at ~120px, opacity-90) instead of og-cover.jpg. Same for NewsCard fallback? NewsCard fallback with og-cover reads okay as an article thumbnail — keep there, change product only.
9. **MEDIUM — "Find More / Here" cards:** on mobile they're full-width 400px tall solid blue blocks — heavy. **Fix:** reduce mobile height to `h-[200px] md:h-[400px]`; keep centered text.
10. **MEDIUM — Header:** logo overlaps "Get in Touch" button edge-to-edge on 320–360px devices (fine at 390). **Fix:** logo `h-[36px] sm:h-[40px] md:h-[52px] md:w-[174px] w-auto`, button `hidden xs:inline-flex`… simplest robust fix: allow header row `gap-3` and logo `max-w-[140px] md:max-w-none object-contain object-left`.
11. **LOW — Coming Soon page:** title block now bottom-anchored ✓. Quote max-width causes 2 lines — good. No further change.
12. **LOW — Map iframe** renders as light gray box in screenshots (emulator limitation); placeholder bg added ✓. Verify on real device later.

### D. Color/contrast
13. **MEDIUM — Hero email input:** white input on light part of hero bg has weak edge definition on mobile full-width. **Fix:** add `ring-1 ring-black/5` on mobile (keep border).
14. **LOW — CTA blob opacity 60% improved legibility ✓.** Book a Demo button clear. Done.

---

## Engineer checklist — iteration 2

- [ ] A1: contact pt-56 mobile; news heading mt-40/md-64; grid gaps 40/64
- [ ] A2: hero `h-auto min-h-[620px] pb-[64px] md:h-[720px]` (remove fixed 720)
- [ ] B5: product h1 mobile 38px
- [ ] C8: product hero fallback = iconWhite on brand blue (not og-cover)
- [ ] C9: Find More cards h-200 mobile
- [ ] C10: header logo/CTA sizing guard for ≤360px
- [ ] D13: hero input ring on mobile
