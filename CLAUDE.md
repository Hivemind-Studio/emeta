# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Marketing website + admin CMS for **PT Emeta Teknologi Indonesia** (AI & enterprise software company). Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, Prisma 7 + PostgreSQL for content, Cloudflare R2 for asset storage, WhatsApp links as the main conversion channel, and an email contact form via SMTP.

**README.md is stale** — it describes a different, previously-templated business ("Everest Electronics", an AC sales/service company) and should not be trusted for what this site is or does. Trust `HANDOVER.md`, the Prisma schema, and route metadata instead. A few leftover traces of that template still exist in code (e.g. `src/lib/wa.ts` default messages reference AC/pendingin udara, `container-everest` alongside `container-emeta` in `globals.css`) — don't propagate them further, and prefer the `emeta`-named equivalents when editing nearby code.

## Commands

```bash
npm install
npx prisma generate        # regenerate client into src/generated/prisma
npx prisma db push         # sync schema to DB (no migrations dir in use)
npm run seed                # tsx prisma/seed.ts — seed content + upload brand assets to R2
npm run dev
npm run build
npm run start
npm run lint                 # eslint
```

There is no test script in `package.json` and no test files exist, despite `vitest` and `@playwright/test` being devDependencies and the README referencing `npm test` — that command will fail as-is.

## Architecture

**Data layer.** All reads go through `src/lib/data.ts` (`getSettings`, `getProducts`, `getPublishedPosts`, etc.) on top of a single Prisma client singleton in `src/lib/db.ts` (uses `PrismaPg` adapter, generated client output lives at `src/generated/prisma`, imported as `@/generated/prisma/client` — not the default `@prisma/client` path). `GlobalSettings` is a singleton row (`id: 1`, `upsert`ed in `getSettings`) that holds almost all site copy: hero/about/CTA text, section headings, contact info, the `productsEnabled` toggle, and the admin-editable `inquiryEmail`. Other models: `Product`, `BlogPost` (+ `BlogSlugAlias` for 301 redirects after slug changes), `NewsletterSubscriber`.

**Admin CMS.** Lives under `src/app/admin`, protected route group `(protected)/` whose `layout.tsx` calls `requireAuth()`. Auth is custom (not NextAuth): `src/lib/auth.ts` signs a JWT with `jose` into an httpOnly cookie; there's no user table — a single `ADMIN_PASSWORD` is compared via HMAC + `timingSafeEqual`. Each admin section (`blog/`, `products/`, `settings/`) has its own `actions.ts` with server actions. Every mutating action follows a confirm-before-apply pattern: a confirmation checkbox + `src/components/admin/ConfirmSubmit.tsx`, surfaced via `AdminToast`/`Feedback` components.

**Storage.** `src/lib/storage/` defines a `StorageDriver` interface (`index.ts`) with a single implementation, `r2.ts` (Cloudflare R2 via `@aws-sdk/client-s3`, resizes/converts with `sharp`). The driver is chosen by `STORAGE_DRIVER` env and throws rather than silently falling back if unset/unrecognized — there is no local-disk driver. `url.ts` is deliberately dependency-free (no fs/S3/sharp) so it's safe to import from client components for building public CDN URLs (`buildAssetUrl`); keep it that way — don't add I/O to it. Driver imports in `index.ts` are static (not `require()`) because dynamic requires break under the Turbopack standalone build.

**Public site.** `src/app/page.tsx` composes the homepage sections; `src/components/` holds shared pieces (`Header`, `Footer`, `ContactForm`, `NewsletterForm`, `NewsCard` — reused by both the homepage and `/blog`, `CtaContact`/`DemoMessageFiller` for the "Book a Demo" prefilled-WhatsApp/contact flow). `src/app/api/inquiry/route.ts` sends the contact form via nodemailer SMTP to `GlobalSettings.inquiryEmail` (falling back to env, then a constant) and returns JSON (the form shows inline feedback, no redirect) — it 503s if SMTP env vars aren't set. `src/app/api/newsletter/route.ts` captures homepage hero emails into `NewsletterSubscriber`. `src/lib/wa.ts` builds `wa.me` deep links and is pure/client-safe.

**Styling.** Tailwind v4 via `@theme` tokens in `src/app/globals.css` (brand color palette — `--color-brand`, etc. — and font vars wired to `next/font` in the root layout). `src/app/motion.css` implements scroll-driven parallax/reveals using CSS `animation-timeline`, gated to desktop only; sections opt in via ancestor classes like `.motion-hero`. Recent history (see `git log`) has been a steady stream of Figma-pixel-accuracy and mobile-responsiveness fixes — desktop values are treated as the source of truth (from Figma) and mobile styles are added alongside via `md:`/responsive variants without changing desktop output; check `docs/design-reviews/` for the design QA process before making layout changes.

**Deploy.** Zeabur, auto-deploy on push to `main`, standalone Docker build (`output: "standalone"` in `next.config.ts`). No CI config in this repo.
