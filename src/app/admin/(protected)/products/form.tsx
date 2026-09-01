"use client";

import { updateProduct, deleteProduct } from "./actions";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

function Field({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-semibold text-graphite">{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
    </div>
  );
}

export function Updater({ p }: { p: { id: string; title: string; slug: string; tags: string; description: string; content: string; iconUrl: string | null; imageUrl: string | null; learnMoreUrl?: string | null; sortOrder: number } }) {
  return (
    <form action={updateProduct} className="rounded-xl border border-line-soft bg-white p-5">
      <input type="hidden" name="id" value={p.id} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field name="title" label="Judul" defaultValue={p.title} />
        <Field name="slug" label="Slug URL" defaultValue={p.slug} placeholder="otomatis dari judul" />
        <Field name="tags" label="Tags" defaultValue={p.tags} />
        <Field name="learnMoreUrl" label="Learn More URL" defaultValue={p.learnMoreUrl ?? ""} placeholder="https://…" />
        <Field name="sortOrder" label="Urutan" defaultValue={String(p.sortOrder)} placeholder="0" />
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="mb-1 block text-xs font-semibold text-graphite">Excerpt — tampil di kartu beranda &amp; hasil pencarian</label>
          <textarea name="description" rows={2} defaultValue={p.description}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="mb-1 block text-xs font-semibold text-graphite">Deskripsi Detail — tampil di halaman produk</label>
          <RichTextEditor name="content" defaultValue={p.content} minHeight={220} />
          <p className="mt-1 text-xs text-mist">Kosongkan untuk memakai excerpt.</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <ImageUploader name="iconUrl" label="Icon Produk (kartu di beranda)" defaultValue={p.iconUrl} />
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <ImageUploader name="imageUrl" label="Gambar Detail Produk" defaultValue={p.imageUrl} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <ConfirmSubmit label="Simpan" checkText="Saya yakin memperbarui produk ini" confirmDialog="Simpan perubahan produk ini?" />
        <button
          type="submit"
          formAction={deleteProduct}
          onClick={(e) => {
            if (!window.confirm(`Hapus produk "${p.title}" secara permanen?`)) e.preventDefault();
          }}
          className="rounded-md border border-line-soft px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Hapus
        </button>
      </div>
    </form>
  );
}
