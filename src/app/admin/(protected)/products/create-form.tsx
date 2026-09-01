"use client";

import { createProduct } from "./actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { ImageUploader } from "@/components/admin/ImageUploader";

function Field({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-ink-soft">{label}</label>
      <input id={name} name={name} placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-brand" />
    </div>
  );
}

export function ProductCreateForm() {
  return (
    <form action={createProduct} className="mt-4 grid gap-4 sm:grid-cols-2">
      <Field name="title" label="Judul" placeholder="WrenAI" />
      <Field name="slug" label="Slug URL (opsional)" placeholder="wrenai — kosongkan untuk otomatis" />
      <Field name="tags" label="Tags (koma-pisah)" placeholder="Data, AI, For Business" />
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-ink-soft">Excerpt — tampil di kartu beranda &amp; hasil pencarian</label>
        <textarea name="description" rows={3} placeholder="Ringkasan singkat produk..."
          className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-brand" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-ink-soft">Deskripsi Detail — tampil di halaman produk (opsional)</label>
        <textarea name="content" rows={8} placeholder={"## Fitur Utama\n\n- Poin pertama\n- Poin kedua\n\nParagraf penjelasan dengan **teks tebal**."}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm outline-none focus:border-brand" />
        <p className="mt-1 text-xs text-mist">
          Format: <code>## Judul</code>, <code>### Sub-judul</code>, <code>- daftar</code>, <code>**tebal**</code>, <code>*miring*</code>. Kosongkan untuk memakai deskripsi singkat.
        </p>
      </div>
      <div className="sm:col-span-2">
        <ImageUploader name="iconUrl" label="Icon Produk — kartu di beranda (opsional)" />
      </div>
      <div className="sm:col-span-2">
        <ImageUploader name="imageUrl" label="Gambar Detail Produk — halaman produk (opsional)" />
      </div>
      <Field name="learnMoreUrl" label="Learn More URL (opsional)" placeholder="https://…" />
      <Field name="sortOrder" label="Urutan (0,1,2...)" placeholder="0" />
      <div className="sm:col-span-2">
        <ConfirmSubmit label="Simpan Produk" confirmLabel="Ya, Tambah Produk" checkText="Saya yakin menambah produk baru" confirmDialog="Tambah produk baru ini?" />
      </div>
    </form>
  );
}
