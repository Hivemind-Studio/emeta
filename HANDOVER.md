# Emeta Website — Admin Handover Guide

## 1. What the website does (visitor-facing features)

**Home page**
- Hero section with company intro and a **"Get in Touch" email box**.
  Every valid email submitted here is automatically saved into the
  **newsletter list** (see Admin → Newsletter below).
- About Us section with company stats.
- **Products & Solutions** — cards for each product (WrenAI, BarkingDog, Phison…).
  Clicking a card opens that product's own detail page (photo, date, tags,
  full description), followed by the CTA and Contact sections.
- **News & Blogs** — latest 3 posts + "Find More" link to the blog page.
- **CTA banner ("Book a Demo")** — clicking it takes the visitor straight to
  the contact form with a demo-request message already typed in.
- **Contact section** — office info, map, and a **Send a Message form**.
  When a visitor submits it, the message is emailed instantly to the
  company inbox you set in admin. The visitor stays on the page and sees a
  success message.

**Other pages**: Blog list, article read page, Coming Soon page (shown when
Products is switched off), Privacy Policy, Terms.

---

## 2. Admin guide (day-to-day tasks)

### Logging in
1. Go to **emeta.zeabur.app/admin**
2. Sign in with:
   - **Email:** `admin@emeta.co.id`
   - **Password:** `emeta-admin-2026`
3. Keep this password private. To change it, ask your developer to update
   the admin password on the hosting settings.

### Managing Products (Admin → Produk)
- **Add:** fill in Title, Tags, Description, upload an Icon → tick the
  confirmation box → confirm → **Ya, Tambah Produk**.
- **Edit:** change any field on the product card → tick the confirmation box →
  **Simpan**.
- **Delete:** press **Hapus** → confirm the popup. This cannot be undone.
- **Slug URL** = the web address of the product's detail page
  (e.g. `wrenai`). Leave it empty when creating and the site makes one from
  the title automatically.
- Use **Lihat halaman ↗** to preview how the product page looks.
- **Urutan** controls the display order on the home page (0 first).

### Managing Blog posts (Admin → Artikel)
- **Tambah Artikel** creates a post: title, excerpt (short summary),
  full content, image.
- Tick **Terbit (published)** to make it visible; untick to hide it as draft.
- **Featured** posts appear on the home page's News & Blogs section.
- Edit opens the same form; **Hapus** deletes (asks for confirmation first).

### Site settings (Admin → Pengaturan)
Almost everything text-related on the site lives here:
- **Branding & contact:** brand name, phone, address, social media links,
  copyright line.
- **Inquiry Email** ⭐ — *the mailbox that receives every "Send a Message"
  submission.* Change it here anytime; no developer needed.
- Home page texts: hero title/body, about text, stats numbers,
  Offerings heading, News heading, CTA title/subtitle/button label,
  contact heading, Coming Soon title & quote.
- **Products & Solutions — aktif** checkbox:
  - ✅ ON → navbar "Products" scrolls to the products section, product
    pages are live.
  - ⬜ OFF → the products section disappears and the menu shows the
    **Coming Soon** page instead.
- **Aset CDN:** upload hero background, white/blue logos, map image.
- Save with the confirmation tick at the bottom (**Simpan Pengaturan**).

### Newsletter list
Every email captured by the hero "Get in Touch" box is stored
(duplicates ignored, invalid emails rejected). Ask your developer to export
the list when you want to run a mailing campaign — or use it directly from
the database/admin later if an export button is added.

### Safety rails built into the admin
- Every **save / update / delete** asks you to confirm before anything is
  applied (checkbox + popup). Nothing changes by accident.
- Deleting is permanent — double-check before confirming.

---

## 3. Quick reference

| I want to… | Go to |
|---|---|
| Change who receives contact messages | Pengaturan → Inquiry Email |
| Hide/show the Products section | Pengaturan → Products & Solutions aktif |
| Add a new product | Produk → Tambah Produk |
| Post news/article | Artikel → Tambah Artikel |
| Edit homepage texts | Pengaturan |
| See saved subscriber emails | (stored automatically — ask dev for export) |

*That's everything an administrator needs. No coding required for daily use.*
