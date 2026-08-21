"use client";

import { updateProduct, deleteProduct } from "./actions";

function Field({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-semibold text-graphite">{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
    </div>
  );
}

export function Updater({ p }: { p: { id: string; title: string; tags: string; description: string; iconUrl: string | null; sortOrder: number } }) {
  return (
    <form action={updateProduct} className="rounded-xl border border-line-soft bg-white p-5">
      <input type="hidden" name="id" value={p.id} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field name="title" label="Judul" defaultValue={p.title} />
        <Field name="tags" label="Tags" defaultValue={p.tags} />
        <Field name="iconUrl" label="Icon URL" defaultValue={p.iconUrl || ""} />
        <Field name="sortOrder" label="Urutan" defaultValue={String(p.sortOrder)} placeholder="0" />
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="mb-1 block text-xs font-semibold text-graphite">Deskripsi</label>
          <textarea name="description" rows={2} defaultValue={p.description}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand" />
        </div>
      </div>
      <div className="mt-3 flex gap-3">
        <button className="btn-brand px-5 py-2 text-sm">Simpan</button>
        <DeleteButton id={p.id} />
      </div>
    </form>
  );
}

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteProduct} className="inline">
      <input type="hidden" name="id" value={id} />
      <button className="rounded-md border border-line-soft px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
        Hapus
      </button>
    </form>
  );
}
