# Everest Electronics

Website perusahaan **Everest Electronics** — rekan utama dalam penjualan dan layanan purna jual sistem pendingin udara di Indonesia sejak 1998.

Next.js 16 (App Router) + TypeScript + Tailwind v4, dengan CMS admin (Prisma + PostgreSQL) dan konversi utama lewat WhatsApp. Dibangun dari desain Figma (`Web` page: desktop + mobile single-scroll).

## Stack

- **Next.js 16** + React 19 + TypeScript + Tailwind v4
- **Prisma 7** + PostgreSQL (DB dedicated `everest_electronics`)
- **Cloudflare R2 CDN** (`cdn.denovamind.com`, prefix `everest-electronics/`)
- Admin CMS password-protected
- WhatsApp CTA (floating button + tiap layanan/promo/konsultasi)

## Halaman

| Route | Keterangan |
|-------|-----------|
| `/` | Landing page (Hero, Retail/Services, Official Distributors, For Business, Clients, Find Us, Footer) |
| `/tentang` | Tentang Kami (Visi/Misi + Award) |
| `/blog` | Index artikel |
| `/blog/[slug]` | Detail artikel (+ Find More) |
| `/admin` | Dashboard admin (auth) |
| `/admin/blog`, `/admin/services`, `/admin/awards`, `/admin/branches`, `/admin/settings` | CRUD CMS |

## Environment variables

| Var | Keterangan |
|-----|-----------|
| `DATABASE_URL` | Connection string Postgres (`everest_electronics`) |
| `AUTH_SECRET` | Secret untuk sesi admin (≥32 chars) |
| `ADMIN_PASSWORD` | Password login admin |
| `SITE_URL` | URL produksi |
| `STORAGE_DRIVER` | `r2` |
| `CDN_ENDPOINT`, `CDN_ACCESS_KEY`, `CDN_SECRET_KEY`, `CDN_BUCKET`, `CDN_REGION`, `CDN_KEY_PREFIX` | Kredensial R2 |
| `NEXT_PUBLIC_CDN_URL`, `NEXT_PUBLIC_CDN_KEY_PREFIX` | URL CDN publik + prefix |

## Development

```bash
npm install
npx prisma generate
npx prisma db push        # inisialisasi schema (sekali)
npm run seed              # seed konten + upload asset ke CDN (sekali)
npm run dev
```

## Tests

```bash
npm test
```

## Deploy

Push ke `main` → auto-deploy via Zeabur (proyek Denova-Apps). Build standalone via Dockerfile.

```bash
git push origin main
```
